import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaArrowRight } from 'react-icons/fa';

const Login = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const [isRegistering, setIsRegistering] = useState(true); // Default to register flow for new users

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isRegistering) {
            const res = await register(name, phone);
            if (res.success) navigate('/home');
            else {
                // If user exists, try login
                if (res.message === 'User already exists') {
                    const loginRes = await login(phone);
                    if (loginRes.success) navigate('/home');
                    else alert(loginRes.message);
                } else {
                    alert(res.message);
                }
            }
        } else {
            const res = await login(phone);
            if (res.success) navigate('/home');
            else alert(res.message);
        }
    };

    return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
             <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden animate-slide-up">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-red-500"></div>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto text-3xl">
                    👋
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Let's Eat!</h2>
                <p className="text-gray-500 text-sm mb-8 text-center">Tell us your name to start.</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase ml-2">Your Name</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 font-bold text-lg focus:ring-2 focus:ring-orange-500 outline-none text-gray-800"
                            placeholder="e.g. Rahul"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase ml-2">Phone Number</label>
                        <input 
                            type="tel" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 font-bold text-lg focus:ring-2 focus:ring-orange-500 outline-none text-gray-800"
                            placeholder="9876543210"
                            maxLength="10"
                            required
                        />
                    </div>
                    <button type="submit"
                        className="w-full bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold text-lg py-4 rounded-2xl shadow-xl shadow-orange-200 active:scale-95 transition-transform mt-4 flex items-center justify-center gap-2">
                        Enter Cafe <FaArrowRight />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
