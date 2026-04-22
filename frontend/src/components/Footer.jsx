import React from 'react';

const Footer = () => {
    return (
        <footer className="text-center py-6 text-gray-400 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4">
                <p>© {new Date().getFullYear()} Code Fixers. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
