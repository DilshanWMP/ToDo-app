import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);
  const token = localStorage.getItem('token');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-green neon-text">
          ToDo<span className="text-white">Future</span>
        </Link>

        <div className="flex items-center space-x-6">
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
      </div>
    </nav>
  );
};

export default Navbar;