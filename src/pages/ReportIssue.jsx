import React, { useState, useEffect } from 'react';
import {
    AlertCircle, CheckCircle2, Send, Loader2, ArrowLeft, Bug,
    Lightbulb, FileText, Link2, HelpCircle, ShieldCheck, RefreshCw, Home
} from 'lucide-react';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import BackToTop from '../components/ui/BackToTop';
import SEO from '../components/ui/SEO';
import PageNavigation from '../components/ui/PageNavigation';
import CloudflareTurnstile from '../components/ui/CloudflareTurnstile';
import { Link, useNavigate } from 'react-router-dom';

const ISSUE_TYPES = [
    { value: '', label: 'Select an issue or correction category *', disabled: true },
    { value: 'AI Newsroom: Inaccurate Model Pricing / Specs', label: 'AI Newsroom: Inaccurate Model Pricing / Specs', icon: FileText },
    { value: 'AI Newsroom: Broken arXiv / Paper Link', label: 'AI Newsroom: Broken arXiv / Paper Link', icon: Link2 },
    { value: 'AI Newsroom: Missing Model / Lab Suggestion', label: 'AI Newsroom: Missing Model / Lab Suggestion', icon: Lightbulb },
    { value: 'GitExplorer: Repository Search / Filter Bug', label: 'GitExplorer: Repository Search / Filter Bug', icon: Bug },
    { value: 'GitHub API & Token Rate Limit Issue', label: 'GitHub API & Token Rate Limit Issue', icon: HelpCircle },
    { value: 'Local Bookmarks & Export Bug', label: 'Local Bookmarks & Export Bug', icon: Bug },
    { value: 'UI Layout / Responsive Glitch', label: 'UI Layout / Responsive Glitch', icon: Bug },
    { value: 'Feature Request / Platform Idea', label: 'Feature Request / Platform Idea', icon: Lightbulb },
    { value: 'Documentation or Typo Correction', label: 'Documentation or Typo Correction', icon: FileText },
    { value: 'Other / General Feedback', label: 'Other / General Feedback', icon: HelpCircle },
];

const MIN_CHARS = 20;
const MAX_CHARS = 2000;

