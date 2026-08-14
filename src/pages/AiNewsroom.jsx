import React, { useEffect } from 'react';
import SEO from '../components/ui/SEO';
import NewsroomNav from '../components/newsroom/NewsroomNav';
import HeroEditorial from '../components/newsroom/HeroEditorial';
import LeadStoryGrid from '../components/newsroom/LeadStoryGrid';
import ModelIntelligenceTable from '../components/newsroom/ModelIntelligenceTable';
import OpenWeightStrip from '../components/newsroom/OpenWeightStrip';
import GlobalAiAtlas from '../components/newsroom/GlobalAiAtlas';
import CapitalInfrastructure from '../components/newsroom/CapitalInfrastructure';
import WorthReadingResearch from '../components/newsroom/WorthReadingResearch';
import VisualCultureGallery from '../components/newsroom/VisualCultureGallery';
import NewsroomFooter from '../components/newsroom/NewsroomFooter';
import BackToTop from '../components/ui/BackToTop';

const AiNewsroom = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F3EA] text-[#101010] selection:bg-[#FF5A1F] selection:text-black font-sans">
      <SEO
        title="AI Newsroom — Experimental Frontier AI Intelligence & Model Benchmarks"
        description="A high-end editorial magazine covering frontier AI models, open-source weight momentum, Sakana AI, Sarvam AI, Project Stargate, and arXiv research."
        canonical="https://git-explore-one.vercel.app/ai-news"
      />

      {/* 1. Sticky Navigation */}
      <NewsroomNav />

      {/* 2. Hero Editorial Story */}
      <HeroEditorial />

      {/* 3. Lead Story Grid */}
      <LeadStoryGrid />

      {/* 4. Model Intelligence Section (OpenRouter API + Fallback + Table + Visualizer) */}
      <ModelIntelligenceTable />

      {/* 5. Open Weight / Open Source Strip */}
      <OpenWeightStrip />

      {/* 6. Global AI Atlas */}
      <GlobalAiAtlas />

      {/* 7. Capital & Infrastructure Section */}
      <CapitalInfrastructure />

      {/* 8. Worth Reading Research Section */}
      <WorthReadingResearch />

      {/* 9. Visual Culture / Image Reference Gallery */}
      <VisualCultureGallery />

      {/* 10. Newsroom Footer */}
      <NewsroomFooter />

      {/* Floating Back to Top Button */}
      <BackToTop />
    </div>
  );
};

export default AiNewsroom;
