import { Linking, Share } from "react-native";
import type { InboxResponse } from "./inbox";

/**
 * Getting from "they said yes" to actually talking to them.
 *
 * On the web these contact details render as text you have to select, copy,
 * switch apps and paste. That is the single worst moment in the product — it
 * lands right after the best one — and being able to open the conversation with
 * one tap is most of the reason this app is native at all.
 */

export type ReachOption = {
  key: string;
  label: string;
  /** What the person actually typed, shown so it can still be read and copied. */
  value: string;
  url: string;
};

const stripLeadingAt = (handle: string) => handle.trim().replace(/^@+/, "");

/** wa.me takes digits only — no plus, spaces or dashes. */
const digitsOnly = (phone: string) => phone.replace(/\D/g, "");

export function reachOptions(response: InboxResponse): ReachOption[] {
  const { contact } = response;
  const options: ReachOption[] = [];

  if (contact.whatsapp) {
    const digits = digitsOnly(contact.whatsapp);
    if (digits) {
      options.push({
        key: "whatsapp",
        label: "WhatsApp",
        value: contact.whatsapp,
        url: `https://wa.me/${digits}`,
      });
    }
  }

  if (contact.instagram) {
    const handle = stripLeadingAt(contact.instagram);
    if (handle) {
      // Instagram has no public deep link that opens a DM thread with someone
      // you have never messaged, so this opens their profile — one tap from
      // the message button, and honest about what it does.
      options.push({
        key: "instagram",
        label: "Instagram",
        value: `@${handle}`,
        url: `https://instagram.com/${handle}`,
      });
    }
  }

  if (contact.tiktok) {
    const handle = stripLeadingAt(contact.tiktok);
    if (handle) {
      options.push({ key: "tiktok", label: "TikTok", value: `@${handle}`, url: `https://tiktok.com/@${handle}` });
    }
  }

  if (contact.facebook) {
    const handle = stripLeadingAt(contact.facebook);
    if (handle) {
      options.push({
        key: "facebook",
        label: "Facebook",
        value: handle,
        url: handle.startsWith("http") ? handle : `https://facebook.com/${handle}`,
      });
    }
  }

  if (contact.phone) {
    const digits = digitsOnly(contact.phone);
    if (digits) {
      options.push({ key: "sms", label: "Message", value: contact.phone, url: `sms:${contact.phone}` });
      options.push({ key: "call", label: "Call", value: contact.phone, url: `tel:${contact.phone}` });
    }
  }

  if (contact.email) {
    options.push({ key: "email", label: "Email", value: contact.email, url: `mailto:${contact.email}` });
  }

  return options;
}

/**
 * Opens a contact method, reporting whether anything could handle it.
 *
 * `canOpenURL` is checked first because a phone with no WhatsApp installed
 * throws rather than falling back, and an unexplained crash is a worse answer
 * than "WhatsApp isn't installed".
 */
export async function openReach(option: ReachOption): Promise<boolean> {
  try {
    const supported = await Linking.canOpenURL(option.url);
    if (!supported) return false;
    await Linking.openURL(option.url);
    return true;
  } catch {
    return false;
  }
}

/** The native share sheet, for sending the invitation link to someone. */
export async function shareInvitation(url: string, firstName: string | null): Promise<void> {
  const opener = firstName ? `${firstName} has a question for you` : "I have a question for you";
  await Share.share({
    message: `${opener} 💌 ${url}`,
  });
}
