import React, { useState } from 'react';

const newsData = [
  {
    id: 1,
    title: "UA Retains ISO 9001:2015 Certification for Academic Excellence",
    date: "June 15, 2026",
    summary: "The University of Antique successfully passed the surveillance audit, maintaining its international standard for quality management systems."
  },
  {
    id: 2,
    title: "Engineering Board Exam Passers Set New Regional Record",
    date: "June 10, 2026",
    summary: "UA College of Engineering celebrates an outstanding 95% passing rate in the recent licensure examinations."
  },
  {
    id: 3,
    title: "New Research Grant Awarded for Sustainable Agriculture",
    date: "June 05, 2026",
    summary: "The Department of Science and Technology awards UA a multi-million grant to further studies on resilient crop varieties."
  }
];

export const Home = ({ navigateTo, currentUser }) => {
  const student = currentUser?.student || {};

  return (
    <div className="home-container" style={{ paddingBottom: '0' }}>
      
      {/* Hero Banner - UST Style */}
      <section className="home-hero-banner" style={{ 
        position: 'relative', 
        minHeight: '600px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(rgba(14, 27, 132, 0.7), rgba(0, 0, 0, 0.6)), url("/ua-gate.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div style={{ maxWidth: '800px', zIndex: 2 }}>
          <h1 className="animate-slide-up" style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px', textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
            Empowering the Future
          </h1>
          <p className="animate-slide-up-delay-1" style={{ fontSize: '1.25rem', marginBottom: '2.5rem', fontWeight: 500, textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
            Discover endless possibilities at the University of Antique. Transforming lives and building sustainable communities.
          </p>
          <div className="animate-slide-up-delay-2" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1rem', fontWeight: 600 }} onClick={() => navigateTo('programs-offered')}>
              Explore Programs
            </button>
            <button className="btn" style={{ padding: '0.8rem 2rem', fontSize: '1rem', fontWeight: 600, background: 'var(--logo-gold)', color: '#000', border: 'none' }} onClick={() => navigateTo(currentUser ? 'directory' : 'auth')}>
              {currentUser ? 'Student Portal' : 'Apply Now'}
            </button>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            
            <div className="glass" style={{ padding: '2rem', textAlign: 'center', borderRadius: 'var(--border-radius-lg)', cursor: 'pointer', transition: 'transform 0.3s' }} onClick={() => navigateTo('programs-offered')}>
              <div style={{ background: 'var(--primary-glow)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--primary)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '32px', height: '32px' }}>
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Academics</h3>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>Explore our diverse range of undergraduate and graduate programs.</p>
            </div>

            <div className="glass" style={{ padding: '2rem', textAlign: 'center', borderRadius: 'var(--border-radius-lg)', cursor: 'pointer', transition: 'transform 0.3s' }} onClick={() => navigateTo(currentUser ? 'directory' : 'auth')}>
              <div style={{ background: 'var(--logo-gold-glow)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--logo-gold)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '32px', height: '32px' }}>
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Admissions</h3>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>Join our community. Find requirements and apply today.</p>
            </div>

            <div className="glass" style={{ padding: '2rem', textAlign: 'center', borderRadius: 'var(--border-radius-lg)', cursor: 'pointer', transition: 'transform 0.3s' }}>
              <div style={{ background: 'var(--danger-bg)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--danger)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '32px', height: '32px' }}>
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Campus Life</h3>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>Experience vibrant student organizations, arts, and athletics.</p>
            </div>

          </div>
        </div>
      </section>

      {/* News & Announcements */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', margin: 0, color: 'var(--primary)' }}>University News</h2>
              <p style={{ margin: '0.5rem 0 0' }}>Stay updated with the latest happenings at UA.</p>
            </div>
            <a href="#" style={{ fontWeight: 600, color: 'var(--primary)' }}>View All News →</a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {newsData.map((news) => (
              <div key={news.id} style={{ borderRadius: 'var(--border-radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', transition: 'transform 0.3s', cursor: 'pointer' }} className="news-card">
                <div style={{ height: '180px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ width: '64px', height: '64px', opacity: 0.5 }}>
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="9" y1="21" x2="9" y2="9" />
                  </svg>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--logo-gold)', fontWeight: 700, textTransform: 'uppercase' }}>{news.date}</span>
                  <h3 style={{ fontSize: '1.1rem', margin: '0.5rem 0 1rem', lineHeight: 1.4 }}>{news.title}</h3>
                  <p style={{ fontSize: '0.9rem', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{news.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About/Profile Section */}
      <section style={{ padding: '5rem 0', background: 'var(--primary)', color: '#fff' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#fff' }}>About the University</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '1.5rem', color: 'rgba(255,255,255,0.8)' }}>
              The University of Antique is a premier institution dedicated to transforming lives and building sustainable communities. Through excellence in instruction, research, and extension, we empower individuals to lead and innovate in their respective fields.
            </p>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <div>
                <strong style={{ fontSize: '2rem', display: 'block', color: 'var(--logo-gold)' }}>50+</strong>
                <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>Academic Programs</span>
              </div>
              <div>
                <strong style={{ fontSize: '2rem', display: 'block', color: 'var(--logo-gold)' }}>15k+</strong>
                <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>Students Enrolled</span>
              </div>
              <div>
                <strong style={{ fontSize: '2rem', display: 'block', color: 'var(--logo-gold)' }}>4</strong>
                <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>Campuses</span>
              </div>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ width: '100%', paddingBottom: '75%', borderRadius: 'var(--border-radius-lg)', background: 'url("/ua-gate.jpg") center/cover', border: '4px solid var(--logo-gold)' }}></div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
