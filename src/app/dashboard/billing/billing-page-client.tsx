"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";

type Subscription = {
  status: string;
  provider: string;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
  /** Still paid up — either renewing, or cancelled with period left. */
  entitled: boolean;
} | null;

export function BillingPageClient({
  subscription,
  stripeReady,
  paypalReady,
  bypassBilling,
  isShowcase,
}: {
  subscription: Subscription;
  stripeReady: boolean;
  paypalReady: boolean;
  bypassBilling: boolean;
  isShowcase: boolean;
}) {
  const router = useRouter();
  const isCancelled = Boolean(subscription?.cancelAtPeriodEnd) || subscription?.status === "CANCELLED";
  // A cancelled subscription still serves the page until the paid period runs
  // out, so it belongs in the "you have a subscription" branch. Once that
  // period lapses `entitled` goes false and we offer subscribing again.
  const hasSubscription = Boolean(subscription?.entitled);

  const [checkoutLoading, setCheckoutLoading] = useState<"stripe" | "paypal" | null>(null);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const periodEnd = subscription?.currentPeriodEnd ? parseISO(subscription.currentPeriodEnd) : null;
  const periodEndLabel = periodEnd ? format(periodEnd, "MMMM d, yyyy") : null;

  async function startCheckout(provider: "stripe" | "paypal") {
    setCheckoutLoading(provider);
    fetch("/api/billing/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({ provider }),
    }).catch(() => {});
    const res = await fetch(`/api/billing/${provider}/checkout`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setCheckoutLoading(null);
    if (data.url) window.location.href = data.url;
    else alert(data.error ?? "Something went wrong");
  }

  async function openPortal() {
    setPortalLoading(true);
    setMessage(null);
    const res = await fetch("/api/billing/stripe/portal", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setPortalLoading(false);
    if (data.url) window.location.href = data.url;
    else setMessage(data.error ?? "Something went wrong");
  }

  async function cancelSubscription() {
    setCancelling(true);
    setMessage(null);
    const res = await fetch("/api/billing/cancel", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setCancelling(false);
    if (res.ok) {
      setConfirmingCancel(false);
      setMessage("Your subscription is cancelled. You won't be charged again.");
      router.refresh();
    } else {
      setMessage(data.error ?? "Something went wrong");
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/dashboard/settings" className="text-sm font-medium text-rose-500">
        ← Settings
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-rose-950">Billing</h1>

      <section className="mt-6 flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm shadow-rose-100">
        <p className="text-sm text-rose-700/70">
          Publishing is always free, and your page stays live for <strong>30 minutes</strong> after you
          first publish it. Subscribe for <strong>$2.99/month</strong> to keep it running after that.
        </p>

        {hasSubscription ? (
          <>
            {isCancelled ? (
              <div className="mt-2 flex flex-col gap-1">
                <p className="font-semibold text-rose-950">Your subscription is cancelled</p>
                <p className="text-sm text-rose-700/70">
                  {periodEndLabel
                    ? `You won't be charged again. Your page stays live until ${periodEndLabel}.`
                    : "You won't be charged again."}
                </p>
              </div>
            ) : (
              <div className="mt-2 flex flex-col gap-1">
                <p className="font-semibold text-rose-600">You are subscribed ❤️ via {subscription?.provider}</p>
                {periodEndLabel && (
                  <p className="text-sm text-rose-700/70">Renews on {periodEndLabel} for $2.99.</p>
                )}
              </div>
            )}

            <div className="mt-2 flex flex-wrap gap-2">
              {subscription?.provider === "STRIPE" && (
                <button
                  onClick={openPortal}
                  disabled={portalLoading}
                  className="w-fit rounded-full border border-rose-300 bg-white px-4 py-1.5 text-sm font-semibold text-rose-600 disabled:opacity-60"
                >
                  {portalLoading ? "Opening..." : "Payment method & invoices"}
                </button>
              )}
              {!isCancelled && !confirmingCancel && (
                <button
                  onClick={() => setConfirmingCancel(true)}
                  className="w-fit rounded-full border border-rose-200 bg-white px-4 py-1.5 text-sm font-medium text-rose-700/70"
                >
                  Cancel subscription
                </button>
              )}
            </div>

            {confirmingCancel && !isCancelled && (
              <div className="mt-2 flex flex-col gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4">
                <p className="text-sm font-semibold text-rose-900">Cancel your subscription?</p>
                <p className="text-sm text-rose-700/80">
                  {periodEndLabel
                    ? `You won't be charged again, and your page stays live until ${periodEndLabel}. After that it goes offline until you subscribe again.`
                    : "You won't be charged again. Your page stays live for the rest of the period you've already paid for, then goes offline until you subscribe again."}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={cancelSubscription}
                    disabled={cancelling}
                    className="w-fit rounded-full bg-rose-600 px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {cancelling ? "Cancelling..." : "Yes, cancel it"}
                  </button>
                  <button
                    onClick={() => setConfirmingCancel(false)}
                    disabled={cancelling}
                    className="w-fit rounded-full border border-rose-300 bg-white px-4 py-1.5 text-sm font-semibold text-rose-600 disabled:opacity-60"
                  >
                    Keep my subscription
                  </button>
                </div>
              </div>
            )}

            {message && <p className="text-sm text-rose-600">{message}</p>}
          </>
        ) : isShowcase ? (
          <p className="mt-2 text-sm text-rose-700/70">This is the showcase account — it stays live without subscribing.</p>
        ) : bypassBilling ? (
          <p className="mt-2 text-sm text-rose-700/70">
            Billing bypass is enabled for local development — your page stays live without subscribing.
          </p>
        ) : !stripeReady && !paypalReady ? (
          <p className="mt-2 text-sm text-rose-700/70">Payments are coming soon — check back shortly!</p>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            {stripeReady && (
              <button
                onClick={() => startCheckout("stripe")}
                disabled={checkoutLoading === "stripe"}
                className="w-fit rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {checkoutLoading === "stripe" ? "Redirecting..." : "Subscribe with Stripe"}
              </button>
            )}
            {paypalReady && (
              <button
                onClick={() => startCheckout("paypal")}
                disabled={checkoutLoading === "paypal"}
                className="w-fit rounded-full border border-rose-300 bg-white px-5 py-2 text-sm font-semibold text-rose-600 disabled:opacity-60"
              >
                {checkoutLoading === "paypal" ? "Redirecting..." : "Subscribe with PayPal"}
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
