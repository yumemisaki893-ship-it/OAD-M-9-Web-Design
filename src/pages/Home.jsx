import React, { useState } from 'react';

const Home = ({ navigateTo, currentUser }) => {

  const handlePrimaryAction = () => {
    if (currentUser?.isAdmin) {
      navigateTo('office-admin');
    } else if (currentUser) {
      navigateTo('registrar-portal');
    } else {
      navigateTo('auth');
    }
  };

  const handleSecondaryAction = () => {
    navigateTo('directory');
  };

  return (
    <div className="home-container" style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff' }}>
      {/* Cinematic Hero Section */}
      <section 
        className="hero-section" 
        style={{ 
          position: 'relative',
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundImage: 'linear-gradient(to bottom, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0.95) 100%), url("/ua-gate.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          color: '#fff',
          textAlign: 'center',
          padding: '6rem 1.5rem',
          overflow: 'hidden'
        }}
      >
        {/* Subtle animated background glow */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80vw', height: '80vw', background: 'radial-gradient(circle, rgba(255,77,100,0.05) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none', filter: 'blur(60px)' }}></div>

        <div className="container hero-content" style={{ maxWidth: '900px', position: 'relative', zIndex: 10 }}>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <span style={{ 
              display: 'inline-block', 
              padding: '0.4rem 1.2rem', 
              background: 'rgba(20,20,20,0.8)', 
              border: '1px solid rgba(255, 200, 0, 0.4)', 
              borderRadius: '30px', 
              fontSize: '0.85rem', 
              fontWeight: 600, 
              color: '#ffc800',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}>
              Now available for all University of Antique students
            </span>
          </div>

          <h1 className="hero-title" style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
            Access your official <br />
            <span style={{ 
              background: 'linear-gradient(90deg, #ffc800, #ff4d64)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>academic records.</span>
          </h1>
          
          <p className="hero-subtitle" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', color: '#888', maxWidth: '700px', margin: '0 auto 3rem', lineHeight: 1.6, fontWeight: 400 }}>
            A curated platform for students to present their projects, highlight specialized skills, and establish an early career presence.
          </p>

          <div className="hero-buttons" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-primary" 
              onClick={handlePrimaryAction}
              style={{ 
                background: '#ff4d64', 
                color: '#fff', 
                border: 'none', 
                padding: '0.9rem 2.2rem', 
                fontSize: '1.05rem', 
                fontWeight: 600, 
                borderRadius: '6px',
                boxShadow: '0 8px 25px rgba(255, 77, 100, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              Registrar Portal
            </button>
            <button 
              className="btn" 
              onClick={handleSecondaryAction}
              style={{ 
                background: 'rgba(20,20,20,0.8)', 
                color: '#fff', 
                border: '1px solid rgba(255,255,255,0.1)', 
                padding: '0.9rem 2.2rem', 
                fontSize: '1.05rem', 
                fontWeight: 600, 
                borderRadius: '6px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
            >
              Student Roster
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
