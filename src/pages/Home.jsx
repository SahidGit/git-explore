
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layouts/Header';
import Hero from '../components/layouts/Hero';
import GithubSyncSection from '../components/features/GithubSyncSection';
import FAQ from '../components/ui/FAQ';
import Footer from '../components/layouts/Footer';
import ErrorMessage from '../components/ui/ErrorMessage';
import RepoCTA from '../components/features/RepoCard/RepoCTA';
import SEO from '../components/ui/SEO';
import { storageService } from '../services/storageService';

const Home = () => {
    const navigate = useNavigate();
// Local error state removed as unused

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleExplore = () => {
        navigate('/dashboard');
    };

    const handleTokenSave = (token) => {
        storageService.saveToken(token);
    };

    return (
        <div className="min-h-screen bg-[#0D1117] text-[#F0F6FC] font-sans">
            <SEO
                title="GitExplorer - Discover Trending Repositories"
                description="Explore top trending GitHub repositories, analyze developer profiles, and find the perfect tools for your next project."
                canonical="https://gitexplorer.com/"
                schema={{
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "name": "GitExplorer",
                    "url": "https://gitexplorer.com/",
                    "potentialAction": {
                        "@type": "SearchAction",
                        "target": "https://gitexplorer.com/dashboard?q={search_term_string}",
                        "query-input": "required name=search_term_string"
                    }
                }}
            />
            <Header
                activeTab="home"
                onTokenSave={handleTokenSave}
                showBackButton={false}
            />
            <main>
                <Hero onExplore={handleExplore} />

{/* Error block removed */ }

                <GithubSyncSection />
                <FAQ />

                <section aria-label="Call to Action">
                    <RepoCTA />
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Home;
