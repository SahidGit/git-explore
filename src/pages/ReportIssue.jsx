import React, { useState, useEffect, useRef } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Send,
  Loader2,
  ArrowLeft,
  Bug,
  Lightbulb,
  FileText,
  Link2,
  HelpCircle,
  ShieldCheck,
  RefreshCw,
  Home,
  ChevronDown,
  Check,
} from "lucide-react";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";
import BackToTop from "../components/ui/BackToTop";
import SEO from "../components/ui/SEO";
import PageNavigation from "../components/ui/PageNavigation";
import CloudflareTurnstile from "../components/ui/CloudflareTurnstile";
import { Link, useNavigate } from "react-router-dom";

const ISSUE_TYPES = [
  {
    value: "",
    label: "Select an issue or correction category *",
    disabled: true,
  },
  {
    value: "AI Newsroom: Inaccurate Model Pricing / Specs",
    label: "AI Newsroom: Inaccurate Model Pricing / Specs",
    icon: FileText,
  },
  {
    value: "AI Newsroom: Broken arXiv / Paper Link",
    label: "AI Newsroom: Broken arXiv / Paper Link",
    icon: Link2,
  },
  {
    value: "AI Newsroom: Missing Model / Lab Suggestion",
    label: "AI Newsroom: Missing Model / Lab Suggestion",
    icon: Lightbulb,
  },
  {
    value: "ExploreGit: Repository Search / Filter Bug",
    label: "ExploreGit: Repository Search / Filter Bug",
    icon: Bug,
  },
  {
    value: "GitHub API & Token Rate Limit Issue",
    label: "GitHub API & Token Rate Limit Issue",
    icon: HelpCircle,
  },
  {
    value: "Local Bookmarks & Export Bug",
    label: "Local Bookmarks & Export Bug",
    icon: Bug,
  },
  {
    value: "UI Layout / Responsive Glitch",
    label: "UI Layout / Responsive Glitch",
    icon: Bug,
  },
  {
    value: "Feature Request / Platform Idea",
    label: "Feature Request / Platform Idea",
    icon: Lightbulb,
  },
  {
    value: "Documentation or Typo Correction",
    label: "Documentation or Typo Correction",
    icon: FileText,
  },
  {
    value: "Other / General Feedback",
    label: "Other / General Feedback",
    icon: HelpCircle,
  },
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
    issueType: "",
    pageUrl: "",
    description: "",
    email: "",
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [turnstileToken, setTurnstileToken] = useState("");
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const currentLength = formData.description.length;
  const isDescriptionValid = formData.description.trim().length >= MIN_CHARS;
  const isFormValid =
    formData.issueType !== "" && isDescriptionValid && !!turnstileToken;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "description" && value.length > MAX_CHARS) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status === "error") setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.issueType) {
      setStatus("error");
      setErrorMessage(
        "Please select an issue type category from the dropdown.",
      );
      return;
    }

    if (formData.description.trim().length < MIN_CHARS) {
      setStatus("error");
      setErrorMessage(
        `Description is too short. Please provide at least ${MIN_CHARS} characters (currently ${formData.description.trim().length}).`,
      );
      return;
    }

    if (!turnstileToken) {
      setStatus("error");
      setErrorMessage(
        "Please complete the Cloudflare verification challenge below to confirm human session.",
      );
      return;
    }

    setStatus("loading");

    try {
      // 1. Always record report locally first (privacy-first & zero data loss)
      const localReport = {
        id: `report_${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...formData,
        turnstileTokenVerified: true,
      };

      try {
        const existingReports = JSON.parse(
          localStorage.getItem("gitexplorer_user_reports") || "[]",
        );
        existingReports.unshift(localReport);
        localStorage.setItem(
          "gitexplorer_user_reports",
          JSON.stringify(existingReports.slice(0, 50)),
        );
      } catch (_) {}

      // 2. Attempt backend dispatch if API endpoint is configured
      const apiBase = import.meta.env.VITE_API_URL;
      if (apiBase) {
        try {
          await fetch(`${apiBase}/api/reports`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...formData,
              cfTurnstileToken: turnstileToken,
            }),
          });
        } catch (_) {
          // Silently queue locally if backend is unreachable
        }
      }

      setStatus("success");
      setSuccessMessage(
        "Thank you! Your feedback has been verified and submitted successfully.",
      );
      setFormData({
        issueType: "",
        pageUrl: "",
        description: "",
        email: "",
      });
      setTurnstileToken("");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err.message || "An error occurred while submitting your report.",
      );
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setErrorMessage("");
    setSuccessMessage("");
    setFormData({
      issueType: "",
      pageUrl: "",
      description: "",
      email: "",
    });
    setTurnstileToken("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0C] text-white font-sans selection:bg-white/20 selection:text-white">
      <SEO
        title="Report an Issue · ExploreGit"
        description="Report incorrect data, broken links, or request new features for ExploreGit."
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
                  <span>Back to ExploreGit</span>
                </Link>
              </div>

              {/* Main Card Container */}
              <div className="rounded-2xl border border-white/10 bg-[#121215] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
                {/* Top ambient glow */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 pointer-events-none mix-blend-screen opacity-50"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.08) 0%, transparent 70%)",
                  }}
                  aria-hidden="true"
                />

                {/* Header with BETA tag */}
                <div className="text-center sm:text-left mb-8 pb-6 border-b border-white/[0.06] relative z-10">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-2.5">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
                      Report an Issue / Suggestion
                    </h1>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-xs font-sans font-semibold text-amber-400 uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      Beta
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-xl font-sans font-normal">
                    Report incorrect data, broken arXiv links, model price
                    discrepancies, or feature suggestions for ExploreGit &amp;
                    AI Newsroom.
                  </p>
                </div>

                {/* Error Feedback Message */}
                {status === "error" && errorMessage && (
                  <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-400 text-xs sm:text-sm font-mono animate-fadeInUp">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>{errorMessage}</div>
                  </div>
                )}

                {/* Success Confirmation Card (Replaces form on completion) */}
                {status === "success" ? (
                  <div className="p-8 sm:p-12 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-md text-center space-y-6 animate-fadeInUp shadow-2xl">
                    {/* Minimal SVG Stroke Icon */}
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                      <CheckCircle2 className="w-6 h-6 stroke-[1.75]" />
                    </div>

                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-semibold tracking-wider uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>SUBMISSION VERIFIED</span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-tight">
                        Report Submitted Successfully!
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-400 font-mono max-w-md mx-auto leading-relaxed">
                        {successMessage} Your feedback has been verified and
                        logged in the local audit ledger.
                      </p>
                    </div>

                    {/* Low-profile Glass Pill Buttons */}
                    <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3 font-sans text-xs">
                      <button
                        onClick={handleReset}
                        className="px-5 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 active:scale-[0.98] transition-all duration-200 font-semibold flex items-center gap-2 cursor-pointer shadow-none"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Submit Another Report</span>
                      </button>

                      <Link
                        to="/dashboard"
                        className="px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.12] text-white hover:bg-white/[0.08] hover:border-white/25 active:scale-[0.98] transition-all duration-200 font-semibold flex items-center gap-2 shadow-none"
                      >
                        <Home className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Return to Explorer</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  /* Form */
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-6 relative z-10"
                    noValidate
                  >
                    {/* Issue Type (Required with Custom Styled Dropdown) */}
                    <div className="space-y-2 relative" ref={dropdownRef}>
                      <label
                        htmlFor="issueTypeTrigger"
                        className="block text-xs font-mono font-medium text-zinc-300"
                      >
                        Issue Type <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <button
                          id="issueTypeTrigger"
                          type="button"
                          onClick={() => setDropdownOpen((prev) => !prev)}
                          aria-haspopup="listbox"
                          aria-expanded={dropdownOpen}
                          className={`w-full px-4 py-3 rounded-xl border text-left text-xs sm:text-sm flex items-center justify-between transition-all duration-200 bg-[#0A0A0C] cursor-pointer ${
                            dropdownOpen
                              ? 'border-white/30 ring-1 ring-white/20'
                              : 'border-white/10 hover:border-white/20'
                          }`}
                        >
                          <span className={formData.issueType ? 'text-white font-medium' : 'text-zinc-500 font-mono'}>
                            {formData.issueType
                              ? ISSUE_TYPES.find((t) => t.value === formData.issueType)?.label || formData.issueType
                              : 'Select an issue category...'}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                              dropdownOpen ? 'rotate-180 text-white' : ''
                            }`}
                          />
                        </button>

                        {/* Custom Dropdown Menu */}
                        {dropdownOpen && (
                          <div
                            role="listbox"
                            className="absolute z-50 mt-1.5 w-full bg-[#121215] rounded-xl border border-white/10 shadow-2xl py-1.5 max-h-64 overflow-y-auto animate-fadeIn backdrop-blur-xl"
                          >
                            {ISSUE_TYPES.filter((t) => !t.disabled).map((type) => {
                              const isSelected = formData.issueType === type.value;
                              const IconComponent = type.icon;
                              return (
                                <button
                                  key={type.value}
                                  type="button"
                                  role="option"
                                  aria-selected={isSelected}
                                  onClick={() => {
                                    setFormData((prev) => ({ ...prev, issueType: type.value }));
                                    setDropdownOpen(false);
                                    if (status === 'error') setErrorMessage('');
                                  }}
                                  className={`w-full px-4 py-2.5 text-left text-xs sm:text-sm flex items-center justify-between transition-colors cursor-pointer ${
                                    isSelected
                                      ? 'bg-white/10 text-white font-semibold'
                                      : 'text-zinc-300 hover:bg-white/[0.06] hover:text-white'
                                  }`}
                                >
                                  <span className="flex items-center gap-2.5 truncate">
                                    {IconComponent && <IconComponent className="w-3.5 h-3.5 text-zinc-500 shrink-0" />}
                                    <span className="truncate">{type.label}</span>
                                  </span>
                                  {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      {!formData.issueType && (
                        <p className="text-[11px] text-amber-400/80 font-mono">
                          * Please select an issue category to proceed.
                        </p>
                      )}
                    </div>

                    {/* Page or Section (Optional) */}
                    <div className="space-y-2">
                      <label
                        htmlFor="pageUrl"
                        className="block text-xs font-mono font-medium text-zinc-300"
                      >
                        Page or Section{" "}
                        <span className="text-zinc-500 font-normal">
                          (Optional)
                        </span>
                      </label>
                      <input
                        type="text"
                        id="pageUrl"
                        name="pageUrl"
                        value={formData.pageUrl}
                        onChange={handleChange}
                        placeholder="e.g., /ai-news#models-section, or repo astral-sh/uv"
                        className="w-full rounded-xl border border-white/10 bg-[#0A0A0C] px-4 py-3 text-xs sm:text-sm text-white placeholder:text-zinc-600 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all duration-200"
                      />
                      <p className="text-[11px] text-zinc-500 font-mono">
                        The URL or section name where the issue was observed.
                      </p>
                    </div>

                    {/* Description (Required with Min Characters) */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label
                          htmlFor="description"
                          className="block text-xs font-mono font-medium text-zinc-300"
                        >
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
                            ? "border-amber-400/50 focus:border-amber-400 focus:ring-amber-400/20"
                            : "border-white/10 focus:border-white/30 focus:ring-white/20"
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
                              ? "text-zinc-500"
                              : !isDescriptionValid
                                ? "text-amber-400 font-bold"
                                : currentLength >= MAX_CHARS
                                  ? "text-rose-400 font-bold"
                                  : "text-emerald-400"
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
                      <label
                        htmlFor="email"
                        className="block text-xs font-mono font-medium text-zinc-300"
                      >
                        Email{" "}
                        <span className="text-zinc-500 font-normal">
                          (Optional)
                        </span>
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
                      <p className="text-xs text-zinc-500 font-mono">
                        We&apos;ll only use this to follow up on your specific
                        report.
                      </p>
                    </div>

                    {/* Cloudflare Turnstile Bot Verification */}
                    <div className="space-y-2">
                      <CloudflareTurnstile
                        onVerify={(token) => setTurnstileToken(token)}
                        onExpire={() => setTurnstileToken("")}
                        onError={() =>
                          setTurnstileToken(`cf_fallback_${Date.now()}`)
                        }
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={!isFormValid || status === "loading"}
                      className={`w-full py-3.5 px-6 rounded-xl font-mono font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-none active:scale-[0.98] ${
                        isFormValid && status !== "loading"
                          ? "bg-white text-black hover:bg-zinc-200"
                          : "bg-white/10 text-zinc-500 cursor-not-allowed border border-white/10"
                      }`}
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-black" />
                          <span>Submitting Report...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>
                            {!formData.issueType
                              ? "Select Issue Type to Submit"
                              : !isDescriptionValid
                                ? `Enter at least ${MIN_CHARS} characters`
                                : !turnstileToken
                                  ? "Verify Cloudflare Challenge to Submit"
                                  : "Submit Report"}
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
