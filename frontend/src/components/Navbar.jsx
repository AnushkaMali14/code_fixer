import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Code2, Home, LayoutDashboard, Library, Search, Info } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const Navbar = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const location = useLocation();

    const navLinks = [
        { name: 'Home', path: '/', icon: <Home size={18} /> },
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
        { name: 'Library', path: '/library', icon: <Library size={18} /> },
        { name: 'Analyzer', path: '/analyzer', icon: <Search size={18} /> },
        { name: 'About', path: '/about', icon: <Info size={18} /> },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="p-2 bg-gradient-to-br from-[#6C63FF] to-[#3B82F6] rounded-lg group-hover:rotate-12 transition-transform duration-300">
                            <Code2 className="text-white" size={24} />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6C63FF] to-[#3B82F6]">
                            Code Fixers
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`flex items-center space-x-1.5 text-sm font-medium transition-colors duration-200 hover:text-[#6C63FF] ${
                                    location.pathname === link.path 
                                    ? 'text-[#6C63FF]' 
                                    : 'text-gray-600 dark:text-gray-300'
                                }`}
                            >
                                {link.icon}
                                <span>{link.name}</span>
                            </Link>
                        ))}

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>

                    {/* Mobile Menu Toggle (Simplified) */}
                    <div className="md:hidden flex items-center space-x-4">
                        <button onClick={toggleTheme} className="p-2">
                             {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
