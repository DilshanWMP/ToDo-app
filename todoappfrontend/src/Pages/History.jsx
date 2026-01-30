import { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import { todoAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const History = () => {
    const [todos, setTodos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await todoAPI.getAll();
            setTodos(response.data);
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete record permanently?")) return;
        try {
            await todoAPI.delete(id);
            setTodos(todos.filter(t => t._id !== id));
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            <Navbar onLogout={handleLogout} />
            <div className="min-h-screen pt-28 px-4 pb-12">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-400">
                            Mission Log
                        </h1>
                        <p className="text-gray-500">Historical records of all objectives.</p>
                    </div>

                    <div className="space-y-4">
                        {todos.length === 0 ? (
                            <div className="text-center text-gray-500 py-10">No records found.</div>
                        ) : (
                            todos.map(todo => (
                                <div key={todo._id} className={`glass rounded-xl p-4 flex items-center justify-between ${todo.completed ? 'opacity-50' : 'opacity-100'}`}>
                                    <div>
                                        <h3 className={`font-semibold text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-neon-cyan'}`}>
                                            {todo.title}
                                        </h3>
                                        <p className="text-sm text-gray-400">{todo.description}</p>
                                        <span className={`text-xs px-2 py-0.5 rounded border mt-2 inline-block ${todo.completed ? 'border-green-500/30 text-green-500' : 'border-yellow-500/30 text-yellow-500'}`}>
                                            {todo.completed ? 'COMPLETED' : 'PENDING'}
                                        </span>
                                    </div>
                                    <button onClick={() => handleDelete(todo._id)} className="text-red-400 hover:text-red-300">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default History;
