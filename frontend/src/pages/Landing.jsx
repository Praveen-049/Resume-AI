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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 text-white flex flex-col justify-center items-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h1 className="text-5xl font-bold mb-6">Resume AI Ranker</h1>
        <p className="text-xl mb-8 text-blue-100">
          Upload your job description and resume candidates to get instant AI-powered rankings.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => navigate('/login')}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/register')}
            className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition border-2 border-white"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};
