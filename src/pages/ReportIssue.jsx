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
  ShieldAlert,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Home,
  ChevronDown,
  Check,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";
import Header from "../components/layouts/Header";
import { SubFooter } from "../components/layouts/Footer";
import BackToTop from "../components/ui/BackToTop";
import SEO from "../components/ui/SEO";
import PageNavigation from "../components/ui/PageNavigation";
import { Link, useNavigate } from "react-router-dom";
import { ReportIssueIcon } from "../components/ui/Icons";

const ISSUE_TYPES = [
  // ─── 1. Platform & Repository Discovery ─────────────────────────────
  {
    group: "Platform & Discovery",
    value: "Search & Filtering Bug",
    label: "Search & Filtering Bug (Query, tags, language dropdowns, sorting)",
    icon: Bug,
    githubLabels: "bug,discovery",
  },
  {
    group: "Platform & Discovery",
    value: "Data & Telemetry Discrepancy",
    label: "Data & Telemetry Discrepancy (Stars, forks, trending velocity, language totals)",
    icon: FileText,
    githubLabels: "bug,telemetry",
  },
  {
    group: "Platform & Discovery",
    value: "GitHub API & Rate Limits",
    label: "GitHub API & Rate Limits (PAT authentication, 403 quota, token connection)",
    icon: HelpCircle,
    githubLabels: "bug,api",
  },

  // ─── 2. Curated Gems & Open-Source Tools ───────────────────────────
  {
    group: "Gems & Tooling",
    value: "Gems: Broken Link or Outdated Tool",
    label: "Gems: Broken Link or Outdated Specs (Dead repo, demo, or download link)",
    icon: Link2,
    githubLabels: "bug,gems",
  },
  {
    group: "Gems & Tooling",
    value: "Gems: Suggest New Open-Source Gem",
    label: "Gems: Suggest New Open-Source Tool (Nominate high-signal repository)",
    icon: Sparkles,
    githubLabels: "enhancement,gems",
  },
  {
    group: "Gems & Tooling",
    value: "Gems: Malicious or Deceptive Tool",
    label: "Gems: Malicious or Deceptive Tool (Security risk, malware, misleading license)",
    icon: ShieldAlert,
    githubLabels: "security,gems",
  },

  // ─── 3. User Interface & Local Storage ──────────────────────────────
  {
    group: "UI & Storage",
    value: "UI, Layout or Responsive Glitch",
    label: "UI, Layout or Responsive Glitch (Mobile rendering, dark theme, styling bug)",
    icon: Bug,
    githubLabels: "bug,ui",
  },
  {
    group: "UI & Storage",
    value: "Bookmarks & Storage Bug",
    label: "Bookmarks & Storage Bug (Saved repositories, JSON/CSV export, local persistence)",
    icon: Bug,
    githubLabels: "bug,storage",
  },

  // ─── 4. Enhancements & Contributions ────────────────────────────────
  {
    group: "Feedback & Community",
    value: "Feature Request / Enhancement",
    label: "Feature Request / Enhancement (New intelligence metrics, view modes, filters)",
    icon: Lightbulb,
    githubLabels: "enhancement",
  },
  {
    group: "Feedback & Community",
    value: "Documentation or Typo Fix",
    label: "Documentation or Typo Fix (Guides, cheatsheets, tooltips, README)",
    icon: FileText,
    githubLabels: "documentation",
  },
  {
    group: "Feedback & Community",
    value: "Security & Vulnerability Disclosure",
    label: "Security & Vulnerability Disclosure (Responsible disclosure, token handling)",
    icon: AlertTriangle,
    githubLabels: "security",
  },
  {
    group: "Feedback & Community",
    value: "Other / General Feedback",
    label: "Other / General Feedback (Suggestions, questions, community input)",
    icon: HelpCircle,
    githubLabels: "feedback",
  },
];

const GITHUB_REPO_ISSUES_URL = "https://github.com/SahidGit/git-explore/issues/new";

