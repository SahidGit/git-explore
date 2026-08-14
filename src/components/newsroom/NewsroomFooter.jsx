import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Check, ArrowRight, ShieldAlert, FileText, Github, AlertCircle, ExternalLink, Heart } from 'lucide-react';

const NewsroomFooter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 4000);
  };

  return (
    <footer className="bg-[#101010] text-[#F8F3EA] border-t-4 border-[#FF5A1F] font-space pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Newsletter & Briefing Subscription Section (andhbhakt.org style) */}
        <div className="bg-[#F8F3EA] text-[#101010] p-8 md:p-12 border-2 border-black grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-[10px_10px_0px_#FF5A1F]">
          <div className="lg:col-span-7 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black text-[#FF5A1F] uppercase tracking-widest block">
                PUBLIC RESEARCH BRIEFING • WEEKLY DISPATCH
              </span>
              <span className="bg-black text-[#FF5A1F] font-mono text-[9px] font-bold uppercase px-2 py-0.5 border border-black">
                COMING SOON
              </span>
            </div>
            <h3 className="font-syne text-3xl sm:text-4xl font-extrabold text-[#101010] tracking-tight">
              Curated Intelligence Delivered to Your Inbox
            </h3>
            <p className="text-sm text-[#101010]/85 leading-relaxed font-space max-w-xl">
              Get weekly breakdowns of open-weights benchmarks, inference pricing shifts, arXiv reasoning papers, and regional lab developments with zero marketing fluff.
            </p>
          </div>

          <div className="lg:col-span-5 space-y-3">
            {subscribed ? (
              <div className="p-4 bg-emerald-500/20 border-2 border-emerald-700 font-mono text-xs text-emerald-900 font-bold flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-700" />
                <span>Early access reserved! You will receive the inaugural dispatch upon launch.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="researcher@domain.com"
                  required
                  className="flex-1 bg-white border-2 border-black px-4 py-3 text-xs font-mono text-black placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#FF5A1F] text-black font-mono text-xs font-black uppercase tracking-wider hover:bg-black hover:text-white transition-all cursor-pointer whitespace-nowrap border-2 border-black shadow-[2px_2px_0px_#000]"
                >
                  Subscribe
                </button>
              </form>
            )}
            <div className="space-y-1 pt-1">
              <div className="flex flex-wrap items-center justify-between text-[10px] font-mono text-[#101010]/70">
                <span>Weekly dispatch • Zero telemetry • Unsubscribe anytime</span>
                <Link to="/report" className="text-[#FF5A1F] hover:underline font-bold">
                  Report Issue →
                </Link>
              </div>
              <p className="text-[10px] font-mono text-[#101010]/60 italic">
                * Disclaimer: Newsletter dispatch feature is launching soon. Early subscribers get priority cohort access.
              </p>
            </div>
          </div>
        </div>

        {/* Public Accountability & Note on Good Faith (tracker.wbupdates.com style) */}
        <div className="p-6 bg-white/[0.03] border-2 border-white/15 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-mono text-xs font-bold text-[#FF5A1F] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              A Note on Good Faith, Sourcing &amp; Corrections
            </span>
            <Link
              to="/report"
              className="inline-flex items-center gap-1 bg-[#FF5A1F] text-black px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider hover:bg-white transition-colors"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Submit A Correction</span>
            </Link>
          </div>
          <p className="text-xs text-zinc-300 font-space leading-relaxed">
            This newsroom is maintained as an open, public intelligence ledger. Because AI model pricing, technical papers, and benchmark scores evolve rapidly, discrepancies can occur. If you spot an inaccurate specification, broken arXiv link, or outdated pricing, please click the <strong>Submit A Correction</strong> button above or submit a PR on GitHub.
          </p>
        </div>

        {/* Middle Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-6 border-t-2 border-white/10 font-mono text-xs">
          
          {/* Col 1: Brand & Description */}
          <div className="space-y-3 md:col-span-2">
            <span className="font-syne text-2xl font-black text-white block">
              AI NEWSROOM
            </span>
            <p className="text-xs text-zinc-400 leading-relaxed font-space max-w-md">
              An independent public intelligence ledger for engineers, researchers, and builders. Built as part of the GitExplorer ecosystem with strict zero-telemetry and local-first architecture.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2">
            <span className="font-bold text-white uppercase tracking-wider block border-b border-white/15 pb-1">
              Ledger Sections
            </span>
            <ul className="space-y-1.5 text-zinc-400">
              <li><a href="#hero" className="hover:text-[#FF5A1F]">01. Frontier Model Race</a></li>
              <li><a href="#models-section" className="hover:text-[#FF5A1F]">02. Model Specs &amp; Pricing</a></li>
              <li><a href="#open-source-section" className="hover:text-[#FF5A1F]">03. Open Weights Directory</a></li>
              <li><a href="#global-ai-section" className="hover:text-[#FF5A1F]">04. Global AI Atlas</a></li>
              <li><a href="#capital-section" className="hover:text-[#FF5A1F]">05. Megawatt Infrastructure</a></li>
              <li><a href="#research-section" className="hover:text-[#FF5A1F]">06. arXiv Pre-prints</a></li>
            </ul>
          </div>

          {/* Col 3: Primary Citations */}
          <div className="space-y-2">
            <span className="font-bold text-white uppercase tracking-wider block border-b border-white/15 pb-1">
              Primary Citations
            </span>
            <ul className="space-y-1.5 text-zinc-400">
              <li><a href="https://openrouter.ai" target="_blank" rel="noreferrer" className="hover:text-[#FF5A1F] inline-flex items-center gap-1">OpenRouter Models API ↗</a></li>
              <li><a href="https://arxiv.org/abs/2501.12948" target="_blank" rel="noreferrer" className="hover:text-[#FF5A1F] inline-flex items-center gap-1">DeepSeek-R1 Paper ↗</a></li>
              <li><a href="https://sakana.ai/evolutionary-model-merge/" target="_blank" rel="noreferrer" className="hover:text-[#FF5A1F] inline-flex items-center gap-1">Sakana AI EvoMerge ↗</a></li>
              <li><a href="https://www.sarvam.ai/" target="_blank" rel="noreferrer" className="hover:text-[#FF5A1F] inline-flex items-center gap-1">Sarvam AI Platform ↗</a></li>
              <li><Link to="/report" className="text-[#FF5A1F] font-bold inline-flex items-center gap-1">Fix a Mistake / Link ↗</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-zinc-500">
          <p>© {new Date().getFullYear()} AI Newsroom • Independent Public Intelligence Ledger</p>
          <div className="flex items-center gap-4">
            <Link to="/report" className="hover:text-[#FF5A1F] font-bold text-zinc-300">Report Issue</Link>
            <Link to="/about" className="hover:text-white underline">About</Link>
            <Link to="/disclaimer" className="hover:text-white underline">Disclaimer</Link>
            <Link to="/terms" className="hover:text-white underline">Terms of Use</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default NewsroomFooter;
