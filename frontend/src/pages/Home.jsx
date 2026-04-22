import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, Code2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleExplain = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate('/explain', { state: { query } });
        }
    };

    return (
        <div className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
            {/* Background Blobs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#6C63FF]/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#3B82F6]/10 blur-[120px] rounded-full animate-pulse delay-1000" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-wide uppercase mb-6 border border-indigo-200 dark:border-indigo-800">
                        <Sparkles size={14} />
                        <span>AI-Powered Error Decoding</span>
                    </span>
                    
                    <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
                        Understand Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6C63FF] to-[#3B82F6]">Code Errors</span> <br />
                        Faster Than Ever.
                    </h1>
                    
                    <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400 mb-10">
                        Stop scratching your head. Paste your error message or code snippet and get a simple, clear explanation with a verified fix in seconds.
                    </p>
                </motion.div>

                {/* Search Box */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="max-w-3xl mx-auto mb-16"
                >
                    <form onSubmit={handleExplain} className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#6C63FF] to-[#3B82F6] rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
                        <div className="relative flex items-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                            <div className="pl-6 text-gray-400">
                                <Search size={24} />
                            </div>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Paste your error message here (e.g., TypeError: ...)"
                                className="w-full py-6 px-6 bg-transparent text-lg outline-none text-gray-900 dark:text-white placeholder-gray-400"
                            />
                            <div className="pr-4">
                                <button type="submit" className="btn-primary flex items-center space-x-2 py-4">
                                    <Zap size={18} />
                                    <span>Explain Error</span>
                                </button>
                            </div>
                        </div>
                    </form>
                    <div className="mt-4 flex justify-center space-x-4">
                        <span className="text-sm text-gray-500">Try these:</span>
                        <button onClick={() => setQuery("TypeError: Cannot read property 'map' of undefined")} className="text-sm text-[#6C63FF] hover:underline">TypeError</button>
                        <button onClick={() => setQuery("IndentationError: expected an indented block")} className="text-sm text-[#6C63FF] hover:underline">Python Indentation</button>
                    </div>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "Smart Analysis", desc: "Our AI logic breaks down complex errors into simple terms.", icon: <Sparkles className="text-[#6C63FF]" /> },
                        { title: "Code Suggestions", desc: "Get ready-to-use code blocks to fix your issues instantly.", icon: <Code2 className="text-[#3B82F6]" /> },
                        { title: "Point System", desc: "Earn points and level up as you learn from your mistakes.", icon: <Zap className="text-yellow-500" /> },
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="card text-left"
                        >
                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
