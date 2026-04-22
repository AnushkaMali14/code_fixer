import React, { useState } from 'react';
import { Search, Filter, BookOpen, ExternalLink, Code2, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const mockLibrary = [
    {
        id: 1,
        name: "TypeError: Cannot read property 'map' of undefined",
        category: "JavaScript",
        shortDesc: "Occurs when calling .map() on an undefined variable.",
        meaning: "The array you are trying to iterate over doesn't exist yet.",
        cause: "Async data fetching or uninitialized state.",
        solution: "Use optional chaining (?.) or provide a default value [].",
        fix: "data?.map(item => <div key={item.id}>{item.name}</div>)"
    },
    {
        id: 2,
        name: "ReferenceError: x is not defined",
        category: "JavaScript",
        shortDesc: "Variable used before declaration or out of scope.",
        meaning: "The variable hasn't been created in the current scope.",
        cause: "Missing 'let/const' or typo in variable name.",
        solution: "Declare the variable before usage.",
        fix: "const x = 'hello';\nconsole.log(x);"
    },
    {
        id: 3,
        name: "IndentationError: expected an indented block",
        category: "Python",
        shortDesc: "Python blocks require consistent spacing/tabs.",
        meaning: "The structure of the code is broken due to spacing.",
        cause: "Missing indentation after a colon (:).",
        solution: "Add 4 spaces or a tab after function/loop declarations.",
        fix: "def greet():\n    print('Hello World')"
    },
    {
        id: 4,
        name: "SyntaxError: Unexpected token",
        category: "JavaScript",
        shortDesc: "Grammatical error in the code structure.",
        meaning: "The engine found characters it didn't expect.",
        cause: "Missing brackets, commas, or semicolons.",
        solution: "Check the console for the specific line and fix the syntax.",
        fix: "if (true) {\n  console.log('Fixed');\n}"
    },
    {
        id: 5,
        name: "IndexError: list index out of range",
        category: "Python",
        shortDesc: "Accessing an element that doesn't exist in a list.",
        meaning: "The index you requested is higher than the list length.",
        cause: "Looping past the end or accessing empty list.",
        solution: "Check list length with len() before accessing index.",
        fix: "my_list = [1, 2]\nif len(my_list) > 2:\n    print(my_list[2])"
    }
];

const Library = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedError, setSelectedError] = useState(null);

    const categories = ['All', 'JavaScript', 'Python', 'Java', 'C++'];

    const filteredErrors = mockLibrary.filter(err => {
        const matchesSearch = err.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || err.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <header className="mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Common Errors Library</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Browse our curated database of frequently encountered programming issues.</p>
            </header>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-10">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search errors by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-[#6C63FF] dark:text-white"
                    />
                </div>
                <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
                    <Filter className="text-gray-400 mr-2" size={20} />
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                                selectedCategory === cat 
                                ? 'bg-[#6C63FF] text-white shadow-lg' 
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredErrors.map((err) => (
                    <motion.div
                        layoutId={`card-${err.id}`}
                        key={err.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedError(err)}
                        className="card cursor-pointer group hover:border-[#6C63FF]/50"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-[#6C63FF] text-xs font-extrabold rounded-full border border-indigo-100 dark:border-indigo-800 uppercase tracking-wider">
                                {err.category}
                            </span>
                            <ChevronRight className="text-gray-300 group-hover:text-[#6C63FF] group-hover:translate-x-1 transition-all" size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 mb-2">{err.name}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3">{err.shortDesc}</p>
                    </motion.div>
                ))}
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedError && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedError(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                        >
                            <motion.div
                                layoutId={`card-${selectedError.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-[24px] overflow-hidden shadow-2xl relative"
                            >
                                <button
                                    onClick={() => setSelectedError(null)}
                                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
                                >
                                    <X size={24} className="text-gray-500" />
                                </button>

                                <div className="p-8 lg:p-12 overflow-y-auto max-h-[90vh]">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="p-3 bg-[#6C63FF]/10 text-[#6C63FF] rounded-2xl">
                                            <BookOpen size={28} />
                                        </div>
                                        <div>
                                            <span className="text-[#6C63FF] text-sm font-bold uppercase tracking-widest">{selectedError.category}</span>
                                            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">{selectedError.name}</h2>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="space-y-8">
                                            <section>
                                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">The Meaning</h4>
                                                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{selectedError.meaning}</p>
                                            </section>
                                            <section>
                                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Root Cause</h4>
                                                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{selectedError.cause}</p>
                                            </section>
                                            <section>
                                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">The Solution</h4>
                                                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{selectedError.solution}</p>
                                            </section>
                                        </div>

                                        <div>
                                             <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Fix Example</h4>
                                             <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
                                                <SyntaxHighlighter language={selectedError.category.toLowerCase()} style={atomDark} customStyle={{ padding: '24px', margin: 0 }}>
                                                    {selectedError.fix}
                                                </SyntaxHighlighter>
                                             </div>
                                             <button className="w-full mt-6 btn-primary flex items-center justify-center space-x-2">
                                                 <Code2 size={20} />
                                                 <span>Try this fix</span>
                                             </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {filteredErrors.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-lg">No errors found matching your search.</p>
                </div>
            )}
        </div>
    );
};

export default Library;
