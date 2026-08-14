import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ExternalLink, Menu, X, ArrowLeft, AlertCircle, ShieldCheck } from 'lucide-react';

const NewsroomNav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'Models & Pricing', target: 'models-section' },
    { label: 'Open Weights', target: 'open-source-section' },
    { label: 'Global Atlas', target: 'global-ai-section' },
    { label: 'Infrastructure', target: 'capital-section' },
    { label: 'arXiv Papers', target: 'research-section' },
    { label: 'Visual Archive', target: 'visual-section' },
  ];

  const handleScroll = (id) => {
    setMobileOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#101010] text-[#F8F3EA] border-b-2 border-black font-space">
      {/* Top Accountability & Ticker Bar */}
      <div className="bg-[#FF5A1F] text-black text-[11px] font-mono font-bold px-4 py-1 flex items-center justify-between border-b border-black overflow-hidden">
        <div className="flex items-center gap-3 animate-pulse whitespace-nowrap">
          <span className="bg-black text-[#FF5A1F] px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-mono">
            PUBLIC AI LEDGER
          </span>
          <span className="tracking-tight">
            DEEPSEEK R1 (ARXIV:2501.12948) • SAKANA AI EVOLUTIONARY MERGING • SARVAM 2B INDIC VERNACULAR MODEL • 100% SOURCED CITATIONS
          </span>
        </div>
        
        <Link
          to="/report"
          className="hidden md:inline-flex items-center gap-1.5 bg-black text-[#F8F3EA] hover:text-[#FF5A1F] px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider transition-colors ml-4 border border-black"
        >
          <AlertCircle className="w-3 h-3 text-[#FF5A1F]" />
          <span>Report Mistake / Fix Link</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Home Link */}
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 text-xs font-mono text-[#F8F3EA]/70 hover:text-white transition-colors mr-1"
            title="Return to GitExplorer Dashboard"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Explorer</span>
          </Link>

          <a href="#hero" className="flex items-center gap-2 group">
            <span className="font-syne text-2xl font-black tracking-tight text-[#F8F3EA] group-hover:text-[#FF5A1F] transition-colors">
              AI NEWSROOM
            </span>
            <span className="bg-white/10 text-white border border-white/20 font-mono text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider">
              BETA
            </span>
            <span className="bg-[#FF5A1F] text-black font-mono text-[10px] font-extrabold px-2 py-0.5 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
              LATEST
            </span>
          </a>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-mono tracking-wider uppercase">
          {navItems.map((item) => (
            <button
              key={item.target}
              onClick={() => handleScroll(item.target)}
              className="text-[#F8F3EA]/80 hover:text-[#FF5A1F] transition-colors cursor-pointer py-1 border-b-2 border-transparent hover:border-[#FF5A1F]"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            to="/report"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/40 border border-white/20 text-[#F8F3EA] hover:border-[#FF5A1F] hover:text-[#FF5A1F] font-mono text-xs transition-colors"
          >
            <AlertCircle className="w-3 h-3 text-[#FF5A1F]" />
            <span>Suggest Correction</span>
          </Link>

          <a
            href="https://openrouter.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#F8F3EA] text-black font-mono text-xs font-bold hover:bg-[#FF5A1F] transition-colors border border-black shadow-[2px_2px_0px_#FF5A1F]"
          >
            <span>OpenRouter</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-[#F8F3EA] hover:text-[#FF5A1F]"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#101010] border-b-2 border-black p-6 space-y-4 font-mono text-sm">
          {navItems.map((item) => (
            <button
              key={item.target}
              onClick={() => handleScroll(item.target)}
              className="block w-full text-left py-2 text-[#F8F3EA] hover:text-[#FF5A1F] border-b border-[#F8F3EA]/10"
            >
              {item.label}
            </button>
          ))}
          <Link
            to="/report"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center gap-2 py-2.5 bg-white/10 text-white font-mono text-xs uppercase tracking-wider border border-white/20"
          >
            <AlertCircle className="w-4 h-4 text-[#FF5A1F]" />
            <span>Report Mistake or Broken Link</span>
          </Link>
          <a
            href="https://openrouter.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center py-3 bg-[#FF5A1F] text-black font-bold uppercase tracking-wider"
          >
            OpenRouter Live Models ↗
          </a>
        </div>
      )}
    </header>
  );
};

export default NewsroomNav;
