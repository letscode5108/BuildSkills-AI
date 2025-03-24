import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../service/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Lightbulb, Compass, Code, FileText, ChevronRight, UserCircle } from 'lucide-react';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  skillLevel?: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
 // const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/user/profile`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
 
       // setError(err instanceof Error ? err.message : 'Something went wrong');
       toast.error(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    }
  };


  if (!user) return null;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-indigo-50 to-purple-50">
      {/* Header */}

      
      <header className="w-full bg-white shadow-lg py-4 px-6 border-b border-gray-200">
        <div className="flex justify-between items-center max-w-full mx-auto">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-indigo-900 mr-2">BuildSkills AI</h1>
   
          </div>
          <div className="mr-4 hidden md:flex items-center">
              <span className="text-sm text-slate-600 mr-2">Welcome, {profile?.name || user.name}!</span>
            </div>
          <div className="flex items-center">
            <UserCircle 
              className="h-8 w-8 text-indigo-600 mr-4 cursor-pointer hover:text-indigo-800 transition-colors" 
              onClick={() => navigate('/profile')}
            />
            <Button variant="outline" onClick={handleLogout} className="hover:bg-red-50 hover:text-red-600 border-red-200 transition-colors">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="p-6">
          <h2 className="text-3xl font-bold text-indigo-900 mb-8">Project Based Learning Platform</h2>
          
          {/* AI Learning Prerequisites */}
          <div className="mb-6 group cursor-pointer" onClick={() => navigate('/AIlearningr')}>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-8 shadow-lg transform transition-all duration-300 hover:scale-102 hover:shadow-xl group-hover:from-blue-700 group-hover:to-indigo-800">
              <div className="flex flex-col md:flex-row items-start md:items-center">
                <div className="bg-blue-500 bg-opacity-50 p-4 rounded-full mb-4 md:mb-0 md:mr-6">
                  <Lightbulb className="h-10 w-10 text-white" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-3xl font-bold mb-2">Know Your Prerequisites</h3>
                  <p className="text-xl text-blue-100 mb-4 max-w-3xl">
                    Get started with the fundamental concepts you need before diving into  projects.
                  </p>
                </div>
                <div className="flex items-center mt-4 md:mt-0">
                  <span className="text-xl font-bold mr-2">Start Learning</span>
                  <ChevronRight className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
          
          
          {/* Project Recommendations */}
          <div className="mb-6 group cursor-pointer" onClick={() => navigate('/project-recommendations')}>
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl p-8 shadow-lg transform transition-all duration-300 hover:scale-102 hover:shadow-xl group-hover:from-amber-600 group-hover:to-orange-700">
              <div className="flex flex-col md:flex-row items-start md:items-center">
                <div className="bg-amber-400 bg-opacity-50 p-4 rounded-full mb-4 md:mb-0 md:mr-6">
                  <Code className="h-10 w-10 text-white" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-3xl font-bold mb-2">Project Recommendations</h3>
                  <p className="text-xl text-amber-100 mb-4 max-w-3xl">
                    Get personalized project ideas based on your skill level and interests.
                  </p>
                </div>
                <div className="flex items-center mt-4 md:mt-0">
                  <span className="text-xl font-bold mr-2">View Projects</span>
                  <ChevronRight className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
         

             {/* Explore Frameworks */}
         <div className="mb-6 group cursor-pointer" onClick={() => navigate('/explore')}>
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl p-8 shadow-lg transform transition-all duration-300 hover:scale-102 hover:shadow-xl group-hover:from-emerald-600 group-hover:to-teal-700">
        <div className="flex flex-col md:flex-row items-start md:items-center">
          <div className="bg-emerald-400 bg-opacity-50 p-4 rounded-full mb-4 md:mb-0 md:mr-6">
            <Compass className="h-10 w-10 text-white" />
          </div>
          <div className="flex-grow">
            <h3 className="text-3xl font-bold mb-2">Sharpen Your concept</h3>
            <p className="text-xl text-emerald-100 mb-4 max-w-3xl">
              Clear your concepts before diving into making Project .
            </p>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <span className="text-xl font-bold mr-2">Explore Now</span>
            <ChevronRight className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>




          
          {/* Project Guide */}
          <div className="mb-6 group cursor-pointer" onClick={() => navigate('/projectguide')}>
            <div className="bg-gradient-to-r from-purple-600 to-fuchsia-700 text-white rounded-xl p-8 shadow-lg transform transition-all duration-300 hover:scale-102 hover:shadow-xl group-hover:from-purple-700 group-hover:to-fuchsia-800">
              <div className="flex flex-col md:flex-row items-start md:items-center">
                <div className="bg-purple-500 bg-opacity-50 p-4 rounded-full mb-4 md:mb-0 md:mr-6">
                  <FileText className="h-10 w-10 text-white" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-3xl font-bold mb-2">Project Guide</h3>
                  <p className="text-xl text-purple-100 mb-4 max-w-3xl">
                    Step-by-step tutorials and best practices for completing  projects.
                  </p>
                </div>
                <div className="flex items-center mt-4 md:mt-0">
                  <span className="text-xl font-bold mr-2">Open Guide</span>
                  <ChevronRight className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;































































