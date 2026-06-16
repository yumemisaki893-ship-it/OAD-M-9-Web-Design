import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Directory from './pages/Directory';
import ProfileDetail from './pages/ProfileDetail';
import Auth from './pages/Auth';
import ProfileEditor from './pages/ProfileEditor';
import Home from './pages/Home';
import { getCurrentSession, getSessionData, getStudentById } from './utils/storage';
import { auth, isConfigured } from './utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  // Theme State
  const [theme, setTheme] = useState('dark');
  
  // Custom Navigation Router State
  // Format: { page: 'home' | 'directory' | 'profile-detail' | 'auth' | 'edit-profile', params: { id?: string } }
  const [route, setRoute] = useState({ page: 'home', params: {} });
  
  // Session Authentication State
  const [currentUser, setCurrentUser] = useState(null);


  // Sync session and theme on mount
  useEffect(() => {
    // 1. Session Setup
    let unsubscribe = () => {};
    
    if (isConfigured) {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const sessionData = await getSessionData(firebaseUser);
            if (sessionData) {
              const student = await getStudentById(sessionData.studentId);
              setCurrentUser({
                ...sessionData,
                student
              });
            } else {
              setCurrentUser(null);
            }
          } catch (e) {
            console.error("Error setting session: ", e);
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      });
    } else {
      setCurrentUser(getCurrentSession());
    }

    // 2. Theme Setup
    const savedTheme = localStorage.getItem('portfolio_theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    return () => unsubscribe();
  }, []);

  // Theme toggle action
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('portfolio_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // Centralized Navigation function
  const navigateTo = (page, params = {}) => {
    if (!document.startViewTransition) {
      setRoute({ page, params });
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    
    document.startViewTransition(() => {
      setRoute({ page, params });
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  };

  // Auth Callbacks
  const handleLoginSuccess = (userSession) => {
    if (isConfigured) {
      if (userSession) {
        setCurrentUser(userSession);
      }
    } else {
      setCurrentUser(getCurrentSession());
    }
  };

  const handleLogoutSuccess = () => {
    setCurrentUser(null);
  };

  // Sync avatar/name in navbar instantly when profile edits save
  const handleProfileUpdate = (updatedProfile) => {
    if (isConfigured) {
      if (currentUser && updatedProfile) {
        setCurrentUser({
          ...currentUser,
          student: updatedProfile
        });
      }
    } else {
      setCurrentUser(getCurrentSession());
    }
  };

  // Render active page component based on routing state
  const renderPage = () => {
    switch (route.page) {
      case 'home':
        return <Home navigateTo={navigateTo} currentUser={currentUser} />;
      case 'directory':
        return <Directory navigateTo={navigateTo} currentUser={currentUser} />;
      case 'profile-detail':
        return (
          <ProfileDetail 
            params={route.params} 
            currentUser={currentUser} 
            navigateTo={navigateTo} 
            onLogoutSuccess={handleLogoutSuccess}
          />
        );
      case 'auth':
        return (
          <Auth 
            navigateTo={navigateTo} 
            onLoginSuccess={handleLoginSuccess} 
          />
        );
      case 'edit-profile':
        return (
          <ProfileEditor 
            currentUser={currentUser} 
            params={route.params}
            navigateTo={navigateTo} 
            onProfileUpdate={handleProfileUpdate} 
          />
        );
      default:
        return <Home navigateTo={navigateTo} currentUser={currentUser} />;
    }
  };

  return (
    <>
      {/* Sticky Navigation Bar */}
      <Navigation
        currentUser={currentUser}
        currentTheme={theme}
        onThemeToggle={toggleTheme}
        navigateTo={navigateTo}
        onLogoutSuccess={handleLogoutSuccess}
      />

      {/* Main Page Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div key={route.page} className="page-transition-wrapper">
          {renderPage()}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} PortfolioHub. Designed for student projects and connections.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
