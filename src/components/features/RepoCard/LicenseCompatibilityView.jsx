import React, { useState } from 'react';
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Info,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { checkLicenseCompatibility, normalizeSpdx, LICENSE_INFO } from '../../../data/licenseCompatibility';

const LicenseCompatibilityView = ({ repo, details }) => {
  const repoSpdx = repo.license?.spdx_id || details?.license?.spdx_id || repo.license?.key || '';
  const normalizedRepoLicense = normalizeSpdx(repoSpdx);

  // User target project selection
  const [targetLicense, setTargetLicense] = useState('MIT');

  const TARGET_LICENSES = [
    { spdx: 'MIT', label: 'MIT (Permissive)' },
    { spdx: 'Apache-2.0', label: 'Apache-2.0 (Permissive + Patents)' },
    { spdx: 'BSD-3-Clause', label: 'BSD-3-Clause' },
    { spdx: 'GPL-3.0', label: 'GPL-3.0 (Strong Copyleft)' },
    { spdx: 'AGPL-3.0', label: 'AGPL-3.0 (Network Copyleft)' },
    { spdx: 'LGPL-3.0', label: 'LGPL-3.0 (Weak Copyleft)' },
    { spdx: 'MPL-2.0', label: 'MPL-2.0 (File-level Copyleft)' },
  ];

  const analysis = checkLicenseCompatibility(normalizedRepoLicense, targetLicense);

  const owner = repo.owner?.login || repo.full_name?.split('/')[0] || '';
  const repoName = repo.name || repo.full_name?.split('/')[1] || '';
  const licenseFileUrl = repo.html_url
    ? `${repo.html_url}/blob/HEAD/LICENSE`
    : `https://github.com/${owner}/${repoName}/blob/HEAD/LICENSE`;

  const repoLicenseInfo = LICENSE_INFO[normalizedRepoLicense];

  return (
    <div className="space-y-4 font-sans text-left">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-black/40 border border-white/[0.08]">
        <div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Scale className="w-3.5 h-3.5 text-blue-400" />
            <span>Open Source License & Compatibility Checker</span>
          </h3>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            SPDX evaluation of copyright, patent terms, and copyleft compatibility.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={licenseFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-[11px] font-mono text-zinc-300 hover:text-white transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Inspect LICENSE on GitHub</span>
            <ExternalLink className="w-3 h-3 text-zinc-500" />
          </a>
        </div>
      </div>

      {/* Repository license summary card */}
      <div className="p-4 rounded-xl bg-[#0A0A0D] border border-white/[0.08] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
            Repository Declared License
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
              repoLicenseInfo
                ? repoLicenseInfo.copyleft
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
            }`}
          >
            {normalizedRepoLicense || 'Unspecified License'}
          </span>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed">
          {repoLicenseInfo
            ? repoLicenseInfo.summary
            : 'No standardized SPDX license identifier was detected in repository metadata. Without an explicit license grant, standard copyright all-rights-reserved terms apply.'}
        </p>

        {repoLicenseInfo && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/[0.05] text-[11px] font-mono">
            <div>
              <span className="text-zinc-500 block text-[10px]">Category</span>
              <span className="text-zinc-200 font-semibold">{repoLicenseInfo.type}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px]">OSI Approved</span>
              <span className="text-emerald-400 font-semibold">{repoLicenseInfo.osiApproved ? 'Yes' : 'No'}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px]">FSF Approved</span>
              <span className="text-blue-400 font-semibold">{repoLicenseInfo.fsfApproved ? 'Yes' : 'No'}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px]">Patent Clause</span>
              <span className="text-zinc-300 font-semibold">{repoLicenseInfo.patentGrant ? 'Explicit Grant' : 'None'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Target Project License Selector & Compatibility Evaluation */}
      <div className="p-4 rounded-xl bg-[#0A0A0D] border border-white/[0.08] space-y-4">
        <div>
          <label htmlFor="target-license-select" className="block text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
            Evaluate integration into your project licensed under:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {TARGET_LICENSES.map((lic) => (
              <button
                key={lic.spdx}
                type="button"
                onClick={() => setTargetLicense(lic.spdx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                  targetLicense === lic.spdx
                    ? 'bg-blue-600 text-white font-bold border-blue-500 shadow-sm'
                    : 'bg-white/[0.03] text-zinc-400 border-white/10 hover:border-white/20 hover:text-white'
                }`}
              >
                {lic.label}
              </button>
            ))}
          </div>
        </div>

        {/* Compatibility Result Card */}
        <div
          className={`p-4 rounded-xl border space-y-2.5 ${
            analysis.level === 'success'
              ? 'bg-emerald-500/5 border-emerald-500/25'
              : analysis.level === 'danger'
              ? 'bg-rose-500/5 border-rose-500/25'
              : 'bg-amber-500/5 border-amber-500/25'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {analysis.level === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : analysis.level === 'danger' ? (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <h4
                className={`text-xs font-mono font-bold uppercase tracking-wider ${
                  analysis.level === 'success'
                    ? 'text-emerald-400'
                    : analysis.level === 'danger'
                    ? 'text-rose-400'
                    : 'text-amber-400'
                }`}
              >
                {analysis.title}
              </h4>
            </div>

            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-semibold shrink-0 ${
                analysis.level === 'success'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : analysis.level === 'danger'
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}
            >
              {analysis.badge}
            </span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            {analysis.basis}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] text-[10px] font-mono text-zinc-400">
            <span>Evaluation basis: Documented SPDX & FSF criteria</span>
            {analysis.sourceUrl && (
              <a
                href={analysis.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Read standard text</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Prominent Legal Disclaimer */}
      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-2.5 text-[11px] text-zinc-400 leading-relaxed">
        <Info className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-zinc-300 font-mono text-[10px] uppercase block tracking-wider mb-0.5">
            Legal Disclaimer
          </strong>
          {analysis.disclaimer} Always consult intellectual property legal counsel for proprietary distribution, combined derivative works, or patent licensing compliance.
        </div>
      </div>
    </div>
  );
};

export default LicenseCompatibilityView;
