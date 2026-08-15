import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiFetch } from "./api";

export type InboxResponse = {
  id: string;
  recipientName: string;
  contact: {
    instagram?: string;
    whatsapp?: string;
    facebook?: string;
    tiktok?: string;
    phone?: string;
    email?: string;
  };
  message: string | null;
  preferences: string[];
  chosenDate: string;
  chosenTime: string;
  timezone: string;
  photoUrl: string | null;
  createdAt: string;
};

type InboxPage = { responses: InboxResponse[]; nextCursor: string | null };

const CACHE_KEY = "whobela.inbox.v1";

export async function fetchInbox(cursor?: string | null): Promise<InboxPage> {
  const query = cursor ? `?limit=20&cursor=${encodeURIComponent(cursor)}` : "?limit=20";
  return apiFetch<InboxPage>(`/api/responses${query}`);
}

type Cached = { responses: InboxResponse[]; fetchedAt: string; userId: string };

/**
 * The last inbox this account saw, so it is readable with no signal.
 *
 * Only the first page is kept. Someone underground wants to know who said yes
 * and how to reach them, not to scroll history, and a cache that grows without
 * limit is a storage complaint waiting to happen.
 *
 * Scoped by user id so signing into a second account cannot show the first
 * one's answers for the moment before the network replies.
 */
export async function readCache(userId: string): Promise<Cached | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Cached;
    if (parsed.userId !== userId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function writeCache(userId: string, responses: InboxResponse[]): Promise<void> {
  try {
    const payload: Cached = { userId, responses, fetchedAt: new Date().toISOString() };
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // A cache that fails to write costs an offline view, not a working app.
  }
}

export async function clearCache(): Promise<void> {
  await AsyncStorage.removeItem(CACHE_KEY).catch(() => {});
}
