import { useEffect } from 'react';

// Dynamically injects AdSense script once
export default function AdSenseScript() {
  useEffect(() => {
    const client = import.meta.env.VITE_ADSENSE_CLIENT;
    if (!client || document.querySelector('[data-adsense-loaded]')) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-adsense-loaded', 'true');
    document.head.appendChild(script);
  }, []);

  return null;
}
