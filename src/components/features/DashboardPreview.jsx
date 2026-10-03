import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  Star,
  ShieldCheck,
  Database,
  ArrowRight,
  TrendingUp,
  GitBranch,
  Cpu,
  CheckCircle2,
  Bookmark,
  Users,
  GitCommit,
  GitPullRequest,
  Zap,
  Clock,
  Shield,
  Terminal,
  Layers,
  Sparkles,
  Check,
} from "lucide-react";
import { formatNumber } from "../../utils/formatters";

const REPO_PRESETS = [
  {
    id: "deepseek-ai/DeepSeek-V3",
    fullName: "deepseek-ai/DeepSeek-V3",
    shortName: "DeepSeek-V3",
    desc: "Official repository for DeepSeek-V3 open source model and architecture specs",
    lang: "Python",
    langColor: "#3572A5",
    stars: 62400,
    weeklyVelocity: "+14.2k / wk",
    peakGain: "3,200",
    rank: "#1 in AI Models",
    healthScore: 98,
    authors: 482,
    openIssues: "294 (84% closed)",
    chartData: [
      { day: "Day 1", date: "Aug 11", stars: 48200, gain: 1250 },
      { day: "Day 2", date: "Aug 12", stars: 49850, gain: 1650 },
      { day: "Day 3", date: "Aug 13", stars: 51900, gain: 2050 },
      { day: "Day 4", date: "Aug 14", stars: 53600, gain: 1700 },
      { day: "Day 5", date: "Aug 15", stars: 56100, gain: 2500 },
      { day: "Day 6", date: "Aug 16", stars: 59300, gain: 3200 },
      { day: "Day 7", date: "Aug 17", stars: 62400, gain: 3100 },
    ],
    strokePoints:
      "0,37 16.666666666666668,9.760058318121157 33.333333333333336,16.766109490810067 50,16.131076526320406 66.66666666666667,18.160652689901084 83.33333333333334,16.680480024517518 100,28.602259223158374 116.66666666666667,31.615460914714518 133.33333333333334,31.87831592119042 150,14.872511449668192 166.66666666666669,8.05222498383408 183.33333333333334,3 200,7.331259899043271",
    fillPoints:
      "0,40 0,37 16.666666666666668,9.760058318121157 33.333333333333336,16.766109490810067 50,16.131076526320406 66.66666666666667,18.160652689901084 83.33333333333334,16.680480024517518 100,28.602259223158374 116.66666666666667,31.615460914714518 133.33333333333334,31.87831592119042 150,14.872511449668192 166.66666666666669,8.05222498383408 183.33333333333334,3 200,7.331259899043271 200,40",
    strokeColor: "#3b82f6",
    weeklyCommits: [
      { day: "Mon", count: 18, height: "45%" },
      { day: "Tue", count: 34, height: "80%" },
      { day: "Wed", count: 42, height: "100%" },
      { day: "Thu", count: 29, height: "70%" },
      { day: "Fri", count: 38, height: "90%" },
      { day: "Sat", count: 14, height: "35%" },
      { day: "Sun", count: 9, height: "22%" },
    ],
  },
  {
    id: "shadcn-ui/ui",
    fullName: "shadcn-ui/ui",
    shortName: "shadcn/ui",
    desc: "Beautifully designed components that you can copy and paste into your apps",
    lang: "TypeScript",
    langColor: "#3178C6",
    stars: 74800,
    weeklyVelocity: "+4.8k / wk",
    peakGain: "1,100",
    rank: "#1 in UI Components",
    healthScore: 99,
    authors: 320,
    openIssues: "112 (92% closed)",
    chartData: [
      { day: "Day 1", date: "Aug 11", stars: 70000, gain: 650 },
      { day: "Day 2", date: "Aug 12", stars: 70700, gain: 700 },
      { day: "Day 3", date: "Aug 13", stars: 71500, gain: 800 },
      { day: "Day 4", date: "Aug 14", stars: 72300, gain: 800 },
      { day: "Day 5", date: "Aug 15", stars: 73200, gain: 900 },
      { day: "Day 6", date: "Aug 16", stars: 74100, gain: 900 },
      { day: "Day 7", date: "Aug 17", stars: 74800, gain: 700 },
    ],
    strokePoints:
      "0,34 16.666666666666668,31 33.333333333333336,27 50,23 66.66666666666667,20 83.33333333333334,18 100,15 116.66666666666667,13 133.33333333333334,10 150,8 166.66666666666669,6 183.33333333333334,4 200,3",
    fillPoints:
      "0,40 0,34 16.666666666666668,31 33.333333333333336,27 50,23 66.66666666666667,20 83.33333333333334,18 100,15 116.66666666666667,13 133.33333333333334,10 150,8 166.66666666666669,6 183.33333333333334,4 200,3 200,40",
    strokeColor: "#3b82f6",
    weeklyCommits: [
      { day: "Mon", count: 12, height: "38%" },
      { day: "Tue", count: 22, height: "70%" },
      { day: "Wed", count: 31, height: "100%" },
      { day: "Thu", count: 26, height: "84%" },
      { day: "Fri", count: 19, height: "61%" },
      { day: "Sat", count: 8, height: "26%" },
      { day: "Sun", count: 15, height: "48%" },
    ],
  },
  {
    id: "astral-sh/uv",
    fullName: "astral-sh/uv",
    shortName: "astral-sh/uv",
    desc: "An extremely fast Python package and project manager written in Rust",
    lang: "Rust",
    langColor: "#DEA584",
    stars: 45200,
    weeklyVelocity: "+5.1k / wk",
    peakGain: "1,400",
    rank: "#1 in Tooling",
    healthScore: 97,
    authors: 215,
    openIssues: "180 (88% closed)",
    chartData: [
      { day: "Day 1", date: "Aug 11", stars: 40100, gain: 700 },
      { day: "Day 2", date: "Aug 12", stars: 40900, gain: 800 },
      { day: "Day 3", date: "Aug 13", stars: 41800, gain: 900 },
      { day: "Day 4", date: "Aug 14", stars: 42800, gain: 1000 },
      { day: "Day 5", date: "Aug 15", stars: 43800, gain: 1000 },
      { day: "Day 6", date: "Aug 16", stars: 44600, gain: 800 },
      { day: "Day 7", date: "Aug 17", stars: 45200, gain: 600 },
    ],
    strokePoints:
      "0,36 16.666666666666668,32 33.333333333333336,28 50,22 66.66666666666667,18 83.33333333333334,19 100,15 116.66666666666667,12 133.33333333333334,14 150,9 166.66666666666669,6 183.33333333333334,4 200,3",
    fillPoints:
      "0,40 0,36 16.666666666666668,32 33.333333333333336,28 50,22 66.66666666666667,18 83.33333333333334,19 100,15 116.66666666666667,12 133.33333333333334,14 150,9 166.66666666666669,6 183.33333333333334,4 200,3 200,40",
    strokeColor: "#3b82f6",
    weeklyCommits: [
      { day: "Mon", count: 25, height: "55%" },
      { day: "Tue", count: 38, height: "84%" },
      { day: "Wed", count: 45, height: "100%" },
      { day: "Thu", count: 32, height: "71%" },
      { day: "Fri", count: 28, height: "62%" },
      { day: "Sat", count: 16, height: "35%" },
      { day: "Sun", count: 12, height: "26%" },
    ],
  },
];

