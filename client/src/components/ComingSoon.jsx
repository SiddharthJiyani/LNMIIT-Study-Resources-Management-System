import React from 'react';
import { motion } from 'framer-motion'; // For subtle animations

const Dashboard = () => {
    return (
        <div className="relative flex items-center justify-center h-screen bg-gradient-to-br from-indigo-200 via-white to-indigo-500">
            {/* Background pattern */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400 opacity-20 rounded-full mix-blend-multiply blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-300 opacity-20 rounded-full mix-blend-multiply blur-3xl"></div>
            </div>

            {/* Content */}
            <motion.div 
                className="z-10 text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
            >
                <h1 className="text-6xl font-extrabold text-gray-500 tracking-tight">
                    Coming Soon
                </h1>
                <p className="text-xl text-gray-500 mt-4 max-w-lg mx-auto">
                    We're working hard to bring something amazing. Stay tuned for updates!
                </p>
            </motion.div>
        </div>
    );
};

export default Dashboard;
