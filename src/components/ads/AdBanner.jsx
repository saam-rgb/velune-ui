import { useEffect, useRef } from 'react';

export default function AdBanner({ slot = 'default', format = 'auto', className = '' }) {
  const adRef = useRef(null);
  const pushed = useRef(false);
  const client = import.meta.env.VITE_ADSENSE_CLIENT;

  // Don't render anything if AdSense isn't configured
  if (!client || client === 'ca-pub-XXXXXXXXXX') return null;

  useEffect(() => {
    if (!window.adsbygoogle || pushed.current) return;
    try {
      window.adsbygoogle.push({});
      pushed.current = true;
    } catch {}
  }, []);

  return (
    <div className={`text-center ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={import.meta.env.VITE_ADSENSE_DEFAULT_SLOT}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
