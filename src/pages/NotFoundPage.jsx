import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet><title>404 — Velune</title></Helmet>
      <div className="flex flex-col items-center justify-center text-center min-h-screen" style={{ paddingTop: 68 }}>
        <span className="label-caps v-accent mb-4">404</span>
        <h1 className="font-editorial text-[48px] font-bold v-text mb-4">Page Not Found</h1>
        <p className="font-sans text-[15px] v-muted mb-8">
          The page you're looking for doesn't exist.
        </p>
        <button onClick={() => navigate('/')} className="btn-primary">Back to Home</button>
      </div>
    </>
  );
}
