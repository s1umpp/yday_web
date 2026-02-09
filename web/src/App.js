import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

// ============================================
// COMPONENTS
// ============================================

const Logo = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`${sizes[size]} relative`}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 shadow-2xl">
        <div className="absolute inset-[25%] rounded-full bg-yday-dark/70" />
        <div className="absolute inset-[40%] rounded-full bg-white/10" />
      </div>
    </div>
  );
};

const Navigation = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-yday-dark/95 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <Logo size="sm" />
            <span className="text-xl font-semibold text-white tracking-tight group-hover:text-blue-400 transition-colors">
              yday
            </span>
          </Link>
          
          <div className="flex items-center gap-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/changelog" 
              className={`text-sm font-medium transition-colors ${
                isActive('/changelog') 
                  ? 'text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Changelog
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="border-t border-white/5 bg-yday-dark/50">
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <span className="text-gray-400 font-medium">yday</span>
        </div>
        <p className="text-gray-500 text-sm">
          Discover, collect, and build community around vinyl records
        </p>
        <div className="flex gap-6 text-sm">
          <a 
            href="mailto:hello@yday.ai" 
            className="text-gray-400 hover:text-white transition-colors"
          >
            Contact
          </a>
          <Link 
            to="/changelog" 
            className="text-gray-400 hover:text-white transition-colors"
          >
            Changelog
          </Link>
        </div>
      </div>
    </div>
  </footer>
);

// ============================================
// PAGES
// ============================================

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-yday-dark via-indigo-950/50 to-yday-dark">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <Logo size="xl" />
            </div>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight">
              yday
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover, collect, and build community around vinyl records
            </p>
          </div>
        </div>
      </section>

      {/* Email CTA Section */}
      <section className="relative py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Try it without downloading
              </h2>
              <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
                Email a photo of any vinyl record and we'll identify it for you using AI. 
                We'll reply with the album details within minutes.
              </p>
              <a 
                href="mailto:scan@yday.ai?subject=Scan my record&body=Attach a photo of your vinyl record and we'll identify it!"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Email scan@yday.ai</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything you need
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Powerful tools for vinyl collectors
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 h-full">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-500/10 mb-6">
                  <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Scan & Identify</h3>
                <p className="text-gray-400 leading-relaxed">
                  Point your camera at any vinyl record. Our AI identifies it instantly from album art or text.
                </p>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 h-full">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-purple-500/10 mb-6">
                  <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Build Your Collection</h3>
                <p className="text-gray-400 leading-relaxed">
                  Organize your records with conditions, notes, and AI-generated descriptions.
                </p>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-red-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 h-full">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-pink-500/10 mb-6">
                  <svg className="w-7 h-7 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Connect & Trade</h3>
                <p className="text-gray-400 leading-relaxed">
                  Find collectors nearby. Buy, sell, and chat about records you love.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How it works
            </h2>
            <p className="text-xl text-gray-400">
              Simple, fast, and accurate
            </p>
          </div>
          
          <div className="space-y-8">
            {[
              {
                number: '01',
                title: 'Snap a photo',
                description: 'Take a picture of the album cover, spine, or label. Our AI works with any angle.'
              },
              {
                number: '02',
                title: 'Instant match',
                description: 'We identify the release, artist, year, and even pressing details from Discogs.'
              },
              {
                number: '03',
                title: 'Grow your collection',
                description: 'Add to your collection, set conditions, mark for sale, and connect with other collectors.'
              }
            ].map((step, index) => (
              <div key={index} className="flex items-start gap-8 group">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-2xl font-bold text-blue-400">{step.number}</span>
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-2xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-lg leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const Changelog = () => {
  const changelog = [
    {
      version: 'Unreleased',
      date: null,
      changes: [
        { type: 'added', text: 'New balanced logo design with vinyl record visual' },
        { type: 'added', text: 'Email-based record scanning (scan@yday.ai)' },
        { type: 'added', text: 'Changelog page on website' },
        { type: 'changed', text: 'Login buttons no longer show loading spinners' },
        { type: 'fixed', text: 'Chat showing wrong recipient name' },
        { type: 'fixed', text: '"In collection" badge logic corrected' },
      ],
    },
    {
      version: '0.1.0',
      date: '2026-02-08',
      changes: [
        { type: 'added', text: 'Initial TestFlight beta release' },
        { type: 'added', text: 'Google Sign-In authentication' },
        { type: 'added', text: 'Demo account login for testers' },
        { type: 'added', text: 'Vinyl record scanning with Gemini AI' },
        { type: 'added', text: 'Collection management' },
        { type: 'added', text: 'For Sale marketplace browse' },
        { type: 'added', text: 'Chat messaging between buyers and sellers' },
        { type: 'added', text: 'User profiles with location sharing' },
      ],
    },
  ];

  const typeColors = {
    added: 'bg-green-500/20 text-green-400 border-green-500/30',
    changed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    fixed: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    removed: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Changelog</h1>
          <p className="text-xl text-gray-400">
            All notable changes to yday
          </p>
        </div>

        <div className="space-y-8">
          {changelog.map((release, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                <h2 className="text-3xl font-bold text-white">{release.version}</h2>
                {release.date && (
                  <span className="text-gray-400 text-sm font-medium">{release.date}</span>
                )}
              </div>
              
              <ul className="space-y-4">
                {release.changes.map((change, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg border ${typeColors[change.type]}`}>
                      {change.type}
                    </span>
                    <span className="text-gray-300 flex-1">{change.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// APP
// ============================================

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-yday-dark">
        <Navigation />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/changelog" element={<Changelog />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
