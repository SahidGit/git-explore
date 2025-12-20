import React, { useState } from 'react';
// import { motion } from 'framer-motion';
import Header from '../components/layouts/Header';
import Hero from '../components/layouts/Hero';
import GithubSyncSection from '../components/features/GithubSyncSection';
import FAQ from '../components/ui/FAQ';
import Footer from '../components/layouts/Footer';
import ErrorMessage from '../components/ui/ErrorMessage';
import RepoCTA from '../components/features/RepoCard/RepoCTA';

import { storageService } from '../services/storageService';

const Home = ({ onExplore, error, onNavigate, onTabChange }) => {
    const [activeTab, setActiveTab] = useState('explore');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (onTabChange) {
            onTabChange(tab);
        }
    };

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleTokenSave = (token) => {
        storageService.saveToken(token);
    };

    // const fadeInUp = {
    //     hidden: { opacity: 0, y: 60 },
    //     visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    // };

    return (
        <div className="min-h-screen bg-[#0D1117] text-[#F0F6FC] font-sans">
            <Header
                activeTab={activeTab}
                onTabChange={handleTabChange}
                onTokenSave={handleTokenSave}
                onNavigate={onNavigate}
                showBackButton={false}
            />
            <Hero onExplore={onExplore} />

            {error && (
                <div className="max-w-4xl mx-auto mt-8">
                    <ErrorMessage message={error} onRetry={onExplore} />
                </div>
            )}

            {/* <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
            > */}
            <GithubSyncSection />
            {/* </motion.div> */}

            {/* <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
            > */}
            <FAQ />
            {/* </motion.div> */}

            <RepoCTA onNavigate={onNavigate} />
            <Footer onNavigate={onNavigate} />
        </div>
    );
};

export default Home;
