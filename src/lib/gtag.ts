declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function reportConversion(sendTo: string) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "conversion", { send_to: sendTo });
}
