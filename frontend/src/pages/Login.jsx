import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaUser, FaPhone } from 'react-icons/fa';

const Login = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const [isRegistering, setIsRegistering] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isRegistering) {
                const res = await register(name, phone);
                if (res.success) navigate('/home');
                else {
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #FAF7F2 0%, #F5F0E8 50%, #EDE5DA 100%)' }}>

            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 text-6xl opacity-20 animate-float" style={{ animationDuration: '6s' }}>🧁</div>
                <div className="absolute top-20 right-16 text-5xl opacity-15 animate-float" style={{ animationDuration: '5s', animationDelay: '1s' }}>🎂</div>
                <div className="absolute bottom-20 left-16 text-5xl opacity-15 animate-float" style={{ animationDuration: '7s', animationDelay: '0.5s' }}>☕</div>
                <div className="absolute bottom-10 right-10 text-6xl opacity-20 animate-float" style={{ animationDuration: '5.5s', animationDelay: '1.5s' }}>🍰</div>

                <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-[100px]"
                    style={{ background: 'rgba(201, 169, 98, 0.15)' }}></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-[100px]"
                    style={{ background: 'rgba(107, 68, 35, 0.1)' }}></div>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-sm rounded-3xl p-8 relative animate-fade-in-up"
                style={{
                    background: 'white',
                    border: '2px solid #E8E3DB',
                    boxShadow: '0 20px 60px rgba(107, 68, 35, 0.15)'
                }}>

                {/* Top accent line */}
                <div className="absolute top-0 left-0 w-full h-1.5 rounded-t-3xl"
                    style={{ background: 'linear-gradient(90deg, #6B4423 0%, #C9A962 50%, #6B4423 100%)' }}></div>

                {/* Logo */}
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto"
                    style={{
                        background: 'linear-gradient(135deg, #FEF3E2 0%, #FDE8CC 100%)',
                        border: '3px solid #C9A962',
                        boxShadow: '0 8px 24px rgba(201, 169, 98, 0.3)'
                    }}>
                    <span className="text-4xl">🧁</span>
                </div>

                <h2 className="text-3xl font-script mb-2 text-center" style={{ color: '#6B4423' }}>
                    Welcome!
                </h2>
                <p className="text-sm mb-8 text-center" style={{ color: '#8B7355' }}>
                    Enter your details to continue
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="text-xs font-bold uppercase ml-2 flex items-center gap-1 mb-2"
                            style={{ color: '#8B7355' }}>
                            <FaUser size={10} /> Your Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-xl px-5 py-4 font-semibold text-base outline-none transition-all"
                            style={{
                                background: '#FAF7F2',
                                border: '2px solid #E8E3DB',
                                color: '#4A3728'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#C9A962'}
                            onBlur={(e) => e.target.style.borderColor = '#E8E3DB'}
                            placeholder="e.g. Rahul"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase ml-2 flex items-center gap-1 mb-2"
                            style={{ color: '#8B7355' }}>
                            <FaPhone size={10} /> Phone Number
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full rounded-xl px-5 py-4 font-semibold text-base outline-none transition-all"
                            style={{
                                background: '#FAF7F2',
                                border: '2px solid #E8E3DB',
                                color: '#4A3728'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#C9A962'}
                            onBlur={(e) => e.target.style.borderColor = '#E8E3DB'}
                            placeholder="9876543210"
                            maxLength="10"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                        style={{
                            background: 'linear-gradient(135deg, #6B4423 0%, #5C4033 100%)',
                            boxShadow: '0 8px 24px rgba(107, 68, 35, 0.35)'
                        }}
                    >
                        {loading ? (
                            <span>Please wait...</span>
                        ) : (
                            <>
                                <span>Enter Bakery</span>
                                <FaArrowRight />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <p className="text-xs text-center mt-6" style={{ color: '#A89580' }}>
                    By continuing, you agree to our Terms & Privacy Policy
                </p>
            </div>

            {/* CSS for animations */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fadeInUp 0.5s ease forwards; }
            `}</style>
        </div>
    );
};

export default Login;
