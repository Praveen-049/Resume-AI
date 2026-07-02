import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Landing = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  React.useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #2563eb, #1e40af)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1rem',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '42rem', marginLeft: 'auto', marginRight: 'auto' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Resume AI Ranker</h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9 }}>
          Upload your job description and resume candidates to get instant AI-powered rankings.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              backgroundColor: 'white',
              color: '#2563eb',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/register')}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              border: '2px solid white',
              cursor: 'pointer',
            }}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};
