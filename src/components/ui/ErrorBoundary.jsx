import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        console.error("ExploreGit ErrorBoundary intercepted runtime exception:", error, errorInfo);
    }

    handleReload = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
        window.location.href = '/';
    };

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
        if (this.props.onReset) {
            this.props.onReset();
        }
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return typeof this.props.fallback === 'function'
                    ? this.props.fallback({ error: this.state.error, resetError: this.handleReset })
                    : this.props.fallback;
            }

            return (
                <div className="flex min-h-dvh min-h-screen items-center justify-center bg-[#101012] text-white font-sans selection:bg-white/20 selection:text-white">
                    <div className="space-y-4 px-4 text-center">
                        <h1 className="font-mono text-6xl font-bold text-default text-white">500</h1>
                        <h2 className="text-2xl font-semibold text-default text-white">Something went wrong</h2>
                        <p className="max-w-md text-muted text-neutral-400 text-sm sm:text-base leading-relaxed mx-auto">
                            An unexpected error occurred. Please try refreshing the page.
                        </p>
                        <div className="pt-4">
                            <button
                                type="button"
                                onClick={this.handleReload}
                                className="inline-block rounded bg-neutral-900 px-6 py-3 font-normal text-white transition-colors hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 hover:dark:bg-neutral-200 cursor-pointer shadow-sm active:scale-95"
                            >
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
