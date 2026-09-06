/*
  Registers the service worker so the app becomes installable and can
  serve its shell offline. Only runs in production builds — during
  `npm run dev`, Vite's own fast-refresh and unbundled modules make an
  actively-caching service worker more confusing than helpful, so it's
  skipped there.
*/
export function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  if (!import.meta.env.PROD) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.warn("Service worker registration failed:", error);
    });
  });
}
