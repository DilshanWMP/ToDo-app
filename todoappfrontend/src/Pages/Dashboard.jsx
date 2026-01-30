import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import { todoAPI } from '../services/api';

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [poppingIds, setPoppingIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await todoAPI.getAll();
      // Only show ACTIVE tasks in the bubble view
      setTodos(response.data.filter(t => !t.completed));
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleCreateTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;

    setLoading(true);
    try {
      const response = await todoAPI.create(newTodo);
      setTodos([response.data, ...todos]);
      setNewTodo({ title: '', description: '' });
    } catch (error) {
      console.error('Error creating todo:', error);
      alert('Failed to create todo');
    } finally {
      setLoading(false);
    }
  };

  const handlePop = async (id) => {
    // Trigger animation first
    setPoppingIds(prev => [...prev, id]);

    // Wait for animation to finish before calling API
    setTimeout(async () => {
      try {
        await todoAPI.update(id, { completed: true });
        setTodos(prev => prev.filter(t => t._id !== id));
      } catch (error) {
        console.error('Error popping bubble:', error);
        // Revert animation if failed
        setPoppingIds(prev => prev.filter(pid => pid !== id));
      }
    }, 400); // 400ms matches CSS animation duration
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Generate random positions/sizes for organic feel
  const getBubbleStyle = (index) => {
    const size = Math.max(120, 100 + (index % 5) * 20); // range 100-200px
    const delay = index * 0.5;
    return {
      width: `${size}px`,
      height: `${size}px`,
      animationDelay: `${delay}s`,
    };
  };

  return (
    <>
      <Navbar onLogout={handleLogout} />
      <div className="min-h-screen pt-28 px-4 pb-12 overflow-hidden relative">
        <div className="max-w-4xl mx-auto relative z-10">

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-neon-green via-neon-cyan to-neon-purple neon-text">
              Active Missions
            </h1>
            <p className="text-gray-400">Double-click a bubble to complete mission.</p>
          </div>

          {/* Add Todo Form */}
          <div className="glass-panel rounded-2xl p-4 mb-20 max-w-2xl mx-auto shadow-2xl">
            <form onSubmit={handleCreateTodo} className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={newTodo.title}
                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                className="flex-1 px-4 py-3 rounded-xl input-field bg-black/20"
                placeholder="New Objective..."
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl neon-button text-sm font-bold tracking-wider w-full md:w-auto"
              >
                {loading ? '...' : 'LAUNCH'}
              </button>
            </form>
          </div>

          {/* Bubble Area */}
          <div className="flex flex-wrap justify-center gap-12 min-h-[400px] items-center">
            {todos.length === 0 ? (
              <div className="text-center animate-pulse">
                <div className="text-8xl mb-4">🌊</div>
                <p className="text-neon-cyan text-xl">Ocean Clear. No active bubbles.</p>
              </div>
            ) : (
              todos.map((todo, index) => (
                <div
                  key={todo._id}
                  onDoubleClick={() => handlePop(todo._id)}
                  className={`bubble neon-text p-4 flex flex-col items-center justify-center ${poppingIds.includes(todo._id) ? 'popping' : ''}`}
                  style={getBubbleStyle(index)}
                  title="Double-click to Pop!"
                >
                  <h3 className="text-white font-bold text-lg leading-tight pointer-events-none">
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <span className="text-xs text-white/90 mt-1 pointer-events-none max-w-[90%] line-clamp-2 leading-tight">
                      {todo.description}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;