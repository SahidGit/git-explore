import React from 'react';
import { WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';

const ErrorMessage = ({ message, onRetry }) => {
    return (
        <div className="max-w-md mx-auto my-12 p-6 sm:p-8 rounded-2xl border border-white/[0.08] bg-[#0d0f12]/95 backdrop-blur-md shadow-2xl text-center space-y-5 font-sans relative overflow-hidden">
            {/* Soft Ambient Radial Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-rose-500/[0.05] rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-md">
                    <WifiOff className="w-6 h-6" />
                </div>

                <div className="space-y-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                        NETWORK_DISCONNECTED
                    </span>
                    <h3 className="text-xl font-bold font-space text-white tracking-tight">
                        Connection Interrupted
                    </h3>
                    <p className="text-xs text-slate-400 font-mono leading-relaxed max-w-sm">
                        {message || 'Unable to establish connection with GitHub REST API endpoint. Verify network status or token quota.'}
                    </p>
                </div>

                {onRetry && (
                    <button
                        type="button"
                        onClick={onRetry}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-black font-mono text-xs font-extrabold hover:bg-zinc-200 active:scale-[0.98] transition-all duration-200 shadow-sm cursor-pointer mt-2"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Retry Connection</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default ErrorMessage;


