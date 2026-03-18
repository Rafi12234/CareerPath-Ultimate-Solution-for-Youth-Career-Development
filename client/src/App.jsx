import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import Resources from './pages/Resources';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Chatbot from './pages/Chatbot';
import CVAnalyzer from './pages/CVAnalyzer';
import VoiceMockInterview from './pages/VoiceMockInterview';
import CoursePlayer from './pages/CoursePlayer';

function App() {
  const location = useLocation();

  useEffect(() => {
    // Ensure each route opens from top; avoids blank view with reveal-on-scroll sections.
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-[#03070A] text-gray-200">
        <Navbar />
        <main key={location.pathname} className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/course-player/:courseId" element={<CoursePlayer />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/cv-analyzer" element={<CVAnalyzer />} />
            <Route path="/voice-mock-interview" element={<VoiceMockInterview />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
