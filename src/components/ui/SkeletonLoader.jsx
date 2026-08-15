import React from 'react';

// ─── Base pulse atom ──────────────────────────────────
const Pulse = ({ className = '' }) => (
  <div className={`animate-pulse rounded bg-white/[0.06] ${className}`} />
);

// ─── Repository Card Skeleton ─────────────────────────
/** Matches the exact layout of RepoCard.jsx to prevent CLS */
export const SkeletonRepoCard = () => (
  <div className="flex flex-col bg-white/[0.03] border border-white/[0.05] rounded-xl p-5 h-44" aria-hidden="true">
    <div className="flex items-center gap-2.5 mb-3">
      <Pulse className="w-7 h-7 rounded-md flex-shrink-0" />
      <div className="space-y-1.5 flex-1 min-w-0">
        <Pulse className="h-2 w-16 rounded-full" />
        <Pulse className="h-3 w-28 rounded-full" />
      </div>
    </div>
    <div className="space-y-2 flex-1 mb-4">
      <Pulse className="h-2.5 w-full rounded-full" />
      <Pulse className="h-2.5 w-4/5 rounded-full" />
    </div>
    <div className="flex items-center gap-3 pt-3 border-t border-white/[0.05]">
      <Pulse className="h-2 w-14 rounded-full" />
      <Pulse className="h-2 w-10 rounded-full" />
      <Pulse className="h-2 w-10 rounded-full" />
      <Pulse className="h-2 w-12 rounded-full ml-auto" />
    </div>
  </div>
);

// ─── Top-Five Featured Skeleton ───────────────────────
/** Matches the horizontal scrolling featured strip in TopFiveFeatured.jsx */
export const SkeletonTopFive = () => (
  <div className="mb-8" aria-hidden="true">
    <div className="flex items-center justify-between mb-4">
      <Pulse className="h-4 w-48 rounded-full" />
      <Pulse className="h-3 w-24 rounded-full" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3"
        >
          <div className="flex items-center gap-2">
            <Pulse className="w-6 h-6 rounded-md flex-shrink-0" />
            <Pulse className="h-2.5 flex-1 rounded-full" />
          </div>
          <Pulse className="h-2 w-full rounded-full" />
          <Pulse className="h-2 w-3/4 rounded-full" />
          <div className="flex gap-2 pt-1">
            <Pulse className="h-2 w-12 rounded-full" />
            <Pulse className="h-2 w-10 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Profile / User Card Skeleton ─────────────────────
/** Matches the profile header card layout */
export const SkeletonProfile = () => (
  <div
    className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 mb-6"
    aria-hidden="true"
  >
    <Pulse className="w-24 h-24 rounded-full flex-shrink-0" />
    <div className="flex-1 w-full space-y-3">
      <Pulse className="h-6 w-48 rounded-full" />
      <Pulse className="h-4 w-32 rounded-full" />
      <div className="flex flex-wrap gap-4">
        <Pulse className="h-3 w-24 rounded-full" />
        <Pulse className="h-3 w-24 rounded-full" />
        <Pulse className="h-3 w-24 rounded-full" />
      </div>
      <Pulse className="h-16 w-full max-w-2xl rounded-xl" />
    </div>
  </div>
);

// ─── Contribution Heatmap Skeleton ────────────────────
/** Matches the 53-week × 7-day heatmap grid */
export const SkeletonHeatmap = () => (
  <div className="p-6 bg-white/[0.02] rounded-xl border border-white/[0.06]" aria-hidden="true">
    <Pulse className="h-5 w-48 rounded-full mb-6" />
    <div className="flex gap-1 overflow-hidden">
      {[...Array(53)].map((_, i) => (
        <div key={i} className="flex flex-col gap-1">
          {[...Array(7)].map((_, j) => (
            <Pulse key={j} className="w-[10px] h-[10px] !rounded-[2px]" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

// ─── Rate Limit Card Skeleton ─────────────────────────
/** Matches the RateLimitMeter card in ProfileView.jsx */
export const SkeletonRateLimit = () => (
  <div
    className="rounded-xl border border-white/[0.06] bg-[#121215] p-5 space-y-4"
    aria-hidden="true"
  >
    <div className="flex items-center justify-between">
      <Pulse className="h-2 w-24 rounded-full" />
      <Pulse className="h-2 w-20 rounded-full" />
    </div>
    <Pulse className="h-1.5 w-full rounded-full" />
    <div className="flex items-baseline justify-between">
      <Pulse className="h-4 w-28 rounded-full" />
      <Pulse className="h-2 w-32 rounded-full" />
    </div>
  </div>
);

export default SkeletonRepoCard;
