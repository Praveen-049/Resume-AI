import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRankings();
  }, []);

  const fetchRankings = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/ranking/history', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setRankings(data);
      }
    } catch (err) {
      console.error('Failed to fetch rankings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Resume AI Ranker</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <button
            onClick={() => navigate('/upload-jd')}
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer"
          >
            <div className="text-4xl mb-3">📄</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Upload Job Description</h3>
            <p className="text-gray-600">Add a .docx file with the job details</p>
          </button>

          <button
            onClick={() => rankings.length > 0 && navigate(`/upload-resumes/${rankings[0].job_description_id}`)}
            disabled={rankings.length === 0}
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer disabled:opacity-50"
          >
            <div className="text-4xl mb-3">👥</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Upload Resumes</h3>
            <p className="text-gray-600">Add a .json file with candidates</p>
          </button>

          <button
            onClick={() => rankings.length > 0 && navigate(`/results/${rankings[0].id}`)}
            disabled={rankings.length === 0}
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer disabled:opacity-50"
          >
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">View Results</h3>
            <p className="text-gray-600">Check ranking results</p>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Rankings</h2>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : rankings.length > 0 ? (
            <div className="space-y-3">
              {rankings.map((ranking) => (
                <div
                  key={ranking.id}
                  onClick={() => navigate(`/results/${ranking.id}`)}
                  className="p-4 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">Ranking #{ranking.id}</p>
                      <p className="text-sm text-gray-600">{new Date(ranking.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className="text-blue-600 font-semibold">View →</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No rankings yet. Start by uploading a job description!</p>
          )}
        </div>
      </div>
    </div>
  );
};
