import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ResumeUploadPage = () => {
  const { jdId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.json')) {
        setError('Only .json files are allowed');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('jd_id', jdId);

    try {
      const res = await fetch('http://localhost:8000/api/ranking/evaluate', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        navigate(`/results/${data.id}`);
      } else {
        setError(data.detail || 'Upload failed');
      }
    } catch (err) {
      setError('Upload failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Upload Resumes</h1>
        <p className="text-gray-600 mb-8">Upload a .json file containing candidate resumes</p>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">{error}</div>
          )}

          <form onSubmit={handleUpload} className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Expected JSON Format:</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
{`[
  {
    "name": "John Doe",
    "summary": "Software engineer with 5 years experience",
    "skills": ["Python", "React", "AWS"],
    "experience": "5 years"
  },
  {
    "name": "Jane Smith",
    "summary": "Full-stack developer",
    "skills": ["JavaScript", "Node.js", "PostgreSQL"],
    "experience": "3 years"
  }
]`}
              </pre>
            </div>

            <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
                id="resume-file-input"
              />
              <label htmlFor="resume-file-input" className="cursor-pointer">
                <div className="text-blue-600 font-semibold text-lg">
                  {file ? file.name : 'Click to select .json file'}
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !file}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : 'Evaluate & Rank Resumes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
