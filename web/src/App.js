import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

// ============================================
// COMPONENTS
// ============================================

const Logo = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  return (
    <div className={`${sizes[size]} relative`}>
      {/* Vinyl record visual */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yday-blue via-yday-purple to-yday-navy shadow-lg">
        <div className="absolute inset-[30%] rounded-full bg-yday-dark/60" />
        <div className="absolute inset-[45%] rounded-full bg-yday-accent/30" />
      </div>
    </div>
  );
};

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-yday-dark/80 backdrop-blur-md border-b border-yday-blue/20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <Logo size="sm" />
            <span className="font-serif text-xl text-yday-light tracking-wider group-hover:text-white transition-colors">
              yday
            </span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link 
              to="/" 
              className={`font-serif text-sm transition-colors ${
                isActive('/') ? 'text-white' : 'text-yday-text hover:text-yday-light'
              }`}
            >
              home
            </Link>
            <Link 
              to="/changelog" 
              className={`font-serif text-sm transition-colors ${
                isActive('/changelog') ? 'text-white' : 'text-yday-text hover:text-yday-light'
              }`}
            >
              changelog
            </Link>
            <a 
              href="https://testflight.apple.com/join/YOUR_TESTFLIGHT_ID" 
              target="_blank" 
              rel="noopener noreferrer"
              className="yday-button text-sm py-2 font-serif"
            >
              get the app
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="border-t border-yday-blue/20 py-8 mt-16">
    <div className="max-w-6xl mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <span className="font-serif text-yday-text">yday</span>
        </div>
        <p className="text-yday-text/60 text-sm font-serif">
          discover, collect, and build community
        </p>
        <div className="flex gap-6 text-sm font-serif">
          <a href="mailto:hello@yday.ai" className="text-yday-text hover:text-yday-light transition-colors">
            contact
          </a>
          <Link to="/changelog" className="text-yday-text hover:text-yday-light transition-colors">
            changelog
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
    <div className="min-h-screen pt-24 pb-8">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <Logo size="xl" />
        <h1 className="font-serif text-5xl md:text-6xl mt-8 mb-4 text-yday-light tracking-wide">
          yday
        </h1>
        <p className="text-yday-text text-xl md:text-2xl font-serif font-light mb-8 max-w-2xl mx-auto">
          discover, collect, and build community around vinyl records
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="https://testflight.apple.com/join/YOUR_TESTFLIGHT_ID" 
            target="_blank" 
            rel="noopener noreferrer"
            className="yday-button font-serif"
          >
            download on testflight
          </a>
        </div>
      </section>

      {/* Email CTA - The Hook */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="yday-card p-10 text-center">
          <div className="text-5xl mb-6">📧</div>
          <h2 className="font-serif text-2xl md:text-3xl text-yday-light mb-4">
            try it without downloading
          </h2>
          <p className="text-yday-text font-serif text-lg mb-6 max-w-xl mx-auto">
            email a photo of any vinyl record and we'll identify it for you using AI
          </p>
          <a 
            href="mailto:scan@yday.ai?subject=Scan my record&body=Attach a photo of your vinyl record and we'll identify it!"
            className="yday-button font-serif inline-flex items-center gap-2 text-lg"
          >
            <span>📀</span>
            email scan@yday.ai
          </a>
          <p className="text-yday-text/60 font-serif text-sm mt-4">
            we'll reply with the album details within minutes
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="yday-card p-8 text-center">
            <div className="text-4xl mb-4">📷</div>
            <h3 className="font-serif text-xl mb-3 text-yday-light">scan & identify</h3>
            <p className="text-yday-text font-serif text-sm">
              point your camera at any vinyl record. our AI identifies it instantly from album art or text.
            </p>
          </div>
          
          <div className="yday-card p-8 text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="font-serif text-xl mb-3 text-yday-light">build your collection</h3>
            <p className="text-yday-text font-serif text-sm">
              organize your records with conditions, notes, and AI-generated descriptions.
            </p>
          </div>
          
          <div className="yday-card p-8 text-center">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="font-serif text-xl mb-3 text-yday-light">connect & trade</h3>
            <p className="text-yday-text font-serif text-sm">
              find collectors nearby. buy, sell, and chat about records you love.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="font-serif text-3xl text-center text-yday-light mb-12">how it works</h2>
        <div className="space-y-8">
          <div className="flex items-start gap-6">
            <div className="w-12 h-12 rounded-full bg-yday-accent/20 flex items-center justify-center text-yday-accent font-serif text-xl flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-serif text-xl text-yday-light mb-2">snap a photo</h3>
              <p className="text-yday-text font-serif">
                take a picture of the album cover, spine, or label. our AI works with any angle.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-6">
            <div className="w-12 h-12 rounded-full bg-yday-accent/20 flex items-center justify-center text-yday-accent font-serif text-xl flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-serif text-xl text-yday-light mb-2">instant match</h3>
              <p className="text-yday-text font-serif">
                we identify the release, artist, year, and even pressing details from discogs.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-6">
            <div className="w-12 h-12 rounded-full bg-yday-accent/20 flex items-center justify-center text-yday-accent font-serif text-xl flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-serif text-xl text-yday-light mb-2">grow your collection</h3>
              <p className="text-yday-text font-serif">
                add to your collection, set conditions, mark for sale, and connect with other collectors.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const Changelog = () => {
  // Static changelog - update this manually when you release
  const changelog = [
    {
      version: 'Unreleased',
      date: null,
      changes: [
        { type: 'added', text: 'new balanced logo design with vinyl record visual' },
        { type: 'added', text: 'email-based record scanning (scan@yday.ai)' },
        { type: 'added', text: 'changelog page on website' },
        { type: 'changed', text: 'login buttons no longer show loading spinners' },
        { type: 'fixed', text: 'chat showing wrong recipient name' },
        { type: 'fixed', text: '"in collection" badge logic corrected' },
      ],
    },
    {
      version: '0.1.0',
      date: '2026-02-08',
      changes: [
        { type: 'added', text: 'initial testflight beta release' },
        { type: 'added', text: 'google sign-in authentication' },
        { type: 'added', text: 'demo account login for testers' },
        { type: 'added', text: 'vinyl record scanning with gemini AI' },
        { type: 'added', text: 'collection management' },
        { type: 'added', text: 'for sale marketplace browse' },
        { type: 'added', text: 'chat messaging between buyers and sellers' },
        { type: 'added', text: 'user profiles with location sharing' },
      ],
    },
  ];

  const typeColors = {
    added: 'bg-green-500/20 text-green-400',
    changed: 'bg-blue-500/20 text-blue-400',
    fixed: 'bg-orange-500/20 text-orange-400',
    removed: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="min-h-screen pt-24 pb-8">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-serif text-4xl text-center mb-4 text-yday-light">changelog</h1>
        <p className="text-yday-text text-center mb-12 font-serif">
          all notable changes to yday
        </p>

        <div className="space-y-12">
          {changelog.map((release, index) => (
            <div key={index} className="yday-card p-8">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="font-serif text-2xl text-yday-light">{release.version}</h2>
                {release.date && (
                  <span className="text-yday-text text-sm font-serif">{release.date}</span>
                )}
              </div>
              
              <ul className="space-y-3">
                {release.changes.map((change, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className={`text-xs font-serif font-medium px-2 py-1 rounded ${typeColors[change.type]}`}>
                      {change.type}
                    </span>
                    <span className="text-yday-light font-serif text-sm">{change.text}</span>
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
      <div className="min-h-screen flex flex-col">
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
