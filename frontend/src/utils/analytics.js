export function track(event, props = {}) {
  if (import.meta.env.DEV) {
    console.log('[Analytics]', event, props);
  }
}