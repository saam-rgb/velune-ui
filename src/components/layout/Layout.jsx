import { Outlet, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';
import AdBanner from '../ads/AdBanner';

export default function Layout() {
  const { pathname } = useLocation();
  const hideFooterAd = ['/login', '/dashboard'].some(p => pathname.startsWith(p));

  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
      {!hideFooterAd && <AdBanner slot="footer-banner" />}
      <Footer />
    </>
  );
}
