import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Navbar = ({ onLogout }) => {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);
  const token = localStorage.getItem('token');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4">
      <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex justify-between items-center relative">
        <Link to="/dashboard" className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-green neon-text">
          ToDo<span className="text-white">Future</span>
        </Link>

        {/* Mobile Menu Button */}
        {!isAuthPage && (
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        )}

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {!token ? (
            !isAuthPage && (
              <div className="space-x-4">
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link>
                <Link to="/signup" className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all">
                  Sign Up
                </Link>
              </div>
            )
          ) : (
            <div className="flex items-center space-x-6">
              <Link to="/dashboard" className="text-gray-300 hover:text-neon-cyan transition-colors">
                Dashboard
              </Link>
              <Link to="/history" className="text-gray-300 hover:text-neon-cyan transition-colors">
                History
              </Link>
              <button
                onClick={onLogout}
                className="px-5 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all font-medium"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && !isAuthPage && (
          <div className="absolute top-full left-0 right-0 mt-2 glass rounded-2xl p-4 flex flex-col space-y-4 md:hidden animate-fade-in-down">
            {!token ? (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors p-2" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/signup" className="text-neon-green hover:text-white transition-colors p-2" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-neon-cyan p-2" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/history" className="text-gray-300 hover:text-neon-cyan p-2" onClick={() => setIsMenuOpen(false)}>
                  History
                </Link>
                <button
                  onClick={() => { onLogout(); setIsMenuOpen(false); }}
                  className="text-red-400 hover:text-red-300 text-left p-2"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;