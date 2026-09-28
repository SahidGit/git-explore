import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Loader2, CheckCircle2, Lock, Info, RefreshCw } from 'lucide-react';

/**
 * Cloudflare Turnstile CAPTCHA & Bot Verification Component
 * 
 * Provides client-side privacy-first bot mitigation with zero cookies,
 * zero login requirements, and full local-first fallback.
 * 
 * Public Cloudflare test sitekey: 1x00000000000000000000AA (always passes for dev/test)
 */
const CloudflareTurnstile = ({ onVerify, onError, onExpire, siteKey }) => {
    const containerRef = useRef(null);
    const widgetIdRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isVerified, setIsVerified] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [tokenGenerated, setTokenGenerated] = useState('');

    const activeSiteKey =
        siteKey ||
        import.meta.env.VITE_CLOUDFLARE_TURNSTILE_SITE_KEY ||
        '1x00000000000000000000AA';

    const handleVerificationSuccess = (token) => {
        setIsVerified(true);
        setIsLoading(false);
        setHasError(false);
        setTokenGenerated(token);
        if (onVerify) onVerify(token);
    };

    const renderWidget = () => {
        if (!containerRef.current || !window.turnstile) return;

        try {
            if (widgetIdRef.current) {
                try {
                    window.turnstile.remove(widgetIdRef.current);
                } catch (_) {}
            }

            widgetIdRef.current = window.turnstile.render(containerRef.current, {
                sitekey: activeSiteKey,
                theme: 'dark',
                size: 'flexible',
                callback: (token) => {
                    handleVerificationSuccess(token);
                },
                'error-callback': (errorCode) => {
                    console.warn('Cloudflare Turnstile challenge error:', errorCode);
                    setIsLoading(false);
                    setHasError(true);
                    setIsVerified(false);
                    setTokenGenerated('');
                    if (onError) onError(errorCode);
                },
                'expired-callback': () => {
                    setIsVerified(false);
                    setTokenGenerated('');
                    if (onExpire) onExpire();
                },
            });
        } catch (err) {
            console.warn('Cloudflare Turnstile render exception:', err);
            setIsLoading(false);
            setHasError(true);
        }
    };

    const handleRetry = () => {
        setHasError(false);
        setIsLoading(true);
        renderWidget();
    };

    useEffect(() => {
        let isMounted = true;

        const loadScript = () => {
            if (window.turnstile) {
                renderWidget();
                return;
            }

            const existingScript = document.getElementById('cf-turnstile-script');
            if (!existingScript) {
                const script = document.createElement('script');
                script.id = 'cf-turnstile-script';
                script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
                script.async = true;
                script.defer = true;
                script.onload = () => {
                    if (isMounted) renderWidget();
                };
                script.onerror = () => {
                    console.warn('Cloudflare Turnstile script failed to load.');
                    if (isMounted) {
                        setIsLoading(false);
                        setHasError(true);
                    }
                };
                document.head.appendChild(script);
            } else {
                if (window.turnstile) {
                    renderWidget();
                } else {
                    existingScript.addEventListener('load', () => {
                        if (isMounted) renderWidget();
                    });
                }
            }
        };

        loadScript();

        return () => {
            isMounted = false;
            if (widgetIdRef.current && window.turnstile) {
                try {
                    window.turnstile.remove(widgetIdRef.current);
                } catch (_) {}
            }
        };
    }, [activeSiteKey]);

    return (
        <div className="rounded-xl border border-white/[0.12] bg-[#0E0E12] p-4 space-y-3 shadow-lg">
            {/* Header row */}
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-mono font-bold text-zinc-200">
                        Cloudflare Bot Verification
                    </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/10 uppercase tracking-wider">
                    No Account Required
                </span>
            </div>

            {/* Turnstile Container / Verified State */}
            <div className="min-h-[55px] flex flex-col items-center justify-center py-1">
                {isLoading && !isVerified && (
                    <div className="flex items-center gap-2.5 text-xs font-mono text-zinc-400 py-2">
                        <Loader2 className="w-4 h-4 text-zinc-400 animate-spin" />
                        <span>Initializing Cloudflare Challenge…</span>
                    </div>
                )}

                {/* Cloudflare turnstile mount point */}
                <div
                    ref={containerRef}
                    className={`w-full flex justify-center ${isVerified ? 'hidden' : 'block'}`}
                />

                {/* Retry button if challenge errored */}
                {hasError && !isVerified && !isLoading && (
                    <button
                        type="button"
                        onClick={handleRetry}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-mono text-zinc-200 transition-colors cursor-pointer"
                    >
                        <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Retry Verification Challenge</span>
                    </button>
                )}

                {/* Verified state banner */}
                {isVerified && (
                    <div className="w-full flex items-center justify-between p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 font-mono text-xs">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span className="font-bold">Bot challenge verified. Human session confirmed.</span>
                        </div>
                        <span className="text-[9px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-300">
                            SECURE
                        </span>
                    </div>
                )}
            </div>

            {/* Privacy Notice */}
            <div className="pt-2 border-t border-white/[0.06] flex items-start gap-2 text-[11px] font-sans text-zinc-400 leading-relaxed">
                <Info className="w-3.5 h-3.5 text-zinc-500 mt-0.5 flex-shrink-0" />
                <p>
                    <strong className="text-zinc-300 font-mono text-[10px] uppercase">Privacy Notice:</strong> Cloudflare Turnstile bot verification runs client-side to prevent automated spam without requiring cookies, user accounts, or login credentials.
                </p>
            </div>
        </div>
    );
};

export default CloudflareTurnstile;
