import { useState } from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import { APP_VERSION, VERSION_CODE } from "@/lib/config";
import { openPlayListing, settleReviewPrompt, snoozeReviewPrompt } from "@/lib/review";
import { Button } from "./ui";
import { colors, radius, spacing, type } from "@/lib/theme";

/**
 * Asks how it is going, and routes the two answers differently.
 *
 * Yes leads to a second step rather than straight to the store: being sent to
 * Play the instant you say something nice reads as a trick, and the second
 * card is where the actual ask lives, phrased as a favour rather than a
 * demand. No leads to a mail composer — the point of asking first is that
 * someone having a bad time gets a way to say so to us, instead of saying it
 * in a one-star review.
 *
 * Shown at most once (see lib/review), and never on the visit where an answer
 * first arrives.
 */
type Step = "asking" | "confirming" | "done";

export function ReviewPrompt({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState<Step>("asking");

  const finish = (outcome: string) => {
    void settleReviewPrompt(outcome);
    setStep("done");
    onDone();
  };

  const complain = () => {
    // encodeURIComponent, not URLSearchParams: the latter encodes a space as
    // "+", which mail clients paste verbatim into the subject line.
    const subject = encodeURIComponent(`Whobela app feedback (${APP_VERSION} build ${VERSION_CODE})`);
    const body = encodeURIComponent("\n\n—\nWhat happened, and what you expected instead:\n");
    void Linking.openURL(`mailto:support@whobela.com?subject=${subject}&body=${body}`);
    finish("negative");
  };

  if (step === "done") return null;

  if (step === "confirming") {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Would you leave a review?</Text>
        <Text style={styles.body}>
          It is the main way people find Whobela — and it takes about twenty seconds.
        </Text>
        <View style={styles.actions}>
          <View style={styles.action}>
            <Button
              label="Not now"
              variant="secondary"
              onPress={() => {
                void snoozeReviewPrompt();
                setStep("done");
                onDone();
              }}
            />
          </View>
          <View style={styles.action}>
            <Button
              label="Leave a review"
              onPress={() => {
                void openPlayListing();
                finish("sent_to_play");
              }}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Enjoying Whobela?</Text>
      <Text style={styles.body}>
        You have had an answer come in — we would love to know how it went.
      </Text>
      <View style={styles.actions}>
        <View style={styles.action}>
          <Button label="Not really" variant="secondary" onPress={complain} />
        </View>
        <View style={styles.action}>
          <Button label="Yes" onPress={() => setStep("confirming")} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.rose100,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  title: { ...type.heading, fontSize: 16 },
  body: { ...type.small, color: colors.rose700 },
  actions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.xs },
  action: { flex: 1 },
});
