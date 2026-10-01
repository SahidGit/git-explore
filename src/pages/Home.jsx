import React, { Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layouts/Header';
import Hero from '../components/layouts/Hero';
import SEO from '../components/ui/SEO';

// Lazy-load below-the-fold components
const DashboardPreview = lazy(() => import('../components/features/DashboardPreview'));
const FeatureGrid = lazy(() => import('../components/features/FeatureGrid'));
const FAQ = lazy(() => import('../components/ui/FAQ'));
const RepoCTA = lazy(() => import('../components/features/RepoCard/RepoCTA'));
const Footer = lazy(() => import('../components/layouts/Footer'));
const BackToTop = lazy(() => import('../components/ui/BackToTop'));

const Home = () => {
    const navigate = useNavigate();

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleExplore = () => {
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-[#0A0A0C] text-white font-sans selection:bg-white/20 selection:text-white flex flex-col">
            <SEO
                title="ExploreGit — Find open-source projects gaining momentum"
                description="ExploreGit surfaces trending repositories using star velocity, contributor activity, and repository health signals."
                canonical="https://exploregit.vercel.app/"
                schema={{
                    '@context': 'https://schema.org',
                    '@type': 'WebSite',
                    name: 'ExploreGit',
                    url: 'https://exploregit.vercel.app/',
                    potentialAction: {
                        '@type': 'SearchAction',
                        target: 'https://exploregit.vercel.app/dashboard?query={search_term_string}',
                        'query-input': 'required name=search_term_string',
                    },
                }}
            />

            <Header
                activeTab="home"
                showBackButton={false}
            />

            <main className="flex-1">
                <Hero onExplore={handleExplore} />
                <Suspense fallback={<div className="min-h-[400px]" />}>
                    <DashboardPreview />
                    <FeatureGrid />
                    <FAQ />
                    <RepoCTA />
                </Suspense>
            </main>

            <Suspense fallback={null}>
                <BackToTop />
                <Footer />
            </Suspense>
        </div>
    );
};

export default Home;
