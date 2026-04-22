import React from 'react';
import { Info, Sparkles, Code2, Users, Rocket, ShieldCheck, Zap, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
    const features = [
        { icon: <Sparkles className="text-yellow-500" />, title: "AI Error Decoding", desc: "Instantly translate cryptic compiler errors into human-readable steps." },
        { icon: <Code2 className="text-blue-500" />, title: "Code Suggestions", desc: "Get snippet-ready fixes tailored to your specific programming language." },
        { icon: <Zap className="text-purple-500" />, title: "Gamified Learning", desc: "Earn points and level up your skills as you debug and learn." },
        { icon: <Globe className="text-green-500" />, title: "Multi-Language", desc: "Support for JavaScript, Python, Java, C++, and many more." },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
            {/* Mission Section */}
            <div className="text-center mb-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
                        Our Mission to Empower <br />
                        <span className="text-[#6C63FF]">Every Developer.</span>
                    </h1>
                    <p className="max-w-3xl mx-auto text-xl text-gray-500 dark:text-gray-400 leading-relaxed">
                        Code Fixers was born out of the frustration of staring at "undefined" for hours. 
                        We believe that programming errors should be learning opportunities, not roadblocks.
                    </p>
                </motion.div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
                {features.map((f, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="card text-center"
                    >
                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl shadow-inner">
                            {f.icon}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                    </motion.div>
                ))}
            </div>

            {/* Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                   initial={{ opacity: 0, x: -30 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">How It Works</h2>
                    <div className="space-y-6">
                        {[
                            { step: 1, text: "Paste your error or code into our intelligent engine." },
                            { step: 2, text: "Our simulation engine analyzes the pattern and context." },
                            { step: 3, text: "We generate a structured explanation with meaning, cause, and solution." },
                            { step: 4, text: "You get verified fix code and earn points for your progress." }
                        ].map((s, i) => (
                            <div key={i} className="flex items-start space-x-4">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#6C63FF] text-white flex items-center justify-center font-bold text-sm">
                                    {s.step}
                                </span>
                                <p className="text-lg text-gray-600 dark:text-gray-300">{s.text}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                >
                    <div className="absolute -inset-4 bg-gradient-to-r from-[#6C63FF] to-[#3B82F6] rounded-[32px] blur-2xl opacity-20"></div>
                    <div className="relative bg-white dark:bg-gray-800 rounded-[32px] p-8 lg:p-12 shadow-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center space-x-3 mb-8">
                            <Rocket className="text-[#6C63FF]" size={32} />
                            <h3 className="text-2xl font-bold dark:text-white">Built for Beginners</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed text-lg">
                            Whether you're a student learning Python or a professional debugging a complex React app, 
                            Code Fixers provides the clarity you need to move forward.
                        </p>
                        <div className="p-6 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                            <p className="font-bold text-gray-900 dark:text-white flex items-center">
                                <ShieldCheck className="mr-2 text-green-500" size={20} />
                                Safe & Secure Analysis
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                We process your code locally and our simulated AI ensures data privacy.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
            
            {/* Team Section Placeholder */}
            <div className="mt-32 text-center">
                <h2 className="text-3xl font-bold dark:text-white mb-12">The Team</h2>
                <div className="flex justify-center">
                    <div className="card max-w-sm flex items-center space-x-4 p-4 pr-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center text-gray-500">
                            <Users size={32} />
                        </div>
                        <div className="text-left">
                            <h4 className="font-bold dark:text-white">Future Innovators</h4>
                            <p className="text-sm text-gray-500">Academic Project Team</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
