import React, { useState, useEffect } from 'react';
import { ExternalLink, Key, X, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TokenExpiryAlertIcon } from './Icons';

const GITHUB_NEW_TOKEN_URL = 'https://github.com/settings/tokens/new?description=ExploreGit&scopes=public_repo';

/**
 * Global Token Alert Banner
 * Automatically displays when GitHub API rate limits are exhausted or PAT token expires,
 * providing direct links to generate a new token and connect it instantly.
 */
const TokenAlertBanner = ({ onOpenTokenModal }) => {
  const { rateLimit, tokenError, isConnected, token } = useAuth();
  const [isDismissed, setIsDismissed] = useState(false);
  const [eventAlert, setEventAlert] = useState(null);

  // Listen for global API exhaustion events from githubService
  useEffect(() => {
    const handleExhaustedEvent = (e) => {
      setIsDismissed(false);
      setEventAlert(e.detail || { type: 'exhausted', message: 'API rate limit exhausted' });
    };

    window.addEventListener('github-token-exhausted', handleExhaustedEvent);
    return () => window.removeEventListener('github-token-exhausted', handleExhaustedEvent);
  }, []);

  const isRateLimitExhausted = rateLimit && rateLimit.remaining === 0;
  const isTokenExpired = tokenError && (
    tokenError.toLowerCase().includes('expired') ||
    tokenError.toLowerCase().includes('invalid') ||
    tokenError.toLowerCase().includes('401')
  );

  const shouldShow = (!isDismissed && (isRateLimitExhausted || isTokenExpired || eventAlert));

  if (!shouldShow) return null;

  const isExpired = isTokenExpired || eventAlert?.type === 'expired';
  const alertTitle = isExpired
    ? 'GitHub Personal Access Token Expired'
    : 'GitHub API Rate Limit Exhausted';

  const alertDescription = isExpired
    ? 'Your connected GitHub Personal Access Token has expired or was revoked. Generate a new token to restore high-velocity live API access.'
    : (isConnected
        ? 'Your hourly PAT quota has been exhausted. You can generate a fresh token or wait for the hourly reset.'
        : 'Anonymous rate limit reached (60 req/hr). Generate a free GitHub Personal Access Token to unlock 5,000 requests/hr.');

  return (
    <div
      role="alert"
      className="fixed bottom-5 right-5 left-5 sm:left-auto sm:max-w-lg z-50 bg-[#121215]/95 backdrop-blur-xl border border-rose-500/40 rounded-2xl p-4 sm:p-5 shadow-2xl shadow-rose-950/30 text-white font-sans animate-fadeIn"
    >
      <div className="flex items-start gap-3.5">
        <div className="shrink-0 mt-0.5">
          <TokenExpiryAlertIcon className="w-9 h-9 drop-shadow-md" size={36} />
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-white font-heading tracking-tight flex items-center gap-2">
              <span>{alertTitle}</span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
            </h4>
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-zinc-300 font-sans leading-relaxed">
            {alertDescription}
          </p>

          <div className="flex items-center gap-2.5 pt-1.5 flex-wrap">
            {/* Direct Link to Generate PAT */}
            <a
              href={GITHUB_NEW_TOKEN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
            >
              <span>Generate New PAT on GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Connect / Paste Token in Modal */}
            {onOpenTokenModal && (
              <button
                type="button"
                onClick={() => {
                  setIsDismissed(true);
                  onOpenTokenModal();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs border border-white/15 transition-colors cursor-pointer"
              >
                <Key className="w-3.5 h-3.5 text-zinc-300" />
                <span>Enter New Token</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenAlertBanner;
