import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaLock, FaEnvelope, FaSignInAlt, FaUtensils } from 'react-icons/fa';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { adminLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        const result = await adminLogin(email, password);
        
        if (result.success) {
            navigate('/admin/dashboard');
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Pattern - Food Icons */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
                <div className="grid grid-cols-6 gap-12 rotate-12 scale-110">
                    {[...Array(48)].map((_, i) => (
                        <div key={i} className="text-6xl text-orange-900 transform hover:scale-110 transition-transform duration-700">
                           {['🍔', '🍕', '🍰', '🥐', '☕', '🥤', '🧁', '🍪', '🥪', '🥨', '🥯', '🥞'][i % 12]}
                        </div>
                    ))}
                </div>
            </div>

            {/* Glowing Orbs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                 <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-orange-200/40 rounded-full blur-[100px]"></div>
                 <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-amber-200/40 rounded-full blur-[100px]"></div>
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-sm">
                
                {/* Logo Section */}
                <div className="text-center mb-8 relative">
                    <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-orange-100 rotate-3 hover:rotate-0 transition-all duration-500 border-4 border-orange-50">
                        <FaUtensils className="text-4xl text-orange-500" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight">
                        Shubham<span className="text-orange-500">Pattis</span>
                    </h1>
                    <p className="text-gray-400 font-medium">ShubhamPattis</p>
                </div>

                {/* Form Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_20px_60px_-15px_rgba(255,100,0,0.1)] border border-white/60">
                    
                    {error && (
                        <div className="bg-red-50 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm text-center font-bold border border-red-100 flex items-center justify-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email</label>
                            <div className="relative group">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" />
                                <input 
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-orange-50/50 border-2 border-orange-50 rounded-xl pl-11 pr-4 py-3.5 text-gray-800 font-medium focus:bg-white focus:outline-none focus:border-orange-300 transition-all placeholder:text-gray-300"
                                    placeholder="admin@shubhampattis.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Password</label>
                            <div className="relative group">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" />
                                <input 
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-orange-50/50 border-2 border-orange-50 rounded-xl pl-11 pr-4 py-3.5 text-gray-800 font-medium focus:bg-white focus:outline-none focus:border-orange-300 transition-all placeholder:text-gray-300"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5 transition-all active:scale-[0.98] active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? (
                                <FaUtensils className="animate-spin" />
                            ) : (
                                <>
                                    <span>Safe Entry</span>
                                    <FaSignInAlt />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="text-center mt-8">
                     <button 
                        onClick={() => navigate('/')}
                        className="text-gray-400 hover:text-orange-500 transition-colors text-sm font-semibold"
                    >
                        Return to Shop
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
