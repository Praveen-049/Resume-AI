import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ResultsPage = () => {
  const { rankingId } = useParams();
  const { token } = useAuth();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResults();
  }, [rankingId]);

  const fetchResults = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/ranking/results/${rankingId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setResults(data);
      } else {
        setError(data.detail || 'Failed to load results');
      }
    } catch (err) {
      setError('Error loading results: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-lg">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Ranking Results</h1>
        <p className="text-gray-600 mb-8">Candidates ranked by relevance</p>

        <div className="space-y-4">
          {results?.results?.map((candidate, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-blue-600">#{candidate.rank}</span>
                    <h2 className="text-2xl font-bold text-gray-800">{candidate.name}</h2>
                  </div>
                </div>
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold">
                  Score: {candidate.score}
                </div>
              </div>

              {candidate.summary && (
                <p className="text-gray-700 mb-3">{candidate.summary}</p>
              )}

              {candidate.skills && candidate.skills.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Skills:</h3>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(candidate.skills) ? candidate.skills : candidate.skills.split(',')).map((skill, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => window.history.back()}
          className="mt-8 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          ← Back
        </button>
      </div>
    </div>
  );
};
