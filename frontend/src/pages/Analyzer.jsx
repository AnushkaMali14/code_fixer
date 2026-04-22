import React, { useState } from 'react';
import { Search, Code2, Sparkles, Terminal, FileCode, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import axios from 'axios';

const Analyzer = () => {
    const [code, setCode] = useState('');
    const [results, setResults] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalyze = async () => {
        if (!code.trim()) return;
        setIsAnalyzing(true);
        setResults(null); // Clear previous results

        console.log(`[FRONTEND] Starting code analysis for ${code.length} characters.`);
        
        try {
            const response = await axios.post('http://localhost:5000/api/explain-error', {
                query: code,
                mode: 'code'
            }, { timeout: 15000 }); // 15 second timeout for code analysis

            console.log('[FRONTEND] Analysis successful:', response.data);
            setResults(response.data.data);
        } catch (error) {
            console.error('[FRONTEND ERROR] Analysis failed:', error.message);
            
            let errorMsg = "Could not analyze code. Please check your connection.";
            if (error.code === 'ECONNABORTED') {
                errorMsg = "Analysis timed out. Try a smaller code snippet.";
            }

            setResults({
                meaning: "Analysis Unavailable",
                cause: errorMsg,
                solution: "Ensure the backend server is running and try again.",
                fixCode: "// Unable to generate fix code without server connection"
            });
        } finally {
            setIsAnalyzing(false);
            console.log('[FRONTEND] Analysis loading finished.');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <header className="mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center">
                    <Terminal className="mr-3 text-[#6C63FF]" size={32} />
                    Intelligent Code Analyzer
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Paste your source code to detect logical errors and get optimization tips.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[700px]">
                {/* Editor Section */}
                <div className="flex flex-col h-full bg-[#1e1e1e] rounded-[24px] overflow-hidden shadow-2xl border border-gray-800">
                    <div className="flex items-center justify-between px-6 py-4 bg-[#252525] border-b border-gray-800">
                        <div className="flex items-center space-x-2">
                            <FileCode className="text-gray-400" size={18} />
                            <span className="text-gray-400 text-sm font-medium">main.js</span>
                        </div>
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/50" />
                        </div>
                    </div>
                    <div className="flex-grow relative">
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full h-full p-6 bg-transparent text-[#d4d4d4] font-mono text-sm resize-none outline-none leading-relaxed"
                            placeholder="// Paste your code here...&#10;function hello() {&#10;  console.log('world');&#10;}"
                        />
                    </div>
                    <div className="p-6 bg-[#252525] border-t border-gray-800 flex justify-end">
                        <button 
                            onClick={handleAnalyze}
                            disabled={!code.trim() || isAnalyzing}
                            className={`btn-primary flex items-center space-x-2 py-3 px-8 ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isAnalyzing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles size={18} />}
                            <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Code'}</span>
                        </button>
                    </div>
                </div>

                {/* Results Section */}
                <div className="flex flex-col h-full space-y-6">
                    {results ? (
                        <>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="card flex-grow overflow-y-auto"
                            >
                                <div className="flex items-center space-x-3 mb-6">
                                    <CheckCircle2 className="text-green-500" size={24} />
                                    <h3 className="text-xl font-bold dark:text-white">Analysis Result</h3>
                                </div>
                                
                                <div className="space-y-6">
                                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-800">
                                        <div className="flex items-center space-x-2 text-[#6C63FF] font-bold mb-2">
                                            <AlertTriangle size={18} />
                                            <h4 className="text-sm uppercase tracking-wider">Detected Issue</h4>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300">{results.meaning}</p>
                                    </div>

                                    <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-800">
                                        <div className="flex items-center space-x-2 text-amber-600 font-bold mb-2">
                                            <Lightbulb size={18} />
                                            <h4 className="text-sm uppercase tracking-wider">Recommendation</h4>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300">{results.solution}</p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Optimized Code</h4>
                                        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                                            <SyntaxHighlighter language="javascript" style={atomDark}>
                                                {results.fixCode}
                                            </SyntaxHighlighter>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    ) : (
                        <div className="flex-grow card flex flex-col items-center justify-center text-center p-12 opacity-50 border-dashed border-2">
                            <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-full mb-6 text-gray-400">
                                <Code2 size={48} />
                            </div>
                            <h3 className="text-xl font-bold dark:text-white">Ready for Analysis</h3>
                            <p className="text-gray-500 max-w-xs mt-2">Enter your code in the editor and click analyze to see results here.</p>
                        </div>
                    )}

                    {/* Small Tip Card */}
                    <div className="card bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-none p-6">
                        <div className="flex items-start space-x-4">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Sparkles size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold">Pro Tip</h4>
                                <p className="text-sm text-blue-100 mt-1">Analyzing code gives 20 points! Use it to find hidden bugs before they arrive.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analyzer;
