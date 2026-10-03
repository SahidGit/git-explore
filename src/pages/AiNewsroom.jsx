import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Radio } from "lucide-react";
import SEO from "../components/ui/SEO";

const AiNewsroom = () => {
  useEffect(() => {
    try {
      window.scrollTo(0, 0);
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="flex min-h-dvh min-h-screen items-center justify-center bg-[#101012] text-white font-libron selection:bg-white/20 selection:text-white px-4">
      <SEO
        title="AI Newsroom · Coming Soon · ExploreGit"
        description="Our automated AI developer newsroom and daily ecosystem tracker are currently under construction."
        canonical="https://exploregit.vercel.app/ai-news"
      />
      <div className="w-full max-w-lg mx-auto text-center space-y-5 font-libron">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-zinc-400 font-libron text-xs uppercase tracking-widest">
          <Radio className="w-3.5 h-3.5 text-[#C19EDB] animate-pulse" />
          <span>Under Construction</span>
        </div>

        <h1 className="font-libron text-5xl sm:text-6xl font-bold text-white tracking-tight">
          AI / NEWS
        </h1>

        <h2 className="text-xl sm:text-2xl font-semibold text-zinc-200 font-libron">
          Coming Soon
        </h2>

        <p className="max-w-md text-zinc-400 text-sm sm:text-base leading-relaxed mx-auto font-libron">
          We are rebuilding the AI Newsroom into a lightweight, automated daily
          developer digest covering open-source model releases, agentic tools,
          and ecosystem breakthroughs.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 font-libron">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-[#121215] transition-all hover:bg-neutral-100 shadow-sm active:scale-95 cursor-pointer font-libron"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-white/[0.06] border border-white/10 px-6 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:bg-white/10 hover:text-white active:scale-95 cursor-pointer font-libron"
          >
            <span>Explore Repositories</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AiNewsroom;
