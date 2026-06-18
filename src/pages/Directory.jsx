import { useState, useEffect } from 'react';
import { StudentCard } from '../components/StudentCard';
import { getStudents, deleteStudentProfileAndAccount } from '../utils/storage';

export const Directory = ({ navigateTo, currentUser, params }) => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMajor, setSelectedMajor] = useState(params?.major || 'All');
  const [selectedCampus, setSelectedCampus] = useState(params?.campus || 'All');
  const [sortBy, setSortBy] = useState('name-asc');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Load students on mount
  useEffect(() => {
    if (!currentUser) return;
    const loadData = async () => {
      const list = await getStudents();
      setStudents(list);
    };
    loadData();
  }, [currentUser]);

  // Sync selectedMajor and selectedCampus if navigation params change
  useEffect(() => {
    if (params?.major) {
      setSelectedMajor(params.major);
    } else {
      setSelectedMajor('All');
    }
    if (params?.campus) {
      setSelectedCampus(params.campus);
    } else {
      setSelectedCampus('All');
    }
  }, [params]);

  const handleDelete = async (student) => {
    const confirmMessage = `WARNING: You are about to permanently delete ${student.name}'s portfolio and user account. This action cannot be undone. Do you wish to proceed?`;
    if (window.confirm(confirmMessage)) {
      if (window.confirm("FINAL CONFIRMATION: Are you absolutely certain you want to proceed?")) {
        await deleteStudentProfileAndAccount(student.id);
        alert(`${student.name}'s portfolio was successfully deleted.`);
        const list = await getStudents();
        setStudents(list);
      }
    }
  };

  // Calculate statistics dynamically
  const totalStudents = students.length;
  const totalProjects = students.reduce((acc, curr) => acc + (curr.projects?.length || 0), 0);
  const uniqueSkills = Array.from(
    new Set(students.flatMap(s => s.skills || []))
  ).length;

  // Extract unique majors for filter dropdown
  const uniqueMajors = Array.from(
    new Set(students.map(s => s.major).filter(Boolean))
  );

  // Extract unique campuses for filter dropdown
  const uniqueCampuses = Array.from(
    new Set(students.map(s => s.campus || 'Sibalom (Main Campus)').filter(Boolean))
  );

  // Filter and Search logic
  const filteredStudents = students.filter(student => {
    if (!student || student.id === '--stats--') return false;

    const name = student.name || '';
    const shortBio = student.shortBio || '';
    const skills = student.skills || [];

    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shortBio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skills.some(skill => skill && typeof skill === 'string' && skill.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMajor = selectedMajor === 'All' || student.major === selectedMajor;
    const matchesCampus = selectedCampus === 'All' ||
      student.campus === selectedCampus ||
      (!student.campus && selectedCampus === 'Sibalom (Main Campus)');
    const isVisible = student.isPublic !== false || !!currentUser?.isAdmin;

    return matchesSearch && matchesMajor && matchesCampus && isVisible;
  });

  // Sort logic
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortBy === 'name-asc') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'name-desc') {
      return b.name.localeCompare(a.name);
    } else if (sortBy === 'projects-count') {
      return (b.projects?.length || 0) - (a.projects?.length || 0);
    } else if (sortBy === 'skills-count') {
      return (b.skills?.length || 0) - (a.skills?.length || 0);
    }
    return 0;
  });

  return (
    <div className="app-page-wrapper">
      <div className="container directory-dashboard-container animate-fade-in" style={{ paddingBottom: '4rem' }}>
        
        {/* Left Column: Sidebar Filters Panel */}
        <aside className={`directory-sidebar glass ${filtersOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-header">
            <h3>Directory Filters</h3>
            <button className="sidebar-close-btn" onClick={() => setFiltersOpen(false)} aria-label="Close filters">
              &times;
            </button>
          </div>

          <div className="sidebar-content">
            {/* Stat Counters */}
            <div className="sidebar-section stats-section">
              <div className="sidebar-section-title">Directory Metrics</div>
              <div className="bento-mini-stats">
                <div className="mini-stat-item">
                  <div className="mini-stat-num">{totalStudents}</div>
                  <div className="mini-stat-label">Portfolios</div>
                </div>
                <div className="mini-stat-item">
                  <div className="mini-stat-num">{totalProjects}</div>
                  <div className="mini-stat-label">Projects</div>
                </div>
                <div className="mini-stat-item">
                  <div className="mini-stat-num">{uniqueSkills}</div>
                  <div className="mini-stat-label">Skills</div>
                </div>
              </div>
            </div>

            {/* Campus Select */}
            <div className="sidebar-section">
              <label htmlFor="sidebar-campus" className="sidebar-section-title">Campus</label>
              <select
                id="sidebar-campus"
                className="form-control sidebar-select"
                value={selectedCampus}
                onChange={(e) => setSelectedCampus(e.target.value)}
              >
                <option value="All">All Campuses</option>
                {uniqueCampuses.map((campus, index) => (
                  <option key={index} value={campus}>{campus}</option>
                ))}
              </select>
            </div>

            {/* Major Select */}
            <div className="sidebar-section">
              <label htmlFor="sidebar-major" className="sidebar-section-title">Major</label>
              <select
                id="sidebar-major"
                className="form-control sidebar-select"
                value={selectedMajor}
                onChange={(e) => setSelectedMajor(e.target.value)}
              >
                <option value="All">All Majors</option>
                {uniqueMajors.map((major, index) => (
                  <option key={index} value={major}>{major}</option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div className="sidebar-section">
              <label htmlFor="sidebar-sort" className="sidebar-section-title">Sort order</label>
              <select
                id="sidebar-sort"
                className="form-control sidebar-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name-asc">Alphabetical (A-Z)</option>
                <option value="name-desc">Alphabetical (Z-A)</option>
                <option value="projects-count">Most Projects</option>
                <option value="skills-count">Most Skills</option>
              </select>
            </div>

            {/* Reset Button */}
            {(selectedCampus !== 'All' || selectedMajor !== 'All' || searchQuery !== '') && (
              <button 
                className="btn btn-secondary btn-reset-filters" 
                onClick={() => {
                  setSelectedCampus('All');
                  setSelectedMajor('All');
                  setSearchQuery('');
                }}
                style={{ width: '100%', marginTop: '1rem' }}
              >
                Reset Filters
              </button>
            )}
          </div>
        </aside>

        {/* Right Column: Main Content Area */}
        <main className="directory-main-content">
          
          {/* Header row with Title and Mobile Filters toggle */}
          <div className="directory-header-row animate-slide-up">
            <div>
              <h1 className="directory-title">
                UA <span className="text-gradient-animated hero-gradient-loop">Portfolios Directory</span>
              </h1>
              <p className="directory-subtitle">
                Discover innovative capstones, digital assets, and student profiles from the University of Antique.
              </p>
            </div>
            <button 
              className="btn btn-secondary mobile-filters-toggle-btn"
              onClick={() => setFiltersOpen(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Filters
            </button>
          </div>

          {/* Search Bar Row */}
          <div className="directory-search-row animate-slide-up-delay-1">
            <div className="search-input-wrapper">
              <input
                type="search"
                className="form-control main-search-input"
                placeholder="Search portfolios by student name, bio keywords, or skill sets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </div>

          {/* Active Filters Badges */}
          {(selectedCampus !== 'All' || selectedMajor !== 'All' || searchQuery !== '') && (
            <div className="active-filters-row animate-fade-in">
              <span className="filter-label">Active Filters:</span>
              <div className="filter-badges-container">
                {selectedCampus !== 'All' && (
                  <span className="active-filter-badge">
                    {selectedCampus}
                    <button className="badge-clear" onClick={() => setSelectedCampus('All')}>&times;</button>
                  </span>
                )}
                {selectedMajor !== 'All' && (
                  <span className="active-filter-badge">
                    {selectedMajor.length > 20 ? `${selectedMajor.substring(0, 20)}...` : selectedMajor}
                    <button className="badge-clear" onClick={() => setSelectedMajor('All')}>&times;</button>
                  </span>
                )}
                {searchQuery !== '' && (
                  <span className="active-filter-badge">
                    "{searchQuery}"
                    <button className="badge-clear" onClick={() => setSearchQuery('')}>&times;</button>
                  </span>
                )}
                <button 
                  className="clear-all-link-btn"
                  onClick={() => {
                    setSelectedCampus('All');
                    setSelectedMajor('All');
                    setSearchQuery('');
                  }}
                >
                  Clear All
                </button>
              </div>
            </div>
          )}

          {/* Student Grid */}
          <div className="directory-results-container">
            {sortedStudents.length > 0 ? (
              <div className="student-grid animate-slide-up-delay-2">
                {sortedStudents.map(student => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    currentUser={currentUser}
                    onClick={() => navigateTo('profile-detail', { id: student.id })}
                    onDelete={() => handleDelete(student)}
                  />
                ))}
              </div>
            ) : (
              <div className="glass bento-empty-state animate-slide-up-delay-2">
                <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                </svg>
                <h3>No Portfolios Found</h3>
                <p>We couldn't find any portfolios matching your selected filters or search terms.</p>
                <button 
                  className="btn btn-primary btn-reset-empty"
                  onClick={() => {
                    setSelectedCampus('All');
                    setSelectedMajor('All');
                    setSearchQuery('');
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

        </main>

      </div>
    </div>
  );
};
export default Directory;
