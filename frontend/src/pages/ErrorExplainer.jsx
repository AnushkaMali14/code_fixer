import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, History, Sparkles, AlertCircle, CheckCircle2, ChevronRight, Copy, Share2, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import axios from 'axios';
import { getFallbackResponse } from '../utils/fallbacks';

const ErrorExplainer = () => {
    const location = useLocation();
    const [query, setQuery] = useState(location.state?.query || '');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (location.state?.query) {
            // Use a slight delay or ref to ensure component is ready
            const timeout = setTimeout(() => {
                handleSendMessage(null, location.state.query);
            }, 100);
            return () => clearTimeout(timeout);
        }
    }, [location.state]);

    const handleSendMessage = async (e, directQuery = null) => {
        if (e) e.preventDefault();
        
        const queryToUse = directQuery || query;
        if (!queryToUse.trim()) return;

        console.log(`[FRONTEND] Sending request for query: "${queryToUse.substring(0, 30)}..."`);

        const userMessage = { type: 'user', content: queryToUse };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setQuery('');

        try {
            const response = await axios.post('http://localhost:5000/api/explain-error', {
                query: queryToUse,
                mode: 'error'
            }, { timeout: 10000 }); // 10 second timeout

            console.log('[FRONTEND] Received response from backend:', response.data);

            const aiResponse = { 
                type: 'ai', 
                content: response.data.data,
                points: response.data.pointsEarned,
                level: response.data.level
            };
            setMessages(prev => [...prev, aiResponse]);
            setHistory(prev => [{ query: queryToUse, timestamp: new Date() }, ...prev]);
        } catch (error) {
            console.error('[FRONTEND ERROR] API Request failed:', error.message);
            
            let errorMessage = 'Connection failed. Is the server running?';
            if (error.code === 'ECONNABORTED') {
                errorMessage = 'Request timed out. The server took too long to respond.';
            }

            // Using Fallback System
            const fallbackData = getFallbackResponse(queryToUse);
            const aiResponse = { 
                type: 'ai', 
                content: fallbackData,
                points: 0,
                level: 'Offline Mode'
            };

            setMessages(prev => [
                ...prev, 
                { type: 'error', content: errorMessage },
                aiResponse
            ]);
        } finally {
            setIsLoading(false);
            console.log('[FRONTEND] Loading finished.');
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // Add toast notification here
    };

    const ErrorResultCards = ({ analysis }) => (
        <div className="grid grid-cols-1 gap-6 mt-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="card border-l-4 border-blue-500">
                <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                        <MessageSquare size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">What it Means</h4>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">{analysis.meaning}</p>
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="card border-l-4 border-red-500">
                <div className="flex items-start space-x-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600">
                        <AlertCircle size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">Why it Happened</h4>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">{analysis.cause}</p>
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="card border-l-4 border-green-500">
                <div className="flex items-start space-x-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600">
                        <CheckCircle2 size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">The Solution</h4>
                        <p className="mt-2 text-gray-600 dark:text-gray-400 whitespace-pre-line">{analysis.solution}</p>
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="card border-l-4 border-purple-500 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600">
                            <Code2 size={20} />
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white">Fixed Code</h4>
                    </div>
                    <button onClick={() => copyToClipboard(analysis.fixCode)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Copy size={16} />
                    </button>
                </div>
                <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <SyntaxHighlighter language="javascript" style={atomDark} customStyle={{ margin: 0 }}>
                        {analysis.fixCode}
                    </SyntaxHighlighter>
                </div>
            </motion.div>
        </div>
    );

    return (
        <div className="flex h-[calc(100vh-64px)] bg-gray-50 dark:bg-[#0B1120]">
            {/* Sidebar */}
            <aside className="w-80 hidden lg:flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0B1120]">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <button 
                        onClick={() => { setMessages([]); setQuery(''); }}
                        className="w-full btn-primary flex items-center justify-center space-x-2 py-3"
                    >
                        <Sparkles size={18} />
                        <span>New Explanation</span>
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto p-4 space-y-2">
                    <div className="flex items-center space-x-2 px-2 pb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <History size={14} />
                        <span>History</span>
                    </div>
                    {history.length === 0 ? (
                        <p className="text-center text-gray-400 text-sm mt-8">No history yet</p>
                    ) : (
                        history.map((item, i) => (
                            <button key={i} className="w-full text-left p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{item.query}</div>
                                <div className="text-[10px] text-gray-400 mt-1">{new Date(item.timestamp).toLocaleTimeString()}</div>
                            </button>
                        ))
                    )}
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-grow flex flex-col relative overflow-hidden">
                <div className="flex-grow overflow-y-auto p-4 lg:p-8 space-y-8 scroll-smooth">
                    {messages.length === 0 && !isLoading && (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                            <Sparkles size={48} className="text-[#6C63FF] mb-4" />
                            <h3 className="text-xl font-bold dark:text-white">Start your analysis</h3>
                            <p className="text-gray-500 mt-2">Paste an error message below to get started</p>
                        </div>
                    )}

                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[90%] lg:max-w-[70%] ${msg.type === 'user' ? '' : 'w-full'}`}>
                                {msg.type === 'user' ? (
                                    <div className="bg-[#6C63FF] text-white p-4 rounded-t-2xl rounded-bl-2xl shadow-lg inline-block">
                                        {msg.content}
                                    </div>
                                ) : msg.type === 'ai' ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-2 text-[#6C63FF] font-bold mb-2">
                                            <Sparkles size={18} />
                                            <span>AI Explanation</span>
                                            <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 px-2 py-0.5 rounded-full border border-yellow-200">+{msg.points} Points</span>
                                        </div>
                                        <ErrorResultCards analysis={msg.content} />
                                    </div>
                                ) : (
                                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-4 rounded-xl border border-red-100 dark:border-red-800 flex items-center space-x-2">
                                        <AlertCircle size={18} />
                                        <span>{msg.content}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="flex space-x-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-2 h-2 bg-[#6C63FF] rounded-full" />
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-[#6C63FF] rounded-full" />
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-[#6C63FF] rounded-full" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Field */}
                <div className="p-4 lg:p-8 bg-white dark:bg-[#0B1120] border-t border-gray-200 dark:border-gray-800">
                    <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Paste your next error here..."
                            className="w-full py-4 pl-6 pr-16 bg-gray-100 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-[#6C63FF] text-gray-900 dark:text-white transition-all shadow-inner"
                        />
                        <button 
                            type="submit"
                            disabled={!query.trim() || isLoading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-[#6C63FF] to-[#3B82F6] text-white rounded-xl shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ErrorExplainer;
