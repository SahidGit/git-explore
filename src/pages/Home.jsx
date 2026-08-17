import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layouts/Header';
import Hero from '../components/layouts/Hero';
import DashboardPreview from '../components/features/DashboardPreview';
import FeatureGrid from '../components/features/FeatureGrid';
import FAQ from '../components/ui/FAQ';
import Footer from '../components/layouts/Footer';
import BackToTop from '../components/ui/BackToTop';
import RepoCTA from '../components/features/RepoCard/RepoCTA';
import SEO from '../components/ui/SEO';
import { storageService } from '../services/storageService';

const Home = () => {
    const navigate = useNavigate();

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
        <div className="min-h-screen bg-[#0A0A0C] text-white font-sans selection:bg-white/20 selection:text-white flex flex-col">
            <SEO
                title="GitExplorer — Find open-source projects gaining momentum"
                description="GitExplorer surfaces trending repositories using star velocity, contributor activity, and repository health signals."
                canonical="https://git-explore-one.vercel.app/"
                schema={{
                    '@context': 'https://schema.org',
                    '@type': 'WebSite',
                    name: 'GitExplorer',
                    url: 'https://git-explore-one.vercel.app/',
                    potentialAction: {
                        '@type': 'SearchAction',
                        target: 'https://git-explore-one.vercel.app/dashboard?query={search_term_string}',
                        'query-input': 'required name=search_term_string',
                    },
                }}
            />

            <Header
                activeTab="home"
                onTokenSave={handleTokenSave}
                showBackButton={false}
            />

            <main className="flex-1">
                <Hero onExplore={handleExplore} />
                <DashboardPreview />
                <FeatureGrid />
                <FAQ />
                <RepoCTA />
            </main>

            <BackToTop />
            <Footer />
        </div>
    );
};

export default Home;

