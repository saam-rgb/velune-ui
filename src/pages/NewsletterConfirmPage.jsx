import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../services/api';
import Spinner from '../components/ui/Spinner';

export default function NewsletterConfirmPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = params.get('token');
    if (!token) { setStatus('error'); setMessage('Invalid confirmation link.'); return; }

    api.get(`/newsletter/confirm?token=${token}`)
      .then(r => { setStatus('success'); setMessage(r.data.message); })
      .catch(err => { setStatus('error'); setMessage(err.response?.data?.error || 'Confirmation failed.'); });
  }, []);

  return (
    <>
      <Helmet><title>Newsletter Confirmation — Velune</title></Helmet>
      <div className="min-h-screen flex items-center justify-center" style={{ paddingTop: 68 }}>
        <div className="text-center container-velune" style={{ maxWidth: 480 }}>
          {status === 'loading' && <Spinner size={32} className="mx-auto" />}
          {status === 'success' && (
            <>
              <p className="font-editorial text-[32px] v-accent italic mb-6">{message}</p>
              <button onClick={() => navigate('/')} className="btn-primary">Back to Velune</button>
            </>
          )}
          {status === 'error' && (
            <>
              <p className="font-editorial text-[24px] v-text mb-6">{message}</p>
              <button onClick={() => navigate('/')} className="btn-secondary">Back to Home</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
