import React, { Component } from 'react';
import {
    AlertTriangle,
    RefreshCw,
    Home,
    ChevronDown,
    ChevronUp,
    Copy,
    Check,
    Bug,
    ShieldAlert,
    Terminal,
    Cpu,
    Clock,
    FileText,
    ArrowRight
} from 'lucide-react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            activeLogTab: 'log', // 'log' | 'stack' | 'env'
            copied: false
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        console.error("GitExplorer ErrorBoundary intercepted runtime exception:", error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            activeLogTab: 'log',
            copied: false
        });
        if (this.props.onReset) {
            this.props.onReset();
        }
    };

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    handleCopyError = () => {
        const { error, errorInfo } = this.state;
        const errorText = `[GitExplorer System Exception]
Error: ${error?.name || 'Error'}: ${error?.message || 'Unknown runtime error'}
Route: ${window.location.href}
Timestamp: ${new Date().toISOString()}

Stack Trace:
${error?.stack || 'No stack trace available'}

Component Stack:
${errorInfo?.componentStack || 'No component stack available'}`;

        navigator.clipboard.writeText(errorText).then(() => {
            this.setState({ copied: true });
            setTimeout(() => {
                this.setState({ copied: false });
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy error logs:', err);
        });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return typeof this.props.fallback === 'function'
                    ? this.props.fallback({ error: this.state.error, resetError: this.handleReset })
                    : this.props.fallback;
            }

            const errorMessage = this.state.error?.message || this.state.error?.toString() || 'An unhandled execution state occurred.';
            const errorStack = this.state.error?.stack;
            const componentStack = this.state.errorInfo?.componentStack;

            return (
                <div className="min-h-screen bg-[#08090a] text-white font-sans flex flex-col justify-between items-center p-4 sm:p-6 lg:p-10 relative overflow-hidden selection:bg-rose-500/20 selection:text-rose-300">
                    
                    {/* Very Faint Radial Glows & Canvas Borders */}
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/[0.04] rounded-full blur-[140px] pointer-events-none" />
                    <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-indigo-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

                    <div className="w-full max-w-4xl my-auto space-y-6 relative z-10 py-8">
                        
                        {/* Precision Bento Grid Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            
                            {/* Top Left Bento Cell: Exception Header */}
                            <div className="md:col-span-8 p-6 sm:p-8 rounded-2xl border border-white/[0.08] bg-[#0d0f12]/90 backdrop-blur-md space-y-4 shadow-2xl flex flex-col justify-between">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase">
                                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                                            STATUS_CODE: 500_RUNTIME_EXCEPTION
                                        </span>
                                    </div>
                                    
                                    <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-space">
                                        System Exception Intercepted
                                    </h1>
                                    
                                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans max-w-xl">
                                        GitExplorer encountered an unhandled application state. Execution stopped safely to preserve client-side storage integrity.
                                    </p>
                                </div>
                            </div>

                            {/* Top Right Bento Cell: Environment Telemetry */}
                            <div className="md:col-span-4 p-6 rounded-2xl border border-white/[0.08] bg-[#0d0f12]/90 backdrop-blur-md font-mono text-xs space-y-3 shadow-2xl flex flex-col justify-between">
                                <div className="flex items-center justify-between text-zinc-400 border-b border-white/[0.06] pb-2 text-[11px]">
                                    <span className="flex items-center gap-1.5 font-bold text-white">
                                        <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                                        TELEMETRY
                                    </span>
                                    <span className="text-emerald-400 font-bold">&bull; ISOLATED</span>
                                </div>

                                <div className="space-y-2 text-[11px]">
                                    <div className="flex items-center justify-between">
                                        <span className="text-zinc-500">Timestamp:</span>
                                        <span className="text-zinc-300 font-medium">{new Date().toLocaleTimeString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-zinc-500">Route:</span>
                                        <span className="text-zinc-300 font-medium truncate max-w-[120px]">{window.location.pathname}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-zinc-500">Storage:</span>
                                        <span className="text-emerald-400 font-medium">IndexedDB Intact</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Terminal Bento Card with Tabs */}
                        <div className="rounded-2xl border border-white/[0.08] bg-[#0d0f12]/95 backdrop-blur-md overflow-hidden shadow-2xl">
                            
                            {/* Top Bar with Tab Buttons & Copy Micro-interaction */}
                            <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-[#08090a] border-b border-white/[0.06] gap-3">
                                <div className="flex items-center gap-1.5 font-mono text-xs">
                                    <button
                                        type="button"
                                        onClick={() => this.setState({ activeLogTab: 'log' })}
                                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer text-xs font-medium ${
                                            this.state.activeLogTab === 'log'
                                                ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30 font-bold'
                                                : 'text-zinc-400 hover:text-white'
                                        }`}
                                    >
                                        Console Log
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => this.setState({ activeLogTab: 'stack' })}
                                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer text-xs font-medium ${
                                            this.state.activeLogTab === 'stack'
                                                ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30 font-bold'
                                                : 'text-zinc-400 hover:text-white'
                                        }`}
                                    >
                                        Stack Trace
                                    </button>
                                </div>

                                <button
                                    onClick={this.handleCopyError}
                                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-zinc-300 hover:text-white text-xs font-mono transition-all cursor-pointer"
                                >
                                    {this.state.copied ? (
                                        <>
                                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                                            <span className="text-emerald-400 font-bold">Copied to Clipboard</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3.5 h-3.5 text-zinc-400" />
                                            <span>Copy Error Log</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Terminal Output Body */}
                            <div className="p-5 sm:p-6 font-mono text-xs space-y-4 bg-[#08090a]">
                                
                                {this.state.activeLogTab === 'log' && (
                                    <div className="space-y-3">
                                        {/* Low-Saturation Crimson Pill */}
                                        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-start gap-3">
                                            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                                            <div className="space-y-1">
                                                <span className="font-bold text-rose-300 block">Exception Details:</span>
                                                <p className="break-all font-mono text-xs leading-relaxed text-slate-300">
                                                    {errorMessage}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-xl bg-[#0d0f12] border border-white/[0.06] text-slate-400 text-xs leading-relaxed font-mono">
                                            <span className="text-zinc-500 block mb-1">// System Diagnostic Note</span>
                                            This exception was caught by GitExplorer boundary. Check component inputs, state mutations, or API responses for unexpected null pointers.
                                        </div>
                                    </div>
                                )}

                                {this.state.activeLogTab === 'stack' && (
                                    <div className="space-y-3 max-h-72 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                                        {errorStack && (
                                            <div className="space-y-1">
                                                <span className="text-zinc-400 text-[11px] font-bold block">Error Stack Trace:</span>
                                                <pre className="text-slate-300 bg-[#0d0f12] p-4 rounded-xl border border-white/[0.06] whitespace-pre-wrap break-all text-[11px] leading-relaxed">
                                                    {errorStack}
                                                </pre>
                                            </div>
                                        )}

                                        {componentStack && (
                                            <div className="space-y-1 pt-2">
                                                <span className="text-zinc-400 text-[11px] font-bold block">Component Tree Stack:</span>
                                                <pre className="text-slate-400 bg-[#0d0f12] p-4 rounded-xl border border-white/[0.06] whitespace-pre-wrap break-all text-[11px] leading-relaxed">
                                                    {componentStack}
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* Tactile Low-Profile Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                            <button
                                onClick={this.handleReset}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-mono text-xs font-extrabold hover:bg-zinc-200 active:scale-[0.98] transition-all duration-200 shadow-md cursor-pointer"
                            >
                                <RefreshCw className="w-3.5 h-3.5 text-black" />
                                <span>Try Again</span>
                            </button>

                            <button
                                onClick={this.handleReload}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/15 bg-white/[0.04] text-zinc-200 hover:text-white hover:bg-white/[0.08] hover:border-white/30 font-mono text-xs font-bold active:scale-[0.98] transition-all duration-200 cursor-pointer"
                            >
                                <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
                                <span>Hard Reload</span>
                            </button>

                            <button
                                onClick={this.handleGoHome}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-transparent text-zinc-400 hover:text-white hover:border-white/20 font-mono text-xs font-medium transition-all duration-200 cursor-pointer"
                            >
                                <Home className="w-3.5 h-3.5" />
                                <span>Return Home</span>
                            </button>
                        </div>

                        {/* Footer Link */}
                        <div className="text-center text-xs text-zinc-500 font-mono pt-4">
                            GitExplorer Exception Guard &bull; Need technical help?{' '}
                            <a
                                href="/report"
                                className="text-zinc-300 hover:text-white underline underline-offset-4 transition-colors"
                            >
                                Report an Issue ↗
                            </a>
                        </div>

                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;


