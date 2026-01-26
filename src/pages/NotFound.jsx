import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/layouts/Header';
import SEO from '../components/ui/SEO';
import { Home } from 'lucide-react';

const NotFound = () => {
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Animation variants matching Framer design
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    // SVG path animation for the illustration
    const pathVariants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { duration: 2, ease: "easeInOut" },
                opacity: { duration: 0.5 },
            },
        },
    };

    const circleVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.5,
            },
        },
    };

    return (
        <div className="min-h-screen bg-[#0D1117] text-[#F0F6FC] font-sans overflow-hidden relative">
            <SEO
                title="404 - Page Not Found | GitExplorer"
                description="The page you're looking for doesn't exist."
                canonical="https://git-explore-one.vercel.app/404"
            />
            <Header showBackButton={true} activeTab="" />

            <main className="relative z-10 pt-16 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-80px)] flex items-center justify-center">
                <motion.div
                    className="max-w-4xl mx-auto w-full"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="flex flex-col items-center justify-center text-center space-y-8 sm:space-y-12">
                        {/* Animated SVG Illustration */}
                        <motion.div
                            className="w-full max-w-[600px] sm:max-w-[800px] mb-4 sm:mb-8"
                            variants={itemVariants}
                        >
                            <svg
                                viewBox="0 0 600 400"
                                className="w-full h-auto"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                {/* Background gradient */}
                                <defs>
                                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#58A6FF" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#BC8CFF" stopOpacity="0.3" />
                                    </linearGradient>
                                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#BC8CFF" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#58A6FF" stopOpacity="0.3" />
                                    </linearGradient>
                                </defs>

                                {/* Animated paths - abstract lost/exploration theme */}
                                <motion.path
                                    d="M100 200 Q200 100 300 200 T500 200"
                                    stroke="url(#gradient1)"
                                    strokeWidth="3"
                                    fill="none"
                                    strokeLinecap="round"
                                    variants={pathVariants}
                                    animate={{
                                        pathLength: [0, 1, 0],
                                        opacity: [0.3, 1, 0.3],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                />
                                <motion.path
                                    d="M150 250 Q250 150 350 250 T550 250"
                                    stroke="url(#gradient2)"
                                    strokeWidth="2"
                                    fill="none"
                                    strokeLinecap="round"
                                    variants={pathVariants}
                                    animate={{
                                        pathLength: [0, 1, 0],
                                        opacity: [0.3, 0.8, 0.3],
                                    }}
                                    transition={{
                                        duration: 3.5,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: 0.5,
                                    }}
                                />

                                {/* Floating circles */}
                                <motion.circle
                                    cx="150"
                                    cy="150"
                                    r="8"
                                    fill="#58A6FF"
                                    variants={circleVariants}
                                    animate={{
                                        y: [0, -20, 0],
                                        opacity: [0.6, 1, 0.6],
                                    }}
                                    transition={{
                                        duration: 2.5,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                />
                                <motion.circle
                                    cx="450"
                                    cy="180"
                                    r="6"
                                    fill="#BC8CFF"
                                    variants={circleVariants}
                                    animate={{
                                        y: [0, -15, 0],
                                        opacity: [0.6, 1, 0.6],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: 0.3,
                                    }}
                                />
                                <motion.circle
                                    cx="300"
                                    cy="100"
                                    r="10"
                                    fill="#58A6FF"
                                    variants={circleVariants}
                                    animate={{
                                        y: [0, -25, 0],
                                        opacity: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: 0.6,
                                    }}
                                />
                                <motion.circle
                                    cx="500"
                                    cy="300"
                                    r="7"
                                    fill="#BC8CFF"
                                    variants={circleVariants}
                                    animate={{
                                        y: [0, -18, 0],
                                        opacity: [0.6, 1, 0.6],
                                    }}
                                    transition={{
                                        duration: 2.8,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: 0.9,
                                    }}
                                />

                                {/* Central compass/exploration icon */}
                                <motion.g
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.8, duration: 0.6 }}
                                >
                                    <circle
                                        cx="300"
                                        cy="200"
                                        r="40"
                                        fill="none"
                                        stroke="#58A6FF"
                                        strokeWidth="2"
                                        opacity="0.4"
                                    />
                                    <motion.path
                                        d="M300 180 L310 200 L300 220 L290 200 Z"
                                        fill="#58A6FF"
                                        animate={{ rotate: [0, 360] }}
                                        transition={{
                                            duration: 8,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                        style={{ transformOrigin: "300px 200px" }}
                                    />
                                </motion.g>
                            </svg>
                        </motion.div>

                        {/* Error Message - Matching Framer text */}
                        <motion.div variants={itemVariants} className="space-y-4 sm:space-y-6">
                            <motion.h1
                                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#F0F6FC]"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                            >
                                Oops, I think we're lost...
                            </motion.h1>
                            <motion.p
                                className="text-lg sm:text-xl md:text-2xl text-slate-400 font-light max-w-2xl mx-auto"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                            >
                                Let's get you back to somewhere familiar.
                            </motion.p>
                        </motion.div>

                        {/* Back Home Button */}
                        <motion.div
                            variants={itemVariants}
                            className="pt-4 sm:pt-6"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to="/"
                                    className="group inline-flex items-center gap-2 px-8 sm:px-10 py-4 sm:py-5 bg-[#58A6FF] hover:bg-[#4a95e6] text-white font-medium rounded-full transition-all duration-300 shadow-lg shadow-[#58A6FF]/30 hover:shadow-[#58A6FF]/50 text-base sm:text-lg"
                                >
                                    <Home className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
                                    <span>Back Home</span>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default NotFound;
