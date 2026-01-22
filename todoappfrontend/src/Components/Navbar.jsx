import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 bg-green-700 text-white px-6 py-4 shadow-md z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">TodoApp</h1>
        <div className="space-x-3 flex items-center">
          <Link 
            to="/" 
            className="px-3 py-1 rounded-lg hover:bg-green-600 transition-colors"
          >
            Home
          </Link>
          
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className="px-3 py-1 rounded-lg hover:bg-green-600 transition-colors"
              >
                Dashboard
              </Link>
              <span className="px-3 py-1">Hello, {user.name}</span>
              <button 
                onClick={handleLogout}
                className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="px-3 py-1 rounded-lg hover:bg-green-600 transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="px-3 py-1 rounded-lg bg-white text-green-700 font-medium hover:bg-gray-100 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;