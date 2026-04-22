import React, { useState, useEffect } from 'react';
import { Send, Sparkles, AlertCircle, Copy, Code2, Zap, History } from 'lucide-react';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ErrorExplainer = () => {
    const [query, setQuery] = useState('');
    const [resultData, setResultData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("errorResult");
        if (stored) {
            setResultData(JSON.parse(stored));
        }
    }, []);

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
            const response = await fetch(`${API_URL}/api/explain-error`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: query, mode: 'error' })
            });

            const data = await response.json();
            if (data && data.success) {
                localStorage.setItem('errorResult', JSON.stringify(data.data));
                setResultData(data.data);
            }
        } catch (error) {
            console.error('[EXPLAINER ERROR]', error);
        } finally {
            setIsLoading(false);
            setQuery('');
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    const DiagnosticReport = ({ data }) => {
        if (!data) return null;

        return (
            <div className="space-y-8">
                {/* 1. Header */}
                <div className="flex items-center space-x-2 mb-4">
                    <span className="px-3 py-1 bg-[#6C63FF]/10 text-[#6C63FF] rounded-full text-xs font-bold uppercase tracking-wider border border-[#6C63FF]/20">
                        {data.issues?.length || 0} Issues Detected
                    </span>
                </div>

                {/* 2. Structured Issue Cards */}
                <div className="grid grid-cols-1 gap-6">
                    {resultData?.issues && resultData.issues.length > 0 ? (
                        resultData.issues.map((issue, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                className={`p-6 rounded-2xl border-l-[6px] shadow-sm bg-white dark:bg-gray-800 transition-all hover:shadow-md ${
                                    issue.type === 'Error' ? 'border-red-500' : 
                                    issue.type === 'Warning' ? 'border-yellow-500' : 'border-blue-500'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-lg ${
                                            issue.type === 'Error' ? 'bg-red-50 dark:bg-red-900/20 text-red-600' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                                        }`}>
                                            {issue.type === 'Error' ? <AlertCircle size={20} /> : <Zap size={20} />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg dark:text-white capitalize">{issue.title || "No title available"}</h3>
                                            <span className="text-xs text-gray-500 font-mono">Location: Line {issue.line || "?"}</span>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                                        issue.type === 'Error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {issue.type || "Info"}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Meaning / Description</label>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{issue.meaning || "No meaning provided"}</p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Detection Root (Cause)</label>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic">"{issue.cause || "No cause available"}"</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Recommendation</label>
                                            <div className="flex items-start space-x-2 text-sm text-green-600 dark:text-green-400 font-medium">
                                                <Sparkles size={16} className="mt-0.5 flex-shrink-0" />
                                                <span>{issue.recommendation || "No recommendation available"}</span>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Suggested Fix</label>
                                            <code className="block mt-1 text-xs text-[#6C63FF] font-mono whitespace-pre-wrap">{issue.fix || "No fix available"}</code>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <p className="text-gray-400 text-center py-10">No issues detected</p>
                    )}
                </div>

                {/* 3. Optimized Code Block */}
                <div className="mt-12 overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl bg-[#0B1120]">
                    <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                        <div className="flex items-center space-x-3">
                            <Code2 className="text-[#6C63FF]" size={20} />
                            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">Optimized Code Output</h2>
                        </div>
                        <button 
                            onClick={() => copyToClipboard(data.finalFix || data.fix)}
                            className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors"
                        >
                            <Copy size={16} />
                        </button>
                    </div>
                    <div className="max-h-[500px] overflow-y-auto">
                        <SyntaxHighlighter 
                            language="javascript" 
                            style={atomDark}
                            customStyle={{
                                margin: 0,
                                padding: '24px',
                                background: 'transparent',
                                fontSize: '13px',
                                lineHeight: '1.6'
                            }}
                        >
                            {data.finalFix || data.fix || "// No fix code available"}
                        </SyntaxHighlighter>
                    </div>
                </div>
            </div>
        );
    };

    if (!resultData && !isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 bg-gray-50 dark:bg-[#0B1120]">
                <AlertCircle size={48} className="text-red-500 mb-4" />
                <h2 className="text-2xl font-bold dark:text-white">No Explanation Found</h2>
                <p className="text-gray-500 mt-2">Please go back to the home page and try again.</p>
                <button onClick={() => window.location.href = '/'} className="mt-6 btn-primary px-8 py-3">Go Back Home</button>
            </div>
        );
    }

    return (
        <div className="flex bg-gray-50 dark:bg-[#0B1120]">
            {/* Sidebar - Stays fixed toviewport if needed, but primary content scrolls document */}
            <aside className="w-80 hidden lg:flex flex-col sticky top-[64px] h-[calc(100vh-64px)] border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0B1120]">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <button onClick={() => { window.location.href = '/' }} className="w-full btn-primary flex items-center justify-center space-x-2 py-3">
                        <Sparkles size={18} />
                        <span>New Search</span>
                    </button>
                </div>
                <div className="flex-grow p-4 space-y-2">
                    <div className="flex items-center space-x-2 px-2 pb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <History size={14} />
                        <span>Recent Diagnosis</span>
                    </div>
                </div>
            </aside>

            {/* Main Area - No internal scroll, contributes to document scroll */}
            <main className="flex-grow flex flex-col relative text-center min-h-screen">
                <div className="p-4 lg:p-12 space-y-8">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                             <h3 className="text-xl font-bold dark:text-white">Analyzing Code...</h3>
                        </div>
                    ) : (
                        <div className="max-w-5xl mx-auto text-left">
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center space-x-3">
                                    <div className="p-3 bg-[#6C63FF] rounded-2xl text-white">
                                        <Zap size={28} />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-black dark:text-white tracking-tight uppercase">Intelligent Audit</h1>
                                    </div>
                                </div>
                            </div>
                            <DiagnosticReport data={resultData} />
                        </div>
                    )}
                </div>

                <div className="p-4 lg:p-8 bg-white dark:bg-[#0B1120] border-t border-gray-200 dark:border-gray-800 mt-auto">
                    <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative">
                         <div className="relative">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Paste another error message..."
                                className="w-full py-4 pl-6 pr-16 bg-gray-100 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-[#6C63FF] text-gray-900 dark:text-white"
                            />
                            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-[#6C63FF] text-white rounded-xl">
                                <Send size={20} />
                            </button>
                         </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ErrorExplainer;
