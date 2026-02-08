import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

// API configuration - update this to your production backend
const API_URL = process.env.REACT_APP_API_URL || 'https://yday-ios-backend-cee9m.ondigitalocean.app';

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
              className={`font-sans text-sm transition-colors ${
                isActive('/') ? 'text-white' : 'text-yday-text hover:text-yday-light'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/scan" 
              className={`font-sans text-sm transition-colors ${
                isActive('/scan') ? 'text-white' : 'text-yday-text hover:text-yday-light'
              }`}
            >
              Scan Records
            </Link>
            <Link 
              to="/changelog" 
              className={`font-sans text-sm transition-colors ${
                isActive('/changelog') ? 'text-white' : 'text-yday-text hover:text-yday-light'
              }`}
            >
              Changelog
            </Link>
            <a 
              href="https://testflight.apple.com/join/YOUR_TESTFLIGHT_ID" 
              target="_blank" 
              rel="noopener noreferrer"
              className="yday-button text-sm py-2"
            >
              Get the App
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
        <p className="text-yday-text/60 text-sm font-sans">
          discover, collect, and build community
        </p>
        <div className="flex gap-6 text-sm font-sans">
          <a href="mailto:hello@yday.ai" className="text-yday-text hover:text-yday-light transition-colors">
            Contact
          </a>
          <Link to="/changelog" className="text-yday-text hover:text-yday-light transition-colors">
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
    <div className="min-h-screen pt-24 pb-8">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <Logo size="xl" />
        <h1 className="yday-heading text-5xl md:text-6xl mt-8 mb-4">
          yday
        </h1>
        <p className="text-yday-text text-xl md:text-2xl font-light mb-8 max-w-2xl mx-auto">
          discover, collect, and build community around vinyl records
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="https://testflight.apple.com/join/YOUR_TESTFLIGHT_ID" 
            target="_blank" 
            rel="noopener noreferrer"
            className="yday-button"
          >
            Download on TestFlight
          </a>
          <Link to="/scan" className="yday-button-secondary">
            Try Record Scanner
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="yday-card p-8 text-center">
            <div className="text-4xl mb-4">📷</div>
            <h3 className="yday-heading text-xl mb-3">Scan & Identify</h3>
            <p className="text-yday-text font-sans text-sm">
              Point your camera at any vinyl record. Our AI identifies it instantly from album art or text.
            </p>
          </div>
          
          <div className="yday-card p-8 text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="yday-heading text-xl mb-3">Build Your Collection</h3>
            <p className="text-yday-text font-sans text-sm">
              Organize your records with conditions, notes, and AI-generated descriptions.
            </p>
          </div>
          
          <div className="yday-card p-8 text-center">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="yday-heading text-xl mb-3">Connect & Trade</h3>
            <p className="text-yday-text font-sans text-sm">
              Find collectors nearby. Buy, sell, and chat about records you love.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

const ScanRecords = () => {
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('image/')
    );
    setFiles(prev => [...prev, ...droppedFiles]);
  }, []);

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(
      file => file.type.startsWith('image/')
    );
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const scanRecords = async () => {
    if (files.length === 0) return;
    
    setIsScanning(true);
    setResults([]);
    
    const newResults = [];
    
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await fetch(`${API_URL}/api/scan/image`, {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const data = await response.json();
          newResults.push({
            file: file.name,
            status: 'success',
            result: data.matches?.[0] || data,
          });
        } else {
          newResults.push({
            file: file.name,
            status: 'error',
            error: 'Failed to scan',
          });
        }
      } catch (error) {
        newResults.push({
          file: file.name,
          status: 'error',
          error: error.message,
        });
      }
    }
    
    setResults(newResults);
    setIsScanning(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-8">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="yday-heading text-4xl text-center mb-4">Scan Your Records</h1>
        <p className="text-yday-text text-center mb-12 font-sans">
          Upload photos of your vinyl records and we'll identify them using AI
        </p>

        {/* Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`yday-card p-12 text-center border-2 border-dashed transition-all duration-300 ${
            dragActive 
              ? 'border-yday-accent bg-yday-accent/10' 
              : 'border-yday-blue/30 hover:border-yday-blue/50'
          }`}
        >
          <div className="text-5xl mb-4">📀</div>
          <p className="text-yday-light mb-2">Drag & drop record images here</p>
          <p className="text-yday-text text-sm mb-6">or</p>
          <label className="yday-button cursor-pointer inline-block">
            Choose Files
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-8">
            <h3 className="yday-heading text-xl mb-4">Selected Files ({files.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {files.map((file, index) => (
                <div key={index} className="yday-card p-3 relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <p className="text-xs text-yday-text mt-2 truncate">{file.name}</p>
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            <button
              onClick={scanRecords}
              disabled={isScanning}
              className="yday-button w-full mt-6"
            >
              {isScanning ? 'Scanning...' : `Scan ${files.length} Record${files.length > 1 ? 's' : ''}`}
            </button>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-12">
            <h3 className="yday-heading text-xl mb-4">Scan Results</h3>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="yday-card p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-3 h-3 rounded-full mt-1 ${
                      result.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-yday-light font-sans text-sm">{result.file}</p>
                      {result.status === 'success' ? (
                        <div className="mt-2">
                          <p className="text-yday-light text-lg">
                            {result.result?.title || result.result?.artist || 'Match found'}
                          </p>
                          <p className="text-yday-text text-sm">
                            {result.result?.artist && result.result?.title 
                              ? `${result.result.artist} - ${result.result.title}`
                              : JSON.stringify(result.result).slice(0, 100)}
                          </p>
                          <button className="yday-button-secondary text-sm mt-3 py-2 px-4">
                            Save to Collection →
                          </button>
                        </div>
                      ) : (
                        <p className="text-red-400 text-sm mt-1">{result.error}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Changelog = () => {
  // This could be fetched from an API or markdown file
  const changelog = [
    {
      version: 'Unreleased',
      date: null,
      changes: [
        { type: 'added', text: 'New balanced logo design with vinyl record visual' },
        { type: 'added', text: 'Changelog page on website' },
        { type: 'added', text: 'Bulk image upload tool for testing record scanning' },
        { type: 'changed', text: 'Login buttons no longer show loading spinners' },
        { type: 'fixed', text: 'Chat showing wrong recipient name' },
        { type: 'fixed', text: '"In Collection" badge logic corrected' },
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
    added: 'bg-green-500/20 text-green-400',
    changed: 'bg-blue-500/20 text-blue-400',
    fixed: 'bg-orange-500/20 text-orange-400',
    removed: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="min-h-screen pt-24 pb-8">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="yday-heading text-4xl text-center mb-4">Changelog</h1>
        <p className="text-yday-text text-center mb-12 font-sans">
          All notable changes to yday
        </p>

        <div className="space-y-12">
          {changelog.map((release, index) => (
            <div key={index} className="yday-card p-8">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="yday-heading text-2xl">{release.version}</h2>
                {release.date && (
                  <span className="text-yday-text text-sm font-sans">{release.date}</span>
                )}
              </div>
              
              <ul className="space-y-3">
                {release.changes.map((change, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className={`text-xs font-sans font-medium px-2 py-1 rounded ${typeColors[change.type]}`}>
                      {change.type}
                    </span>
                    <span className="text-yday-light font-sans text-sm">{change.text}</span>
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
            <Route path="/scan" element={<ScanRecords />} />
            <Route path="/changelog" element={<Changelog />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
