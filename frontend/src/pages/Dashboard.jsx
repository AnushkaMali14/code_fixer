import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Award, Zap, BookOpen, Clock, ChevronUp, TrendingUp, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/stats');
            setStats(response.data.data);
        } catch (error) {
            console.error('Failed to fetch stats');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading your dashboard...</div>;

    const calculateProgress = () => {
        if (!stats) return 0;
        const pts = stats.totalPoints;
        if (pts <= 100) return (pts / 100) * 100;
        if (pts <= 300) return ((pts - 100) / 200) * 100;
        return 100;
    };

    const getNextLevelInfo = () => {
        if (stats.totalPoints <= 100) return { next: 'Intermediate', remaining: 100 - stats.totalPoints };
        if (stats.totalPoints <= 300) return { next: 'Advanced', remaining: 300 - stats.totalPoints };
        return { next: 'Max Level', remaining: 0 };
    };

    const levelInfo = getNextLevelInfo();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <header className="mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Student Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Track your coding journey and earned achievements.</p>
            </header>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[
                    { label: 'Total Points', value: stats.totalPoints, icon: <Zap className="text-yellow-500" />, color: 'bg-yellow-50 dark:bg-yellow-900/10' },
                    { label: 'Errors Decoded', value: stats.errorsExplained, icon: <BookOpen className="text-blue-500" />, color: 'bg-blue-50 dark:bg-blue-900/10' },
                    { label: 'Current Level', value: stats.level, icon: <Award className="text-purple-500" />, color: 'bg-purple-50 dark:bg-purple-900/10' },
                ].map((card, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -5 }}
                        className={`card flex flex-col items-center justify-center text-center p-8`}
                    >
                        <div className={`w-14 h-14 ${card.color} rounded-2xl flex items-center justify-center mb-4`}>
                            {card.icon}
                        </div>
                        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">{card.label}</span>
                        <span className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{card.value}</span>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Level Progress */}
                <div className="lg:col-span-2 card">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold dark:text-white flex items-center">
                            <TrendingUp className="mr-2 text-[#6C63FF]" size={20} />
                            Level Progress
                        </h3>
                        <span className="text-sm font-medium text-[#6C63FF]">
                            {levelInfo.remaining > 0 ? `${levelInfo.remaining} pts to ${levelInfo.next}` : 'Expert Status'}
                        </span>
                    </div>
                    
                    <div className="relative h-4 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-4">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${calculateProgress()}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#6C63FF] to-[#3B82F6]"
                        />
                    </div>
                    
                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
                        <span>Beginner</span>
                        <span>Intermediate</span>
                        <span>Advanced</span>
                    </div>

                    <div className="mt-10 grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                            <span className="block text-xs font-bold text-gray-400 uppercase">Code Analyses</span>
                            <span className="text-2xl font-bold dark:text-white">{stats.codeAnalyses}</span>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                            <span className="block text-xs font-bold text-gray-400 uppercase">Examples Used</span>
                            <span className="text-2xl font-bold dark:text-white">{stats.examplesUsed}</span>
                        </div>
                    </div>
                </div>

                {/* Level Badge Display */}
                <div className="card flex flex-col items-center justify-center bg-gradient-to-br from-[#6C63FF] to-[#3B82F6] text-white border-none shadow-xl">
                    <div className="relative">
                        <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
                        <div className="relative w-32 h-32 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center shadow-2xl">
                            <Star size={64} fill="currentColor" fillOpacity={0.5} className="text-yellow-300 drop-shadow-lg" />
                        </div>
                    </div>
                    <h4 className="mt-6 text-2xl font-extrabold tracking-tight capitalize">{stats.level}</h4>
                    <p className="text-white/80 text-sm mt-1">Verified Code Fixer</p>
                    <button className="mt-6 px-6 py-2 bg-white text-[#6C63FF] font-bold rounded-lg shadow-lg hover:bg-gray-50 transition-colors">
                        Share Progress
                    </button>
                </div>
            </div>

            {/* Recent Activity (Placeholder for visual completeness) */}
            <div className="mt-10 card overflow-hidden p-0">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-lg dark:text-white">Recent Activity</h3>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <div className="flex items-center space-x-4">
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-[#6C63FF] rounded-lg">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">Explained a JavaScript Error</p>
                                    <p className="text-sm text-gray-500">2 hours ago</p>
                                </div>
                            </div>
                            <span className="text-green-500 font-bold">+10 pts</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
