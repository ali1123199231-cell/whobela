"use client";

import { useState } from "react";
import Link from "next/link";

type Subscription = { status: string; provider: string } | null;

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
  const isActive = subscription?.status === "ACTIVE";
  const [checkoutLoading, setCheckoutLoading] = useState<"stripe" | "paypal" | null>(null);

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
        {isActive ? (
          <p className="mt-2 font-semibold text-rose-600">You are subscribed ❤️ via {subscription?.provider}</p>
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
