import React from 'react';
import {  BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import {AuthProvider, useAuth} from './service/AuthContext'
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/ui/ThemeProvider"

import Home from './pages/Open/Home/Home'
import LoginPage from './pages/Open/auth/LoginPage'
import RegisterPage from './pages/Open/auth/RegisterPage'
import Dashboard from './pages/Protected/Dashboard/Dashboard'
import ProfilePage from './pages/Protected/ProfilePage/ProfilePage';
import PreferencesPanel from './pages/Protected/PreferencesPanel/PreferencesPanel';
import LearningPathGenerator from './pages/Protected/LearningPathGenerator/LearningPathGenerator';
import ProjectRecommendations from "./pages/Protected/ProjectRecommand/ProjectRecommendations";
import FrameworkExplorer from "./pages/Protected/FrameworkExplorer/FrameworkExplorer";
import ProjectGuide from "./pages/Protected/ProjectGuide/ProjectGuide";


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider defaultTheme="system">
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/Dashboard"   element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute> }  />
          <Route path="/Profile" element={ <ProtectedRoute> <ProfilePage /> </ProtectedRoute> } />
         <Route path="/Preferences" element={ <ProtectedRoute> <PreferencesPanel /> </ProtectedRoute> } />
          <Route path="/AIlearningr" element={ <ProtectedRoute> <LearningPathGenerator /> </ProtectedRoute> } />
          <Route path="/learning-path/:pathId/step/:stepId" element={<ProtectedRoute><LearningPathGenerator /></ProtectedRoute>} />
          <Route path="/learning-path/:pathId/step/:stepId/:section" element={<ProtectedRoute><LearningPathGenerator /></ProtectedRoute>} />
          <Route path="/project-recommendations" element={<ProtectedRoute><ProjectRecommendations /></ProtectedRoute>} />
          <Route path="/explore" element={<ProtectedRoute><FrameworkExplorer /></ProtectedRoute>} />
          <Route path="/projectguide" element={<ProtectedRoute><ProjectGuide /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><ProjectGuide /></ProtectedRoute>} />
          <Route path="/projects/:projectId" element={<ProtectedRoute><ProjectGuide /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;







