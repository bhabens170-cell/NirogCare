let googleMapsLoaderPromise: Promise<void> | null = null;

export function loadGoogleMaps(apiKey: string, libraries: string[] = []) {
  if (!apiKey) {
    return Promise.reject(new Error('Google Maps API key is missing'));
  }

  const w = window as any;
  if (w.google?.maps) {
    return Promise.resolve();
  }

  if (googleMapsLoaderPromise) {
    return googleMapsLoaderPromise;
  }

  googleMapsLoaderPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById('google-maps-js');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Google Maps')));
      return;
    }

    const callbackName = '__onGoogleMapsLoaded';
    (w as any)[callbackName] = () => {
      resolve();
      try {
        delete (w as any)[callbackName];
      } catch {
        (w as any)[callbackName] = undefined;
      }
    };

    const script = document.createElement('script');
    script.id = 'google-maps-js';
    script.async = true;
    script.defer = true;

    const libs = libraries.length > 0 ? `&libraries=${encodeURIComponent(libraries.join(','))}` : '';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}${libs}&callback=${callbackName}`;

    script.onerror = () => {
      reject(new Error('Failed to load Google Maps'));
    };

    document.head.appendChild(script);
  });

  return googleMapsLoaderPromise;
}