const DashboardPreview = () => {
  const [selectedRepoIdx, setSelectedRepoIdx] = useState(0);
  const [activeTab, setActiveTab] = useState("signal");
  const [hoveredIdx, setHoveredIdx] = useState(6);

  const activeRepo = REPO_PRESETS[selectedRepoIdx] || REPO_PRESETS[0];
  const activePt = activeRepo.chartData[hoveredIdx] || activeRepo.chartData[6];

  return (
    <section
      className="relative border-b border-white/10 bg-[#0A0A0C] py-20 sm:py-28 overflow-hidden select-none"
      aria-label="Interactive Product Preview"
    >
      {/* Background subtle radial gradient */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/[0.02] blur-[120px] pointer-events-none rounded-full" />

      <div className="relative mx-auto w-full max-w-[1280px] px-4 sm:px-6">
        {/* Modern SaaS Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-[11px] font-mono font-medium text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span>REPOSITORY INTELLIGENCE PLATFORM</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-heading leading-[1.15]">
            See the people, activity, and health behind any repository.
          </h2>

          <p className="text-sm sm:text-base font-sans text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Inspect star trajectories, maintainer cadence, and repository health
            metrics directly from GitHub's live graph.
          </p>
        </div>

        {/* Modern SaaS Platform Frame */}
        <div className="max-w-5xl mx-auto rounded-2xl border border-white/10 bg-[#0E0F12] shadow-2xl overflow-hidden ring-1 ring-white/5">
          {/* Top Window Navigation Bar / Chrome */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-white/10 bg-[#121318] px-4 py-3 gap-3">
            {/* Left: Window controls & Selected Repo Switcher */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EC6A5E] opacity-90" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#F5BF4F] opacity-90" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-600 opacity-90" />
              </div>

              <div className="h-4 w-px bg-white/15 mx-1 hidden sm:block" />

              {/* Preset Switcher Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
                {REPO_PRESETS.map((repo, idx) => (
                  <button
                    key={repo.id}
                    type="button"
                    onClick={() => {
                      setSelectedRepoIdx(idx);
                      setHoveredIdx(6);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-sans font-medium transition-all cursor-pointer whitespace-nowrap border-0 ${
                      selectedRepoIdx === idx
                        ? "bg-white/15 text-white"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: repo.langColor }}
                    />
                    <span>{repo.shortName}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Segmented Control Tabs */}
            <div className="flex items-center bg-[#0A0A0D] border border-white/10 p-1 rounded-xl gap-1 self-start sm:self-auto overflow-x-auto no-scrollbar w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab("signal")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-all cursor-pointer whitespace-nowrap border-0 ${
                  activeTab === "signal"
                    ? "bg-white/15 text-white shadow-none"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                <span>Momentum</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("cadence")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-all cursor-pointer whitespace-nowrap border-0 ${
                  activeTab === "cadence"
                    ? "bg-white/15 text-white shadow-none"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Users className="w-3.5 h-3.5 text-zinc-300" />
                <span>Cadence</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("inspector")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-all cursor-pointer whitespace-nowrap border-0 ${
                  activeTab === "inspector"
                    ? "bg-white/15 text-white shadow-none"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Health</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("workflow")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-all cursor-pointer whitespace-nowrap border-0 ${
                  activeTab === "workflow"
                    ? "bg-white/15 text-white shadow-none"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Database className="w-3.5 h-3.5 text-purple-400" />
                <span>Sync</span>
              </button>
            </div>
          </div>

          {/* Main Platform Canvas */}
          <div className="p-5 sm:p-7 bg-[#0A0A0D] min-h-[420px]">
            {/* TAB 1: Momentum Signal */}
            {activeTab === "signal" && (
              <div className="space-y-6">
                {/* Top KPI Metric Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="p-4 rounded-xl bg-[#121318] border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                      <span>STAR VELOCITY</span>
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold font-mono text-white tracking-tight">
                      {activeRepo.weeklyVelocity}
                    </div>
                    <div className="text-[11px] font-sans text-blue-400 font-medium">
                      {activeRepo.rank}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#121318] border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                      <span>PEAK INTAKE</span>
                      <Zap className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-2xl font-bold font-mono text-white tracking-tight">
                      +{activeRepo.peakGain} / day
                    </div>
                    <div className="text-[11px] font-sans text-zinc-400">
                      Highest acceleration interval
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#121318] border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                      <span>TOTAL REPO STARS</span>
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    </div>
                    <div className="text-2xl font-bold font-mono text-white tracking-tight">
                      {formatNumber(activeRepo.stars)}
                    </div>
                    <div className="text-[11px] font-sans text-zinc-400 flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: activeRepo.langColor }}
                      />
                      <span>Primary language: {activeRepo.lang}</span>
                    </div>
                  </div>
                </div>

                {/* Minimal SVG Polyline Line Chart */}
                <div className="rounded-2xl border border-white/10 bg-[#0F1015]/95 backdrop-blur-xl p-4 sm:p-6 space-y-4 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                        <Activity className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <div className="text-sm font-mono font-bold text-white tracking-tight">
                          Live Star Trajectory
                        </div>
                        <div className="text-[11px] font-sans text-zinc-400 mt-0.5">
                          7-Day cumulative star growth
                        </div>
                      </div>
                    </div>
                    <div className="font-mono text-xs text-zinc-400">
                      Weekly Net:{" "}
                      <strong className="text-blue-400">
                        {activeRepo.weeklyVelocity}
                      </strong>
                    </div>
                  </div>

                  {/* Chart Canvas */}
                  <div className="relative w-full h-48 sm:h-64 bg-[#0A0A0C] border border-white/[0.08] rounded-xl p-3 sm:p-4 overflow-hidden shadow-inner flex flex-col justify-center">
                    {/* Background subtle grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
                      <div className="border-b border-dashed border-white/20 w-full" />
                      <div className="border-b border-dashed border-white/20 w-full" />
                      <div className="border-b border-white/20 w-full" />
                    </div>

                    <div className="relative z-10 w-full h-full flex items-center">
                      <svg
                        viewBox="0 0 200 40"
                        className="w-full h-full"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        <polyline
                          fill="none"
                          stroke={activeRepo.strokeColor || "#3b82f6"}
                          strokeWidth="2"
                          points={activeRepo.strokePoints}
                          strokeLinejoin="round"
                          strokeLinecap="round"
                        />
                        <polyline
                          fill={activeRepo.strokeColor || "#3b82f6"}
                          fillOpacity="0.1"
                          stroke="none"
                          points={activeRepo.fillPoints}
                        />
                      </svg>
                    </div>
                  </div>

                  {/* X-axis labels */}
                  <div className="flex items-center justify-between font-mono text-xs pt-1 px-4 gap-1.5">
                    {activeRepo.chartData.map((pt) => (
                      <div
                        key={pt.day}
                        className="flex flex-col items-center gap-0.5 text-zinc-500"
                      >
                        <span className="text-[11px]">{pt.day}</span>
                        <span className="text-[9px] text-blue-400/80">
                          +{pt.gain}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {/* TAB 2: Maintainer Cadence */}
            {activeTab === "cadence" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="p-4 rounded-xl bg-[#121318] border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                      <span>ACTIVE AUTHORS</span>
                      <Users className="w-4 h-4 text-zinc-300" />
                    </div>
                    <div className="text-2xl font-bold font-mono text-white tracking-tight">
                      {activeRepo.authors} contributors
                    </div>
                    <div className="text-[11px] font-sans text-zinc-400">
                      High commit distribution
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#121318] border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                      <span>COMMIT RHYTHM</span>
                      <GitCommit className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold font-mono text-white tracking-tight">
                      Daily push
                    </div>
                    <div className="text-[11px] font-sans text-zinc-400">
                      1.8h avg PR review time
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#121318] border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                      <span>DECENTRALIZATION</span>
                      <GitBranch className="w-4 h-4 text-zinc-300" />
                    </div>
                    <div className="text-2xl font-bold font-mono text-white tracking-tight">
                      High Resiliency
                    </div>
                    <div className="text-[11px] font-sans text-zinc-400">
                      Top author &lt; 16% commits
                    </div>
                  </div>
                </div>

                {/* Weekly commit histogram */}
                <div className="p-5 rounded-xl bg-[#101115] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-zinc-300" />
                      <span className="text-xs sm:text-sm font-mono font-bold text-white">
                        Weekly Commit Activity by Day
                      </span>
                    </div>
                    <span className="text-xs font-mono text-zinc-400">
                      170 commits this week
                    </span>
                  </div>

                  <div className="h-40 flex items-end justify-between gap-2 pt-6 px-2">
                    {activeRepo.weeklyCommits.map((item) => (
                      <div
                        key={item.day}
                        className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
                      >
                        <div className="text-[10px] font-mono text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.count}
                        </div>
                        <div
                          className="w-full max-w-[48px] rounded-t-lg bg-blue-500/35 group-hover:bg-blue-500/70 border-t border-x border-blue-400/50 transition-all duration-150"
                          style={{ height: item.height }}
                        />
                        <span className="text-xs font-mono text-zinc-400 group-hover:text-white transition-colors">
                          {item.day}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Health Inspector */}
            {activeTab === "inspector" && (
              <div className="space-y-6">
                <div className="p-5 rounded-xl bg-[#121318] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold font-mono text-white">
                        {activeRepo.fullName}
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        VERIFIED
                      </span>
                    </div>
                    <p className="text-xs font-sans text-zinc-400">
                      {activeRepo.desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="text-sm font-bold font-mono text-white">
                        HEALTH SCORE: {activeRepo.healthScore}/100
                      </div>
                      <div className="text-[10px] font-mono text-blue-400">
                        Enterprise Ready
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div className="p-4 rounded-xl bg-[#101115] border border-white/10 space-y-1">
                    <span className="text-zinc-500 text-[11px] font-mono block">
                      LICENSE
                    </span>
                    <span className="text-white font-bold font-mono text-xs">
                      MIT Verified
                    </span>
                    <p className="text-[10px] text-zinc-400">Commercial Safe</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#101115] border border-white/10 space-y-1">
                    <span className="text-zinc-500 text-[11px] font-mono block">
                      ISSUE RESOLUTION
                    </span>
                    <span className="text-white font-bold font-mono text-xs">
                      {activeRepo.openIssues}
                    </span>
                    <p className="text-[10px] text-zinc-400">
                      Avg close: 2.1 days
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#101115] border border-white/10 space-y-1">
                    <span className="text-zinc-500 text-[11px] font-mono block">
                      SECURITY AUDIT
                    </span>
                    <span className="text-white font-bold font-mono text-xs">
                      0 Vulnerabilities
                    </span>
                    <p className="text-[10px] text-zinc-400">
                      Dependabot active
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#101115] border border-white/10 space-y-1">
                    <span className="text-zinc-500 text-[11px] font-mono block">
                      CI/CD PASS RATE
                    </span>
                    <span className="text-white font-bold font-mono text-xs">
                      99.8% Passing
                    </span>
                    <p className="text-[10px] text-zinc-400">
                      Automated builds
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Workflow & Local Sync */}
            {activeTab === "workflow" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-[#121318] border border-white/10 space-y-3">
                    <div className="flex items-center gap-2 text-white font-bold font-mono text-xs">
                      <Bookmark className="w-4 h-4" />
                      <span>Local Bookmarks &amp; Notes</span>
                    </div>
                    <p className="text-zinc-300 text-xs leading-relaxed font-sans">
                      Save repositories directly to IndexedDB. Attach custom
                      developer notes and organize your tech stack research
                      without third-party accounts.
                    </p>
                    <div className="pt-2">
                      <span className="inline-block px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-purple-300 text-xs font-mono font-bold">
                        100% Client-Side Storage
                      </span>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-[#121318] border border-white/10 space-y-3">
                    <div className="flex items-center gap-2 text-purple-400 font-bold font-mono text-xs">
                      <Database className="w-4 h-4" />
                      <span>1-Click Data Export</span>
                    </div>
                    <p className="text-zinc-300 text-xs leading-relaxed font-sans">
                      Export all saved repositories, star velocity metrics, and
                      custom notes to JSON or CSV formats instantly for local
                      processing.
                    </p>
                    <div className="pt-2">
                      <span className="inline-block px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-purple-300 text-xs font-mono font-bold">
                        JSON &amp; CSV Ready
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Status & Launch Bar */}
            <div className="mt-7 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
              <div className="flex items-center gap-2 text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span>
                  GraphQL v4 Live Engine &bull; Latency 14ms &bull; Zero
                  trackers
                </span>
              </div>

              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-mono font-bold text-xs hover:bg-zinc-200 active:scale-[0.98] transition-all shadow-none cursor-pointer w-full sm:w-auto"
              >
                <span>Launch Workspace</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
