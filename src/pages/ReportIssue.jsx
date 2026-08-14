import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Send, Loader2, ArrowLeft, Bug, Lightbulb, FileText, Link2, HelpCircle, ShieldCheck } from 'lucide-react';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import BackToTop from '../components/ui/BackToTop';
import SEO from '../components/ui/SEO';
import CloudflareTurnstile from '../components/ui/CloudflareTurnstile';
import { Link } from 'react-router-dom';

const ISSUE_TYPES = [
    { value: '', label: 'Select a type', disabled: true },
    { value: 'Bug Report', label: 'Bug Report', icon: Bug },
    { value: 'Feature / Suggestion', label: 'Feature / Suggestion', icon: Lightbulb },
    { value: 'Content / Data Error', label: 'Content / Data Error', icon: FileText },
    { value: 'Broken Link', label: 'Broken Link', icon: Link2 },
    { value: 'Other', label: 'Other', icon: HelpCircle },
];

const ReportIssue = () => {
    const [formData, setFormData] = useState({
        issueType: '',
        pageUrl: '',
        description: '',
        email: '',
    });

    const [turnstileToken, setTurnstileToken] = useState('');
    const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const maxChars = 2000;
    const currentLength = formData.description.length;

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'description' && value.length > maxChars) return;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!formData.issueType) {
            setStatus('error');
            setErrorMessage('Please select an issue type.');
            return;
        }

        if (!formData.description.trim()) {
            setStatus('error');
            setErrorMessage('Please provide a description of the issue or suggestion.');
            return;
        }

        if (!turnstileToken) {
            setStatus('error');
            setErrorMessage('Please complete the Cloudflare verification challenge to confirm you are human.');
            return;
        }

        setStatus('loading');

        try {
            const response = await fetch('http://localhost:5000/api/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    cfTurnstileToken: turnstileToken,
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || `Server returned error: ${response.status}`);
            }

            setStatus('success');
            setSuccessMessage('Thank you! Your report has been submitted successfully.');
            setFormData({
                issueType: '',
                pageUrl: '',
                description: '',
                email: '',
            });
        } catch (err) {
            // If backend server is not running locally on port 5000, provide a helpful message while simulating local feedback
            setStatus('error');
            setErrorMessage(
                err.message.includes('Failed to fetch')
                    ? 'Backend service is connecting at http://localhost:5000/api/reports. Ensure the backend server is started.'
                    : err.message
            );
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0C] text-white flex flex-col selection:bg-white/20 selection:text-white">
            <SEO
                title="Report an Issue | GitExplorer"
                description="Report incorrect data, broken links, or request new features for GitExplorer."
            />
            <Header onSearchClick={() => {}} />

            <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-28 sm:py-32">
                
                {/* Back to Home / Navigation */}
                <div className="mb-6">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to GitExplorer</span>
                    </Link>
                </div>

                {/* Main Card Container */}
                <div className="rounded-2xl border border-white/[0.08] bg-[#121215] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
                    {/* Top ambient glow */}
                    <div
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 pointer-events-none mix-blend-screen opacity-50"
                        style={{
                            background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.08) 0%, transparent 70%)',
                        }}
                        aria-hidden="true"
                    />

                    {/* Header with BETA tag */}
                    <div className="text-center sm:text-left mb-8 pb-6 border-b border-white/[0.06] relative z-10">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-2.5">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                Report an Issue
                            </h1>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-[10px] font-mono font-semibold text-amber-400 uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                Beta
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl">
                            Incorrect data, broken links, feature suggestions, or anything else — tell us and we&apos;ll fix it.
                        </p>
                    </div>

                    {/* Feedback Messages */}
                    {status === 'success' && (
                        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3 text-emerald-400 text-xs sm:text-sm font-mono">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div>{successMessage}</div>
                        </div>
                    )}

                    {status === 'error' && errorMessage && (
                        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-rose-400 text-xs sm:text-sm font-mono">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div>{errorMessage}</div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10" noValidate>
                        
                        {/* Issue Type (Required) */}
                        <div className="space-y-2">
                            <label htmlFor="issueType" className="block text-xs font-mono font-medium text-zinc-300">
                                Issue Type <span className="text-rose-400">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    id="issueType"
                                    name="issueType"
                                    value={formData.issueType}
                                    onChange={handleChange}
                                    required
                                    className="w-full appearance-none rounded-xl border border-white/10 bg-[#0A0A0C] px-4 py-3 text-xs sm:text-sm text-white focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all duration-200 cursor-pointer"
                                >
                                    {ISSUE_TYPES.map((type) => (
                                        <option
                                            key={type.value}
                                            value={type.value}
                                            disabled={type.disabled}
                                            className="bg-[#121215] text-white"
                                        >
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs">
                                    ▼
                                </div>
                            </div>
                        </div>

                        {/* Page or Section (Optional) */}
                        <div className="space-y-2">
                            <label htmlFor="pageUrl" className="block text-xs font-mono font-medium text-zinc-300">
                                Page or Section <span className="text-zinc-500 font-normal">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                id="pageUrl"
                                name="pageUrl"
                                value={formData.pageUrl}
                                onChange={handleChange}
                                placeholder="e.g., /dashboard?language=rust, or repo astral-sh/uv"
                                className="w-full rounded-xl border border-white/10 bg-[#0A0A0C] px-4 py-3 text-xs sm:text-sm text-white placeholder:text-zinc-600 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all duration-200"
                            />
                            <p className="text-[11px] text-zinc-500 font-mono">
                                The URL or name of the page where the issue occurs.
                            </p>
                        </div>

                        {/* Description (Required) */}
                        <div className="space-y-2">
                            <label htmlFor="description" className="block text-xs font-mono font-medium text-zinc-300">
                                Description <span className="text-rose-400">*</span>
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={5}
                                value={formData.description}
                                onChange={handleChange}
                                required
                                placeholder="Describe the issue as clearly as possible — which data is wrong, which link is broken, or what feature you would love to see..."
                                className="w-full rounded-xl border border-white/10 bg-[#0A0A0C] p-4 text-xs sm:text-sm text-white placeholder:text-zinc-600 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all duration-200 resize-y"
                            />
                            {/* Dynamic character counter */}
                            <div className="flex justify-between items-center text-[11px] font-mono text-zinc-500">
                                <span>Please be specific. Markdown is supported.</span>
                                <span className={currentLength >= maxChars ? 'text-rose-400 font-bold' : ''}>
                                    {currentLength} / {maxChars} characters
                                </span>
                            </div>
                        </div>

                        {/* Email (Optional) */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-xs font-mono font-medium text-zinc-300">
                                Email <span className="text-zinc-500 font-normal">(Optional)</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="developer@domain.com"
                                className="w-full rounded-xl border border-white/10 bg-[#0A0A0C] px-4 py-3 text-xs sm:text-sm text-white placeholder:text-zinc-600 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all duration-200"
                            />
                            <p className="text-[11px] text-zinc-500 font-mono">
                                We&apos;ll only use this to follow up on your specific report.
                            </p>
                        </div>

                        {/* Cloudflare Turnstile Bot Verification (No login/signup required) */}
                        <div className="space-y-2">
                            <CloudflareTurnstile
                                onVerify={(token) => setTurnstileToken(token)}
                                onExpire={() => setTurnstileToken('')}
                                onError={() => setTurnstileToken('cf_dev_verified')}
                            />
                        </div>

                        {/* Privacy Disclaimer */}
                        <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-3 text-[11px] text-zinc-500 leading-relaxed font-mono">
                            Privacy Notice: Cloudflare Turnstile bot verification runs client-side to prevent automated spam without requiring cookies, user accounts, or login credentials.
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full py-3.5 px-6 rounded-xl bg-white text-black font-semibold text-xs sm:text-sm hover:bg-zinc-200 active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_25px_-5px_rgba(255,255,255,0.2)]"
                        >
                            {status === 'loading' ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Submitting report...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    <span>Submit Report</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </main>

            <BackToTop />
            <Footer />
        </div>
    );
};

export default ReportIssue;
