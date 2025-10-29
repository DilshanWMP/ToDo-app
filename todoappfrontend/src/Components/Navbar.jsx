import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="sticky top-0 bg-green-700 text-white px-6 py-4 shadow-md z-50">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <h1 className="text-2xl font-bold tracking-wide">TodoApp</h1>
      <div className="space-x-3">
        <Link 
          to="/" 
          className="px-3 py-1 rounded-lg hover:bg-green-600 transition-colors"
        >
          Home
        </Link>
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
      </div>
    </div>
  </nav>
);

export default Navbar;
