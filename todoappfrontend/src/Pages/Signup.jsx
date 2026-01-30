import Navbar from '../Components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { authAPI } from '../services/api.js';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.signup(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Signup failed');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="w-full max-w-md glass-panel rounded-2xl p-8 transform hover:scale-[1.01] transition-all duration-300">
          <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-neon-purple to-neon-cyan neon-text">
            New Identity
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neon-purple ml-1">Designation (Name)</label>
              <input
                type="text"
                name="name"
                className="w-full px-4 py-3 rounded-xl input-field"
                placeholder="Agent 007"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neon-purple ml-1">Comms (Email)</label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-3 rounded-xl input-field"
                placeholder="agent@system.io"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neon-purple ml-1">Secret Key</label>
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
              style={{ background: 'linear-gradient(45deg, #bd00ff, #00f3ff)' }}
            >
              {loading ? 'Initializing...' : 'Register Identity'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-400">
            Already registered?{' '}
            <Link to="/login" className="text-neon-purple hover:underline">
              Access System
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
