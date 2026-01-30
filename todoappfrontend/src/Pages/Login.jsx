import Navbar from '../Components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { authAPI } from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authAPI.login(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="w-full max-w-md glass-panel rounded-2xl p-8 transform hover:scale-[1.01] transition-all duration-300">
          <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-green neon-text">
            System Login
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neon-cyan ml-1">Email Coordinates</label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-3 rounded-xl input-field"
                placeholder="user@system.io"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neon-cyan ml-1">Access Code</label>
              <input
                type="password"
                name="password"
                className="w-full px-4 py-3 rounded-xl input-field"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl neon-button text-lg uppercase tracking-wider mt-4"
            >
              {loading ? 'Authenticating...' : 'Initialize Session'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-400">
            <Link to="#" className="hover:text-neon-cyan transition-colors">Recover Access</Link>
            <span className="mx-3 text-gray-600">|</span>
            <Link to="/signup" className="hover:text-neon-cyan transition-colors">Create Identity</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
