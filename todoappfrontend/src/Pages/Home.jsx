import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100 px-4">
        <h2 className="text-4xl font-bold text-green-800 mb-4">Welcome to ToDo-App</h2>
        <p className="text-lg text-gray-600 max-w-md text-center mb-8">
          Organize your tasks and boost your productivity with our simple and intuitive todo application.
        </p>
        
        {user ? (
          <Link 
            to="/dashboard" 
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Go to Dashboard
          </Link>
        ) : (
          <div className="space-x-4">
            <Link 
              to="/login" 
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="px-6 py-3 bg-white text-green-700 border border-green-700 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;