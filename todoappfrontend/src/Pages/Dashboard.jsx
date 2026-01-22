import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import { todoAPI } from '../services/api';

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await todoAPI.getAll();
      setTodos(response.data);
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

  const handleUpdateTodo = async (id, updates) => {
    try {
      const response = await todoAPI.update(id, updates);
      setTodos(todos.map(todo => 
        todo._id === id ? response.data : todo
      ));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) return;
    
    try {
      await todoAPI.delete(id);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('Failed to delete todo');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      <Navbar onLogout={handleLogout} />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-green-800 mb-2">My Todo List</h1>
            <p className="text-gray-600">Stay organized and productive</p>
          </div>

          {/* Add Todo Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <form onSubmit={handleCreateTodo} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={newTodo.title}
                  onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="What needs to be done?"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={newTodo.description}
                  onChange={(e) => setNewTodo({...newTodo, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Add some details..."
                  rows="2"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Adding...' : 'Add Todo'}
              </button>
            </form>
          </div>

          {/* Todo List */}
          <div className="space-y-4">
            {todos.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No todos yet. Add one above!</p>
              </div>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo._id}
                  className={`bg-white rounded-2xl shadow-lg p-4 transition-all duration-200 ${
                    todo.completed ? 'opacity-75' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={(e) => handleUpdateTodo(todo._id, { completed: e.target.checked })}
                        className="mt-1 w-5 h-5 text-green-600 rounded focus:ring-green-500"
                      />
                      <div className="flex-1">
                        <h3 className={`font-medium ${
                          todo.completed ? 'line-through text-gray-500' : 'text-gray-800'
                        }`}>
                          {todo.title}
                        </h3>
                        {todo.description && (
                          <p className="text-gray-600 text-sm mt-1">{todo.description}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                          Created: {new Date(todo.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteTodo(todo._id)}
                      className="text-red-500 hover:text-red-700 transition-colors ml-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
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