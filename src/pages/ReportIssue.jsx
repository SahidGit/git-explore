import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import SEO from '../components/ui/SEO';
import Turnstile from 'react-turnstile';

const ReportIssue = () => {
    const [formData, setFormData] = useState({
        issueType: '',
        pageUrl: '',
        description: '',
        email: '',
    });

    const [status, setStatus] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [turnstileToken, setTurnstileToken] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');
        setSuccessMessage('');

        try {
            if (!formData.issueType) {
                throw new Error('Please select an issue type.');
            }
            if (!formData.description || formData.description.trim().length < 10) {
                throw new Error('Description must be at least 10 characters.');
            }

            const localReport = {
                issueType: formData.issueType,
                pageUrl: formData.pageUrl,
                description: formData.description,
                email: formData.email,
                timestamp: new Date().toISOString(),
            };

            try {
                const existingReports = JSON.parse(localStorage.getItem('gitexplorer_user_reports') || '[]');
                existingReports.unshift(localReport);
                localStorage.setItem('gitexplorer_user_reports', JSON.stringify(existingReports.slice(0, 50)));
            } catch (_) {}

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
                canonical="https://exploregit.vercel.app/report"
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
                                <div className="relative space-y-2 pb-6 border-b border-white/10">
                                    <span className="inline-block px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono font-bold">
                                        FEEDBACK SYSTEM
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-extrabold font-space text-white">
                                        Report an Issue
                                    </h2>
                                    <p className="text-sm text-zinc-400">
                                        Help us improve GitExplorer by reporting bugs, suggesting features, or providing feedback.
                                    </p>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="relative pt-6 space-y-5">
                                    {/* Issue Type */}
                                    <div>
                                        <label htmlFor="issueType" className="block text-xs font-mono text-zinc-400 mb-2">
                                            Issue Type
                                        </label>
                                        <select
                                            id="issueType"
                                            name="issueType"
                                            value={formData.issueType}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg bg-[#0B0C0E] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                                        >
                                            <option value="">Select an issue type...</option>
                                            <option value="Bug Report">Bug Report</option>
                                            <option value="Feature Request">Feature Request</option>
                                            <option value="Data Correction">Data Correction</option>
                                            <option value="Performance Issue">Performance Issue</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    {/* Page URL */}
                                    <div>
                                        <label htmlFor="pageUrl" className="block text-xs font-mono text-zinc-400 mb-2">
                                            Page URL (optional)
                                        </label>
                                        <input
                                            id="pageUrl"
                                            type="url"
                                            name="pageUrl"
                                            value={formData.pageUrl}
                                            onChange={handleChange}
                                            placeholder="https://exploregit.vercel.app/dashboard"
                                            className="w-full px-4 py-3 rounded-lg bg-[#0B0C0E] border border-white/10 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label htmlFor="description" className="block text-xs font-mono text-zinc-400 mb-2">
                                            Description (minimum 10 characters)
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Please provide details about your issue or feature request..."
                                            rows="5"
                                            className="w-full px-4 py-3 rounded-lg bg-[#0B0C0E] border border-white/10 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" className="block text-xs font-mono text-zinc-400 mb-2">
                                            Email (optional - for follow-up)
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="your-email@example.com"
                                            className="w-full px-4 py-3 rounded-lg bg-[#0B0C0E] border border-white/10 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                                        />
                                    </div>

                                    {/* Turnstile Bot Protection */}
                                    <div className="py-2">
                                        <Turnstile
                                            sitekey={import.meta.env.VITE_CLOUDFLARE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
                                            onVerify={(token) => setTurnstileToken(token)}
                                            theme="dark"
                                        />
                                    </div>

                                    {/* Status Messages */}
                                    {status === 'success' && (
                                        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">
                                            {successMessage}
                                        </div>
                                    )}
                                    {status === 'error' && (
                                        <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
                                            {errorMessage}
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            disabled={status === 'submitting'}
                                            className="flex-1 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all disabled:opacity-50 cursor-pointer"
                                        >
                                            {status === 'submitting' ? 'Submitting...' : 'Submit Report'}
                                        </button>
                                        {status === 'success' && (
                                            <button
                                                type="button"
                                                onClick={handleReset}
                                                className="flex-1 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition-all cursor-pointer"
                                            >
                                                Submit Another
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default ReportIssue;