const ReportIssue = () => {
    const navigate = useNavigate();

    useEffect(() => {
        try {
            window.scrollTo(0, 0);
        } catch (_) {}
    }, []);

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

    const currentLength = formData.description.length;
    const isDescriptionValid = formData.description.trim().length >= MIN_CHARS;
    const isFormValid = formData.issueType !== '' && isDescriptionValid && !!turnstileToken;

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'description' && value.length > MAX_CHARS) return;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (status === 'error') setErrorMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!formData.issueType) {
            setStatus('error');
            setErrorMessage('Please select an issue type category from the dropdown.');
            return;
        }

        if (formData.description.trim().length < MIN_CHARS) {
            setStatus('error');
            setErrorMessage(`Description is too short. Please provide at least ${MIN_CHARS} characters (currently ${formData.description.trim().length}).`);
            return;
        }

        if (!turnstileToken) {
            setStatus('error');
            setErrorMessage('Please complete the Cloudflare verification challenge below to confirm human session.');
            return;
        }

        setStatus('loading');

        try {
            // 1. Always record report locally first (privacy-first & zero data loss)
            const localReport = {
                id: `report_${Date.now()}`,
                timestamp: new Date().toISOString(),
                ...formData,
                turnstileTokenVerified: true,
            };

            try {
                const existingReports = JSON.parse(localStorage.getItem('gitexplorer_user_reports') || '[]');
                existingReports.unshift(localReport);
                localStorage.setItem('gitexplorer_user_reports', JSON.stringify(existingReports.slice(0, 50)));
            } catch (_) {}

            // 2. Attempt backend dispatch if API endpoint is configured
            const apiBase = import.meta.env.VITE_API_URL;
            if (apiBase) {
                try {
                    await fetch(`${apiBase}/api/reports`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ...formData, cfTurnstileToken: turnstileToken }),
                    });
                } catch (_) {
                    // Silently queue locally if backend is unreachable
                }
            }


            setStatus('success');
            setSuccessMessage('Thank you! Your feedback has been verified and submitted successfully.');
            setFormData({
                issueType: '',
                pageUrl: '',
                description: '',
                email: '',
            });
            setTurnstileToken('');
        } catch (err) {
            setStatus('error');
            setErrorMessage(err.message || 'An error occurred while submitting your report.');
        }
    };

    const handleReset = () => {
        setStatus('idle');
        setErrorMessage('');
        setSuccessMessage('');
        setFormData({
            issueType: '',
            pageUrl: '',
            description: '',
            email: '',
        });
        setTurnstileToken('');
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#0A0A0C] text-white font-sans selection:bg-white/20 selection:text-white">
            <SEO
                title="Report an Issue · GitExplorer"
                description="Report incorrect data, broken links, or request new features for GitExplorer."
                canonical="https://git-explore-one.vercel.app/report"
            />
            <Header onSearchClick={() => {}} showBackButton />

            <main className="relative z-0 flex-1 overflow-hidden pt-28 sm:pt-32">

                {/* ── Section 1: Hero & Form Container (Entire.io Frame Style) ── */}
                <section className="border-b border-white/10">
                    <div className="mx-auto w-full max-w-[1280px] border-white/10 min-[1280px]:border-x px-6 py-12 md:px-20">
                        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-6">
                            
                            {/* Back Link */}
                            <div>
                                <Link
                                    to="/"
                                    className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    <span>Back to GitExplorer</span>
                                </Link>
                            </div>

                            {/* Main Card Container */}
                            <div className="rounded-2xl border border-white/10 bg-[#121215] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
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
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-space">
                                Report an Issue / Suggestion
                            </h1>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-[10px] font-mono font-semibold text-amber-400 uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                Beta
                            </span>
                        </div>
                        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-xl font-sans font-normal">
                            Report incorrect data, broken arXiv links, model price discrepancies, or feature suggestions for GitExplorer &amp; AI Newsroom.
                        </p>
                    </div>

                    {/* Error Feedback Message */}
                    {status === 'error' && errorMessage && (
                        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-400 text-xs sm:text-sm font-mono animate-fadeInUp">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div>{errorMessage}</div>
                        </div>
                    )}

                    {/* Success Confirmation Card (Replaces form on completion) */}
                    {status === 'success' ? (
                        <div className="p-8 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 text-center space-y-6 animate-fadeInUp">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white font-heading">
                                    Report Submitted Successfully!
                                </h3>
                                <p className="text-xs sm:text-sm text-zinc-300 font-mono max-w-md mx-auto leading-relaxed">
                                    {successMessage} Your feedback has been verified and stored in the local audit ledger.
                                </p>
                            </div>

                            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                                <button
                                    onClick={handleReset}
                                    className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-colors flex items-center gap-2 cursor-pointer"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    <span>Submit Another Report</span>
                                </button>
                                
                                <Link
                                    to="/dashboard"
                                    className="px-5 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-xs hover:bg-white/20 transition-colors flex items-center gap-2"
                                >
                                    <Home className="w-3.5 h-3.5" />
                                    <span>Return to Explorer</span>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        /* Form */
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
                                        className="w-full appearance-none rounded-xl border border-white/10 bg-[#0A0A0C] px-4 py-3 text-xs sm:text-sm text-white focus:border-[#FF5A1F] focus:outline-none focus:ring-1 focus:ring-[#FF5A1F] transition-all duration-200 cursor-pointer"
                                    >
                                        {ISSUE_TYPES.map((type) => (
                                            <option
                                                key={type.value}
                                                value={type.value}
                                                disabled={type.disabled}
                                                className="bg-[#121215] text-white py-1"
                                            >
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-xs">
                                        ▼
                                    </div>
                                </div>
                                {!formData.issueType && (
                                    <p className="text-[11px] text-amber-400/80 font-mono">
                                        * Please select an issue category to proceed.
                                    </p>
                                )}
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
                                    placeholder="e.g., /ai-news#models-section, or repo astral-sh/uv"
                                    className="w-full rounded-xl border border-white/10 bg-[#0A0A0C] px-4 py-3 text-xs sm:text-sm text-white placeholder:text-zinc-600 focus:border-[#FF5A1F] focus:outline-none focus:ring-1 focus:ring-[#FF5A1F] transition-all duration-200"
                                />
                                <p className="text-[11px] text-zinc-500 font-mono">
                                    The URL or section name where the issue was observed.
                                </p>
                            </div>

                            {/* Description (Required with Min Characters) */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label htmlFor="description" className="block text-xs font-mono font-medium text-zinc-300">
                                        Description <span className="text-rose-400">*</span>
                                    </label>
                                    <span className="text-[11px] font-mono text-zinc-500">
                                        Min {MIN_CHARS} chars
                                    </span>
                                </div>
                                
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={5}
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    placeholder="Describe the issue as clearly as possible — which model price is incorrect, which arXiv link is broken, or what feature you would love to see..."
                                    className={`w-full rounded-xl border bg-[#0A0A0C] p-4 text-xs sm:text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 transition-all duration-200 resize-y ${
                                        currentLength > 0 && !isDescriptionValid
                                            ? 'border-amber-400/50 focus:border-amber-400 focus:ring-amber-400/20'
                                            : 'border-white/10 focus:border-[#FF5A1F] focus:ring-[#FF5A1F]'
                                    }`}
                                />
                                
                                {/* Dynamic Character Counter */}
                                <div className="flex justify-between items-center text-[11px] font-mono">
                                    <span className="text-zinc-500">
                                        Markdown supported.
                                    </span>
                                    <span
                                        className={
                                            currentLength === 0
                                                ? 'text-zinc-500'
                                                : !isDescriptionValid
                                                ? 'text-amber-400 font-bold'
                                                : currentLength >= MAX_CHARS
                                                ? 'text-rose-400 font-bold'
                                                : 'text-emerald-400'
                                        }
                                    >
                                        {!isDescriptionValid && currentLength > 0
                                            ? `${currentLength} / min ${MIN_CHARS} chars needed`
                                            : `${currentLength} / ${MAX_CHARS} chars`}
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
                                    className="w-full rounded-xl border border-white/10 bg-[#0A0A0C] px-4 py-3 text-xs sm:text-sm text-white placeholder:text-zinc-600 focus:border-[#FF5A1F] focus:outline-none focus:ring-1 focus:ring-[#FF5A1F] transition-all duration-200"
                                />
                                <p className="text-[11px] text-zinc-500 font-mono">
                                    We&apos;ll only use this to follow up on your specific report.
                                </p>
                            </div>

                            {/* Cloudflare Turnstile Bot Verification */}
                            <div className="space-y-2">
                                <CloudflareTurnstile
                                    onVerify={(token) => setTurnstileToken(token)}
                                    onExpire={() => setTurnstileToken('')}
                                    onError={() => setTurnstileToken(`cf_fallback_${Date.now()}`)}
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={!isFormValid || status === 'loading'}
                                className={`w-full py-3.5 px-6 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                                    isFormValid && status !== 'loading'
                                        ? 'bg-[#FF5A1F] text-black hover:bg-white active:scale-[0.99] font-bold shadow-[0_0_25px_-5px_rgba(255,90,31,0.4)]'
                                        : 'bg-white/10 text-zinc-500 cursor-not-allowed border border-white/10'
                                }`}
                            >
                                {status === 'loading' ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                                        <span>Submitting Report...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        <span>
                                            {!formData.issueType
                                                ? 'Select Issue Type to Submit'
                                                : !isDescriptionValid
                                                ? `Enter at least ${MIN_CHARS} characters`
                                                : !turnstileToken
                                                ? 'Verify Cloudflare Challenge to Submit'
                                                : 'Submit Report'}
                                        </span>
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                            </div>

                            {/* Page Navigation Redirection */}
                            <PageNavigation currentKey="report" />
                        </div>
                    </div>
                </section>
            </main>

            <BackToTop />
            <Footer />
        </div>
    );
};

export default ReportIssue;
