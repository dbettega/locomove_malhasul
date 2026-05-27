export function registerSW() {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register(
        import.meta.env.BASE_URL + 'sw.js',
        { scope: import.meta.env.BASE_URL }
      );
      console.log('[SW] registrado:', reg.scope);
    } catch (err) {
      console.warn('[SW] falha no registro:', err);
    }
  });
}