const ISSUE_LABELS = Object.fromEntries(
  ISSUE_TYPES.map((item) => [item.value, item.githubLabels])
);

const generateGitHubIssueUrl = ({ issueType, pageUrl, description, email }) => {
  const firstLine = description.split("\n")[0].replace(/[#*`_]/g, "").trim();
  const shortSummary =
    firstLine.length > 60 ? `${firstLine.slice(0, 57)}...` : firstLine;
  const title = `[${issueType || "Feedback"}] ${shortSummary || "Community Report"}`;

  const body = `### Issue Category
${issueType || "Not specified"}

### Affected Page or Section
${pageUrl ? pageUrl : "Not specified"}

### Description
${description}

### Additional Information
- **Reported via**: ExploreGit Web App
- **User Agent**: ${typeof navigator !== "undefined" ? navigator.userAgent : "Web"}
${email ? `- **Contact Email**: ${email}` : ""}
`;

  const labels = ISSUE_LABELS[issueType] || "feedback";
  const params = new URLSearchParams({
    title,
    body,
    labels,
  });

  return `${GITHUB_REPO_ISSUES_URL}?${params.toString()}`;
};

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

  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [generatedIssueUrl, setGeneratedIssueUrl] = useState("");

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
  const isFormValid = formData.issueType !== "" && isDescriptionValid;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "description" && value.length > MAX_CHARS) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status === "error") setErrorMessage("");
  };

  const handleSubmit = (e) => {
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

    try {
      const issueUrl = generateGitHubIssueUrl(formData);
      setGeneratedIssueUrl(issueUrl);

      // Record locally in browser history for private audit ledger
      const localReport = {
        id: `report_${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...formData,
        destination: "GitHub Issues",
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

      // Open GitHub Issues with prefilled parameters
      window.open(issueUrl, "_blank", "noopener,noreferrer");

      setStatus("success");
      setSuccessMessage(
        "We have prepared and opened your issue on GitHub in a new tab! Review the prefilled details and click 'Submit new issue' on GitHub.",
      );
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err.message || "An error occurred while preparing your GitHub issue.",
      );
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setErrorMessage("");
    setSuccessMessage("");
    setGeneratedIssueUrl("");
    setFormData({
      issueType: "",
      pageUrl: "",
      description: "",
      email: "",
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0C] text-white font-sans selection:bg-white/20 selection:text-white">
      <SEO
        title="Report an Issue · ExploreGit"
        description="Report incorrect data, broken links, or request new features for ExploreGit."
        canonical="https://exploregit.vercel.app/report"
      />
      <Header showBackButton={true} />

      <main className="relative z-0 flex-1 overflow-hidden pt-28 sm:pt-32">
        {/* ── Section 1: Hero & Form Container (Entire.io Frame Style) ── */}
        <section className="border-b border-white/10">
          <div className="mx-auto w-full max-w-[1280px] border-white/10 min-[1280px]:border-x px-6 py-12 md:px-20">
            <div className="mx-auto flex w-full max-w-[720px] flex-col gap-6">
              {/* Back Link */}
              <div>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-xs font-sans font-medium text-zinc-400 hover:text-white transition-colors group"
                >
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
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

                {/* Header with BETA tag and Showcase SVG */}
                <div className="text-center sm:text-left mb-8 pb-6 border-b border-white/[0.06] relative z-10">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-3">
                    <div className="p-2 rounded-2xl bg-amber-400/10 border border-amber-400/20 shrink-0">
                      <ReportIssueIcon className="w-10 h-10" size={40} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
                          Report an Issue / Suggestion
                        </h1>
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-xs font-sans font-semibold text-amber-400 uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          Beta
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl font-sans font-normal">
                        Report incorrect telemetry data, broken arXiv links, model price discrepancies, or feature suggestions for ExploreGit &amp; AI Newsroom.
                      </p>
                    </div>
                  </div>
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
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white font-mono text-xs font-semibold tracking-wider uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>PREFILLED FOR GITHUB</span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-tight">
                        Report Ready on GitHub!
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-400 font-sans max-w-md mx-auto leading-relaxed">
                        {successMessage}
                      </p>
                    </div>

                    {/* Low-profile Glass Pill Buttons */}
                    <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3 font-sans text-xs">
                      {generatedIssueUrl && (
                        <a
                          href={generatedIssueUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 active:scale-[0.98] transition-all duration-200 font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-none"
                        >
                          <span>Open Issue on GitHub</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={handleReset}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.12] text-white hover:bg-white/[0.08] hover:border-white/25 active:scale-[0.98] transition-all duration-200 font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-none"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Submit Another Report</span>
                      </button>

                      <Link
                        to="/dashboard"
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.12] text-white hover:bg-white/[0.08] hover:border-white/25 active:scale-[0.98] transition-all duration-200 font-semibold flex items-center justify-center gap-2 shadow-none"
                      >
                        <Home className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Return to Explorer</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Direct GitHub Access Banner */}
                    <div className="mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans">
                      <div className="flex items-center gap-2.5 text-zinc-300">
                        <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-amber-400 shrink-0">
                          <Bug className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">Direct GitHub Issues</p>
                          <p className="text-zinc-400 text-[11px]">Submissions are published directly to our open-source repo.</p>
                        </div>
                      </div>
                      <a
                        href="https://github.com/SahidGit/git-explore/issues/new"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-all shrink-0 cursor-pointer"
                      >
                        <span>Blank Issue</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    {/* Form */}
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
                            className="absolute z-50 mt-1.5 w-full bg-[#121215] rounded-xl border border-white/10 shadow-2xl py-1.5 max-h-72 overflow-y-auto animate-fadeIn backdrop-blur-xl divide-y divide-white/[0.04]"
                          >
                            {ISSUE_TYPES.map((type, idx) => {
                              const isSelected = formData.issueType === type.value;
                              const IconComponent = type.icon;
                              const showGroupHeader = idx === 0 || type.group !== ISSUE_TYPES[idx - 1].group;
                              return (
                                <React.Fragment key={type.value}>
                                  {showGroupHeader && (
                                    <div className="px-4 pt-2.5 pb-1 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold bg-white/[0.01]">
                                      {type.group}
                                    </div>
                                  )}
                                  <button
                                    type="button"
                                    role="option"
                                    aria-selected={isSelected}
                                    onClick={() => {
                                      setFormData((prev) => ({ ...prev, issueType: type.value }));
                                      setDropdownOpen(false);
                                      if (status === 'error') setErrorMessage('');
                                    }}
                                    className={`w-full px-4 py-2 text-left text-xs sm:text-sm flex items-center justify-between transition-colors cursor-pointer ${
                                      isSelected
                                        ? 'bg-white/10 text-white font-semibold'
                                        : 'text-zinc-300 hover:bg-white/[0.06] hover:text-white'
                                    }`}
                                  >
                                    <span className="flex items-center gap-2.5 truncate">
                                      {IconComponent && <IconComponent className="w-3.5 h-3.5 text-zinc-400 shrink-0" />}
                                      <span className="truncate">{type.label}</span>
                                    </span>
                                    {isSelected && <Check className="w-4 h-4 text-[#4397E0] shrink-0 ml-2" />}
                                  </button>
                                </React.Fragment>
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
                                  : "text-zinc-400"
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
                      <ExternalLink className="w-4 h-4" />
                      <span>
                        {!formData.issueType
                          ? "Select Issue Type to Submit"
                          : !isDescriptionValid
                            ? `Enter at least ${MIN_CHARS} characters`
                            : "Open & Submit on GitHub"}
                      </span>
                    </button>
                  </form>
                  </div>
                )}
              </div>

              {/* Page Navigation Redirection */}
              <PageNavigation currentKey="report" />
            </div>
          </div>
        </section>
      </main>

      <BackToTop />
      <SubFooter hideReportButton={true} />
    </div>
  );
};

export default ReportIssue;
