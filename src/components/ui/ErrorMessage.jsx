import React from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';

const GITHUB_NEW_TOKEN_URL = 'https://github.com/settings/tokens/new?description=ExploreGit&scopes=public_repo';

const ErrorMessage = ({ message, onRetry }) => {
    const isTokenIssue = message && (
        message.toLowerCase().includes('token') ||
        message.toLowerCase().includes('rate limit') ||
        message.toLowerCase().includes('401') ||
        message.toLowerCase().includes('403')
    );

    return (
        <div className="max-w-md mx-auto my-12 p-6 sm:p-8 text-center space-y-4 font-sans bg-[#121215] border border-white/10 rounded-2xl shadow-xl">
            <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-5 h-5" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white font-heading">
                {isTokenIssue ? 'GitHub API Quota / Token Issue' : 'Connection Interrupted'}
            </h3>

            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed">
                {message || 'Unable to establish connection with GitHub REST API endpoint. Verify network status or token quota.'}
            </p>

            {isTokenIssue && (
                <div className="pt-1">
                    <a
                        href={GITHUB_NEW_TOKEN_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs transition-colors shadow-sm"
                    >
                        <span>Generate New Token on GitHub</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </div>
            )}

            {onRetry && (
                <div className="pt-2">
                    <button
                        type="button"
                        onClick={onRetry}
                        className="inline-block rounded-xl bg-white text-zinc-950 px-5 py-2 font-medium transition-all hover:bg-zinc-200 cursor-pointer shadow-sm text-xs"
                    >
                        Retry Request
                    </button>
                </div>
            )}
        </div>
    );
};

export default ErrorMessage;
