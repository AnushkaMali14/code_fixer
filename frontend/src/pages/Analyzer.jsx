import React, { useState } from 'react';
import { Terminal, Code2, Sparkles, FileCode, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';
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
        setResults(null);
        
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/explain-error', {
                query: code,
                mode: 'code'
            }, { timeout: 15000 });
            
            const resultData = response.data.data;
            
            // MANDATORY DEBUGGING LOGS
            console.log("ISSUES:", resultData.issues);
            console.log("FIRST ISSUE:", resultData?.issues?.[0]);

            setResults(resultData);
        } catch (error) {
            console.error('Analysis failed:', error);
            setResults({
                issues: [{
                    title: "Analysis Unavailable",
                    meaning: "Could not complete analysis. Backend may be offline.",
                    recommendation: "Ensure the backend server is running and try again.",
                    fix: "// Error: Server Unreachable",
                    type: "Error",
                    line: 0
                }],
                fix: "// Unable to generate fix code"
            });
        } finally {
            setIsAnalyzing(false);
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Editor Section */}
                <div className="flex flex-col bg-[#1e1e1e] rounded-[24px] overflow-hidden shadow-2xl border border-gray-800">
                    <div className="flex items-center justify-between px-6 py-4 bg-[#252525] border-b border-gray-800">
                        <div className="flex items-center space-x-2">
                            <FileCode className="text-gray-400" size={18} />
                            <span className="text-gray-400 text-sm font-medium">main.js</span>
                        </div>
                    </div>
                    <div className="p-0 min-h-[400px]">
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full min-h-[400px] p-6 bg-transparent text-[#d4d4d4] font-mono text-sm resize-none outline-none leading-relaxed"
                            placeholder="// Paste your code here..."
                        />
                    </div>
                    <div className="p-6 bg-[#252525] border-t border-gray-800 flex justify-end">
                        <button 
                            onClick={handleAnalyze}
                            disabled={!code.trim() || isAnalyzing}
                            className={`btn-primary flex items-center space-x-2 py-3 px-8 ${isAnalyzing ? 'opacity-50' : ''}`}
                        >
                            <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Code'}</span>
                            <Sparkles size={18} />
                        </button>
                    </div>
                </div>

                {/* Results Section */}
                <div className="flex flex-col space-y-6">
                    {results ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="card flex flex-col"
                        >
                            <div className="flex items-center space-x-3 mb-6">
                                <CheckCircle2 className="text-green-500" size={24} />
                                <h3 className="text-xl font-bold dark:text-white">Analysis Result</h3>
                            </div>
                            
                            <div className="space-y-6 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
                                {/* DETECTED ISSUES SECTION - Explicit Array Rendering */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Detected Issues</h4>
                                    {results.issues && results.issues.length > 0 ? (
                                        results.issues.map((issue, idx) => (
                                            <div key={idx} className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-800">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center space-x-2 text-[#6C63FF] font-bold">
                                                        <AlertTriangle size={18} />
                                                        <h4 className="text-sm uppercase tracking-wider">{issue.title || "Potential Issue"}</h4>
                                                    </div>
                                                    <span className="text-[10px] font-mono bg-[#6C63FF]/10 text-[#6C63FF] px-2 py-0.5 rounded">Line {issue.line || 0}</span>
                                                </div>
                                                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-2">{issue.meaning || "No description available"}</p>
                                                <div className="text-[11px] text-gray-500 dark:text-gray-400 italic bg-gray-100 dark:bg-gray-800/50 p-2 rounded-lg">
                                                    <strong>Root Cause:</strong> {issue.cause || "No cause identified"}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-sm pl-2">No issues detected</p>
                                    )}
                                </div>

                                {/* RECOMMENDATIONS SECTION - Derived ONLY from issues array */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Targeted Recommendations</h4>
                                    <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-800">
                                        <div className="flex items-center space-x-2 text-amber-600 font-bold mb-3">
                                            <Lightbulb size={18} />
                                            <h4 className="text-sm uppercase tracking-wider">Suggested Actions</h4>
                                        </div>
                                        <ul className="space-y-3">
                                            {results.issues && results.issues.length > 0 ? (
                                                results.issues.map((issue, idx) => (
                                                    <li key={idx} className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                                                        <span>{issue.recommendation || "No specific recommendation available"}</span>
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="text-gray-500 text-sm">No recommendations available</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>

                                {/* OPTIMIZED CODE SECTION */}
                                <div>
                                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 pl-1">Optimized Output Code</h4>
                                    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                                        <SyntaxHighlighter language="javascript" style={atomDark}>
                                            {results.finalFix || results.fix || "// No fix available"}
                                        </SyntaxHighlighter>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="card flex flex-col items-center justify-center text-center p-12 opacity-50 border-dashed border-2">
                            <Code2 size={48} className="mb-6 text-gray-400" />
                            <h3 className="text-xl font-bold dark:text-white">Ready for Analysis</h3>
                            <p className="text-gray-500 max-w-xs mt-2">Enter your code in the editor to see results here.</p>
                        </div>
                    )}

                    <div className="card bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-none p-6">
                        <div className="flex items-start space-x-4">
                            <Sparkles size={20} className="mt-1" />
                            <div>
                                <h4 className="font-bold">Pro Tip</h4>
                                <p className="text-sm text-blue-100 mt-1">Analyzing code gives 20 points!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analyzer;
