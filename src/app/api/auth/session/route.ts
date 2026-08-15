import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, createSessionToken, isNativeClient } from "@/lib/auth";
import { log, clientOf } from "@/lib/log";

/**
 * Who am I, and is my token still good?
 *
 * The app calls this on every cold start. A 401 means the stored token is gone
 * or was invalidated by a password change elsewhere, and the app returns to the
 * login screen.
 *
 * For the native client the response also carries a freshly signed token, so an
 * app that is opened at least once a month never expires out from under someone
 * — the browser has no equivalent need, since its cookie is re-set on login and
 * handing the token to page JavaScript is exactly what httpOnly prevents.
 */
export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    log.info("auth.session.anonymous", { client: clientOf(request) });
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      username: true,
      emailVerifiedAt: true,
      emailNotificationsEnabled: true,
      profile: { select: { firstName: true } },
    },
  });
  if (!user) {
    log.warn("auth.session.userGone", { userId: session.userId, client: clientOf(request) });
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const body = {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.profile?.firstName ?? null,
      emailVerified: user.emailVerifiedAt !== null,
      emailNotificationsEnabled: user.emailNotificationsEnabled,
    },
  };

  if (!isNativeClient(request)) {
    log.debug("auth.session.ok", { userId: user.id, client: "web", rotated: false });
    return NextResponse.json(body);
  }

  // Email and username come from the row, not the old token, so an address
  // changed in settings is reflected the next time the app starts. The version
  // is safe to carry over: getSession only returned if it still matches.
  const token = await createSessionToken({
    userId: user.id,
    email: user.email,
    username: user.username,
    tokenVersion: session.tokenVersion,
  });
  log.info("auth.session.ok", {
    userId: user.id, client: clientOf(request), rotated: true, emailVerified: user.emailVerifiedAt !== null,
  });
  return NextResponse.json({ ...body, token });
}
