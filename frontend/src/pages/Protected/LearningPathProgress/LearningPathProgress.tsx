

import React, { useState, useEffect } from 'react';

interface Step {
  id: string;
  title: string;
  completed: boolean;
}

interface LearningPathProgress {
  pathName: string;
  steps: Step[];
  progressPercentage: number;
}

export const LearningPathProgress: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<LearningPathProgress | null>(null);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      // This would be the API endpoint that uses your stepprogress backend function
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/progress`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch progress');
      }
      
      const data = await response.json();
      setProgress(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateStepProgress = async (stepId: string, completed: boolean) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/learn/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ stepId, completed }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update progress');
      }
      
      const data = await response.json();
      
      // Update the local state with the new progress data
      if (progress) {
        setProgress({
          ...progress,
          progressPercentage: data.progressPercentage,
          steps: progress.steps.map(step => 
            step.id === stepId ? { ...step, completed } : step
          )
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !progress) {
    return <div className="flex justify-center items-center h-64">Loading progress...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-100 text-red-700 rounded">Error: {error}</div>;
  }

  if (!progress) {
    return <div className="p-4 bg-yellow-100 text-yellow-700 rounded">No progress data available.</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{progress.pathName}</h2>
      
      {/* Overall Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span className="font-medium">Overall Progress</span>
          <span className="font-medium">{Math.round(progress.progressPercentage)}%</span>
        </div>
        <div className="w-full h-4 bg-gray-200 rounded-full">
          <div 
            className="h-4 bg-blue-600 rounded-full transition-all duration-300 ease-in-out" 
            style={{ width: `${progress.progressPercentage}%` }}
          />
        </div>
      </div>
      
      {/* Steps List */}
      <div className="space-y-4">
        {progress.steps.map((step, index) => (
          <div key={step.id} className="border rounded p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-4 flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-gray-100">
                  {index + 1}
                </div>
                <h3 className="font-medium">{step.title}</h3>
              </div>
              <div>
                <input
                  type="checkbox"
                  checked={step.completed}
                  onChange={(e) => updateStepProgress(step.id, e.target.checked)}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningPathProgress;