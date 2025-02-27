import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function VerifyEmailPage() {
  const { verificationCode } = useParams();
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`http://localhost:8000/user-management/api/verify-email/${verificationCode}/`);
        const data = await response.json();

        if (response.ok) {
          setMessage(data.message);
          setTimeout(()=>{
            navigate('/')
          }, 2000)
        } else {
          setError(data.error || 'Verification failed.');
        }
      } catch (err) {
        setError('An error occurred. Please try again.');
      }
    };

    verifyEmail();
  }, [verificationCode]);

  return (
    <div className="verification-page">
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
