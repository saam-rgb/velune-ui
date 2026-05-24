// Google Analytics 4 + internal pageview tracking

const GA_ID = import.meta.env.VITE_GA_ID;

// Inject GA4 script once
export function initGA() {
  if (!GA_ID || document.getElementById('ga4-script')) return;

  const script = document.createElement('script');
  script.id = 'ga4-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { send_page_view: false });
}

export function trackPageView(path) {
  if (GA_ID && window.gtag) {
    window.gtag('config', GA_ID, { page_path: path });
  }

  // Also track internally (fire-and-forget)
  if (typeof fetch !== 'undefined') {
    fetch('/api/analytics/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
    }).catch(() => {});
  }
}

export function trackEvent(action, category, label) {
  if (GA_ID && window.gtag) {
    window.gtag('event', action, { event_category: category, event_label: label });
  }
}
