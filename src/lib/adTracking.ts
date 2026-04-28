const WEBHOOK_URL =
  "https://ericdacodes.app.n8n.cloud/webhook/78742ead-9c42-4af7-befe-5604957b2f92/ads";

export type AdEventType = "impression" | "click";

interface AdEventPayload {
  ad_id: string | number;
  event_type: AdEventType;
  article_slug: string;
  article_category: string;
}

const buildBody = (p: AdEventPayload) =>
  JSON.stringify({
    type: "ads",
    option: "event",
    ad_id: p.ad_id,
    event_type: p.event_type,
    article_slug: p.article_slug,
    article_category: p.article_category,
    user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
  });

export const trackAdImpression = (p: AdEventPayload) => {
  try {
    fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: buildBody(p),
      keepalive: true,
    }).catch((e) => console.warn("[ads] impression failed", e));
  } catch (e) {
    console.warn("[ads] impression error", e);
  }
};

export const trackAdClick = (p: AdEventPayload) => {
  try {
    const body = buildBody(p);
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon(WEBHOOK_URL, blob);
      return;
    }
    fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch((e) => console.warn("[ads] click failed", e));
  } catch (e) {
    console.warn("[ads] click error", e);
  }
};
