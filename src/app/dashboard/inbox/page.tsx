import { redirect } from "next/navigation";
import { format, parseISO } from "date-fns";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Contact = { instagram?: string; whatsapp?: string; facebook?: string; phone?: string; email?: string };

export default async function InboxTab() {
  const session = await getSession();
  if (!session) redirect("/login");

  const responses = await prisma.response.findMany({
    where: { datePage: { userId: session.userId } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-rose-950">Inbox</h1>
      <p className="mt-1 text-sm text-rose-700/70">Everyone who said yes shows up here ❤️</p>

      <div className="mt-6 flex flex-col gap-4 pb-6">
        {responses.length === 0 && (
          <p className="text-rose-400">No matches yet — once your page is live, replies will show up here.</p>
        )}
        {responses.map((r) => {
          const contact = r.recipientContact as Contact;
          const preferences = Array.isArray(r.preferenceSelections) ? (r.preferenceSelections as string[]) : [];
          return (
            <div key={r.id} className="rounded-2xl bg-white p-5 shadow-sm shadow-rose-100">
              <p className="font-semibold text-rose-950">{r.recipientName} said yes! ❤️</p>
              <p className="mt-1 text-sm text-rose-700/80">
                {format(parseISO(r.chosenDate), "EEEE, MMMM d")} at {r.chosenTime} ({r.timezone})
              </p>
              {preferences.length > 0 && (
                <p className="mt-1 text-sm text-rose-700/80">Picked: {preferences.join(", ")}</p>
              )}
              {r.recipientMessage && <p className="mt-2 text-sm italic text-rose-600">“{r.recipientMessage}”</p>}
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-rose-500">
                {contact.instagram && <span>IG: {contact.instagram}</span>}
                {contact.whatsapp && <span>WhatsApp: {contact.whatsapp}</span>}
                {contact.facebook && <span>FB: {contact.facebook}</span>}
                {contact.phone && <span>Phone: {contact.phone}</span>}
                {contact.email && <span>Email: {contact.email}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
