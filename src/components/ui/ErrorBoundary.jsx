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
    Terminal
} from 'lucide-react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            showDetails: false,
            copied: false
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        console.error("GitExplorer ErrorBoundary caught an error:", error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            showDetails: false,
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
        const errorText = `[GitExplorer Runtime Exception]
Error: ${error?.name || 'Error'}: ${error?.message || 'Unknown error'}
Location: ${window.location.href}
Time: ${new Date().toISOString()}

Stack Trace:
${error?.stack || 'No stack trace available'}

Component Stack:
${errorInfo?.componentStack || 'No component stack available'}`;

        navigator.clipboard.writeText(errorText).then(() => {
            this.setState({ copied: true });
            setTimeout(() => {
                this.setState({ copied: false });
            }, 2500);
        }).catch(err => {
            console.error('Failed to copy error details:', err);
        });
    };

    toggleDetails = () => {
        this.setState(prevState => ({ showDetails: !prevState.showDetails }));
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return typeof this.props.fallback === 'function'
                    ? this.props.fallback({ error: this.state.error, resetError: this.handleReset })
                    : this.props.fallback;
            }

            const errorMessage = this.state.error?.message || this.state.error?.toString() || 'An unexpected error occurred.';
            const errorStack = this.state.error?.stack;
            const componentStack = this.state.errorInfo?.componentStack;

            return (
                <div className="min-h-screen bg-[#0A0A0C] text-white font-sans flex flex-col justify-between items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden selection:bg-rose-500/30 selection:text-rose-200">
                    {/* Background Decorative Glow Effects */}
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

                    <div className="w-full max-w-2xl my-auto space-y-8 relative z-10 py-12">
                        {/* Status Icon & Title Badge */}
                        <div className="text-center space-y-4">
                            <div className="relative inline-flex items-center justify-center">
                                <div className="absolute inset-0 bg-rose-500/20 rounded-2xl blur-xl animate-pulse" />
                                <div className="relative bg-[#16161A] p-4 rounded-2xl border border-rose-500/30 text-rose-400 shadow-2xl shadow-rose-950/40">
                                    <ShieldAlert className="w-12 h-12" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-widest bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                                    STATUS_CODE: 500_RUNTIME_EXCEPTION
                                </span>
                                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                                    System Exception Intercepted
                                </h1>
                                <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                                    GitExplorer encountered an unhandled execution state. The system stopped safely to protect your workspace.
                                </p>
                            </div>
                        </div>

                        {/* Terminal Box Preview */}
                        <div className="rounded-2xl border border-white/10 bg-[#0E0E11] overflow-hidden shadow-2xl backdrop-blur-md">
                            <div className="flex items-center justify-between px-4 py-3 bg-[#131317] border-b border-white/[0.06]">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                                    </div>
                                    <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5 ml-2">
                                        <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                                        ~ /errors/uncaught-exception.log
                                    </span>
                                </div>
                                <button
                                    onClick={this.handleCopyError}
                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs font-mono transition-colors cursor-pointer"
                                    title="Copy error details"
                                >
                                    {this.state.copied ? (
                                        <>
                                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                                            <span className="text-emerald-400">Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3.5 h-3.5" />
                                            <span>Copy Log</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="p-5 font-mono text-xs space-y-3">
                                <div className="flex items-start gap-2 text-rose-400 bg-rose-950/30 p-3 rounded-lg border border-rose-500/20">
                                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span className="break-all font-semibold">{errorMessage}</span>
                                </div>

                                <div className="text-zinc-500 text-[11px] flex items-center justify-between pt-1">
                                    <span>Captured at: {new Date().toLocaleTimeString()}</span>
                                    <span>Target: GitExplorer App State</span>
                                </div>
                            </div>
                        </div>

                        {/* Expandable Stack Trace Section */}
                        {(errorStack || componentStack) && (
                            <div className="rounded-xl border border-white/10 bg-[#0E0E11] overflow-hidden">
                                <button
                                    onClick={this.toggleDetails}
                                    className="w-full px-4 py-3 flex items-center justify-between text-xs font-mono text-zinc-400 hover:text-white bg-[#131317] hover:bg-white/[0.02] transition-colors text-left cursor-pointer"
                                >
                                    <span className="flex items-center gap-2">
                                        <Bug className="w-4 h-4 text-rose-400" />
                                        {this.state.showDetails ? 'Hide Stack Trace & Call Tree' : 'Inspect Stack Trace & Call Tree'}
                                    </span>
                                    {this.state.showDetails ? (
                                        <ChevronUp className="w-4 h-4" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4" />
                                    )}
                                </button>

                                {this.state.showDetails && (
                                    <div className="p-4 bg-[#0A0A0C] border-t border-white/[0.06] font-mono text-[11px] text-zinc-400 max-h-64 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                                        {errorStack && (
                                            <div>
                                                <div className="text-zinc-300 font-semibold mb-1">Error Stack:</div>
                                                <pre className="whitespace-pre-wrap break-all text-rose-300/80 bg-black/40 p-3 rounded border border-white/5">
                                                    {errorStack}
                                                </pre>
                                            </div>
                                        )}
                                        {componentStack && (
                                            <div>
                                                <div className="text-zinc-300 font-semibold mb-1">Component Stack:</div>
                                                <pre className="whitespace-pre-wrap break-all text-zinc-400 bg-black/40 p-3 rounded border border-white/5">
                                                    {componentStack}
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                            <button
                                onClick={this.handleReset}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-black text-xs font-semibold hover:bg-zinc-200 active:scale-[0.98] transition-all shadow-lg shadow-white/10 cursor-pointer"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Try Again
                            </button>

                            <button
                                onClick={this.handleReload}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 text-zinc-200 text-xs font-medium hover:bg-white/10 hover:border-white/20 hover:text-white active:scale-[0.98] transition-all cursor-pointer"
                            >
                                <RefreshCw className="w-4 h-4 text-zinc-400" />
                                Hard Reload
                            </button>

                            <button
                                onClick={this.handleGoHome}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-transparent text-zinc-400 text-xs font-medium hover:border-white/20 hover:text-white transition-all cursor-pointer"
                            >
                                <Home className="w-4 h-4" />
                                Return Home
                            </button>
                        </div>
                    </div>

                    {/* Footer note */}
                    <div className="relative z-10 text-center text-xs text-zinc-600 font-mono py-4">
                        GitExplorer Exception Handler • Need help?{' '}
                        <a
                            href="/report"
                            className="text-zinc-400 hover:text-white underline underline-offset-4 transition-colors"
                        >
                            Report issue
                        </a>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

