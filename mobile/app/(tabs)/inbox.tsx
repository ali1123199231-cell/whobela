import { useCallback, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useAuth } from "@/lib/auth";
import { fetchInbox, readCache, writeCache, type InboxResponse } from "@/lib/inbox";
import { ResponseCard } from "@/components/response-card";
import { PushPrompt } from "@/components/push-prompt";
import { ReviewPrompt } from "@/components/review-prompt";
import { reviewPromptDue } from "@/lib/review";
import { ScreenMessage, Banner } from "@/components/ui";
import { formatCacheAge } from "@/lib/format";
import { SessionExpiredError } from "@/lib/api";
import { log } from "@/lib/log";
import { colors, radius, spacing, type } from "@/lib/theme";

export default function InboxScreen() {
  const { user, signOut } = useAuth();
  const unverified = !!user && !user.emailVerified;
  const [responses, setResponses] = useState<InboxResponse[] | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [cachedAt, setCachedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [askForReview, setAskForReview] = useState(false);

  // Keyed on the id rather than the user object: refreshing the session hands
  // back a new object with the same contents, and depending on it made this
  // callback change identity and refetch for no reason.
  const userId = user?.id;

  const load = useCallback(
    async () => {
      if (!userId) return;

      try {
        const page = await fetchInbox();
        log.info("inbox.loaded", { count: page.responses.length, hasMore: !!page.nextCursor });
        setResponses(page.responses);
        setCursor(page.nextCursor);
        setCachedAt(null);
        setError(null);
        await writeCache(userId, page.responses);

        // Only once a real answer exists, and only from a fresh fetch — the
        // cached path below can show the same yes on a fourth flight with no
        // signal, which is not a new good moment. Not awaited: deciding
        // whether to ask for a review must never be on the path between
        // someone and their answers.
        if (page.responses.length > 0) {
          void reviewPromptDue().then(setAskForReview);
        }
      } catch (failure) {
        if (failure instanceof SessionExpiredError) {
          await signOut();
          return;
        }
        // Fall back to whatever this account last saw. Being underground is
        // not a reason to be unable to find out who said yes.
        const cached = await readCache(userId);
        log.warn("inbox.offline", { usedCache: !!cached, cachedCount: cached?.responses.length ?? 0 });
        if (cached) {
          setResponses(cached.responses);
          setCachedAt(cached.fetchedAt);
          setError(null);
        } else {
          setError((failure as Error).message);
        }
      } finally {
        setRefreshing(false);
      }
    },
    [userId, signOut]
  );

  // Refetched every time the tab is focused, not just on mount. Tapping a
  // notification routes here, and an inbox still showing the state from before
  // that answer arrived contradicts the notification that brought you to it —
  // which reads as the app being broken rather than merely stale.
  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  // The spinner is started by the gesture rather than inside load, so mounting
  // the screen doesn't set state synchronously inside an effect.
  const refresh = useCallback(() => {
    setRefreshing(true);
    void load();
  }, [load]);

  const loadMore = useCallback(async () => {
    if (!cursor || loadingMore || cachedAt) return;
    setLoadingMore(true);
    try {
      const page = await fetchInbox(cursor);
      setResponses((current) => [...(current ?? []), ...page.responses]);
      setCursor(page.nextCursor);
    } catch {
      // Silent: the page they already have is intact, and an error toast for
      // scrolling past the end is noise.
    } finally {
      setLoadingMore(false);
    }
  }, [cursor, loadingMore, cachedAt]);

  if (responses === null && !error) {
    return <ScreenMessage loading />;
  }

  if (error && !responses) {
    return (
      <ScreenMessage
        title="Couldn't load your answers"
        body={error}
        action={{ label: "Try again", onPress: () => void load() }}
      />
    );
  }

  const list = responses ?? [];

  return (
    <FlatList
      data={list}
      keyExtractor={(item) => item.id}
      contentContainerStyle={list.length === 0 ? styles.emptyContainer : styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
          tintColor={colors.rose600}
          colors={[colors.rose600]}
        />
      }
      ListHeaderComponent={
        <View style={styles.header}>
          {!!cachedAt && <Banner tone="info" message={formatCacheAge(cachedAt)} />}
          {/* Verification is skippable, so it needs a way back. Without this the
              only route to the code entry would be the website. */}
          {unverified && (
            <Text style={styles.verify} onPress={() => router.push("/verify-email")}>
              Your email isn&apos;t verified yet — tap to enter your code.
            </Text>
          )}
          {/* At most one prompt. Two cards stacked at the top of the inbox is
              how both get dismissed, so the review ask — which is raised at
              most once ever — takes precedence over the push prompt, which
              will come round again on the next answer. */}
          {askForReview ? (
            <ReviewPrompt onDone={() => setAskForReview(false)} />
          ) : (
            /* Only once an answer has landed: the value of being told instantly
               is self-evident to someone who just found out by checking. */
            list.length > 0 && <PushPrompt />
          )}
        </View>
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No answers yet</Text>
          <Text style={styles.emptyBody}>
            Once your invitation is live and you&apos;ve shared the link, replies show up here.
          </Text>
        </View>
      }
      renderItem={({ item }) => <ResponseCard response={item} />}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      onEndReached={() => void loadMore()}
      onEndReachedThreshold={0.4}
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator style={styles.footer} color={colors.rose600} />
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.md, gap: spacing.sm },
  emptyContainer: { flexGrow: 1, padding: spacing.md },
  header: { gap: spacing.sm, marginBottom: spacing.sm },
  verify: {
    ...type.small,
    color: colors.rose700,
    backgroundColor: colors.rose100,
    borderRadius: radius.lg,
    padding: spacing.sm,
    overflow: "hidden",
  },
  separator: { height: spacing.sm },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.sm, padding: spacing.lg },
  emptyTitle: type.heading,
  emptyBody: { ...type.body, color: colors.muted, textAlign: "center" },
  footer: { paddingVertical: spacing.md },
});
