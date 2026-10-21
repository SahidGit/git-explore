/**
 * SPDX License Compatibility Matrix and Documented Evaluation Rules
 *
 * Provides documented open-source compatibility analysis based on FSF, OSI,
 * and standard SPDX license criteria.
 *
 * NOTE: Results are provided as general technical guidance and information only,
 * not legal advice.
 */

export const LICENSE_INFO = {
  'MIT': {
    name: 'MIT License',
    type: 'Permissive',
    spdx: 'MIT',
    url: 'https://spdx.org/licenses/MIT.html',
    fsfApproved: true,
    osiApproved: true,
    copyleft: false,
    patentGrant: false,
    summary: 'Extremely permissive license with minimal restrictions. Allows proprietary use, sublicensing, and modification with preservation of copyright notice.',
  },
  'Apache-2.0': {
    name: 'Apache License 2.0',
    type: 'Permissive with Patent Grant',
    spdx: 'Apache-2.0',
    url: 'https://spdx.org/licenses/Apache-2.0.html',
    fsfApproved: true,
    osiApproved: true,
    copyleft: false,
    patentGrant: true,
    summary: 'Permissive license that explicitly grants contributor patent rights and protects trademarks. Requires notice of changes in modified files.',
  },
  'BSD-3-Clause': {
    name: 'BSD 3-Clause "New" or "Revised" License',
    type: 'Permissive',
    spdx: 'BSD-3-Clause',
    url: 'https://spdx.org/licenses/BSD-3-Clause.html',
    fsfApproved: true,
    osiApproved: true,
    copyleft: false,
    patentGrant: false,
    summary: 'Permissive license with a specific non-endorsement clause prohibiting use of author names for promotional purposes without permission.',
  },
  'BSD-2-Clause': {
    name: 'BSD 2-Clause "Simplified" License',
    type: 'Permissive',
    spdx: 'BSD-2-Clause',
    url: 'https://spdx.org/licenses/BSD-2-Clause.html',
    fsfApproved: true,
    osiApproved: true,
    copyleft: false,
    patentGrant: false,
    summary: 'Simplified permissive license omitting the non-endorsement clause. Highly compatible with other open-source licenses.',
  },
  'ISC': {
    name: 'ISC License',
    type: 'Permissive',
    spdx: 'ISC',
    url: 'https://spdx.org/licenses/ISC.html',
    fsfApproved: true,
    osiApproved: true,
    copyleft: false,
    patentGrant: false,
    summary: 'Functionally equivalent to the two-clause BSD and MIT licenses with simplified language removed of unneeded boilerplate.',
  },
  'GPL-3.0': {
    name: 'GNU General Public License v3.0',
    type: 'Strong Copyleft',
    spdx: 'GPL-3.0',
    url: 'https://spdx.org/licenses/GPL-3.0.html',
    fsfApproved: true,
    osiApproved: true,
    copyleft: true,
    patentGrant: true,
    summary: 'Strong copyleft license requiring combined and derivative works to be released under GPL-3.0. Includes explicit protections against hardware tivoization and patent retaliation.',
  },
  'GPL-2.0': {
    name: 'GNU General Public License v2.0',
    type: 'Strong Copyleft',
    spdx: 'GPL-2.0',
    url: 'https://spdx.org/licenses/GPL-2.0.html',
    fsfApproved: true,
    osiApproved: true,
    copyleft: true,
    patentGrant: false,
    summary: 'Legacy strong copyleft license. If licensed as "GPL-2.0 only", it is strictly incompatible with Apache-2.0 due to patent clause conflicts.',
  },
  'AGPL-3.0': {
    name: 'GNU Affero General Public License v3.0',
    type: 'Network Copyleft',
    spdx: 'AGPL-3.0',
    url: 'https://spdx.org/licenses/AGPL-3.0.html',
    fsfApproved: true,
    osiApproved: true,
    copyleft: true,
    patentGrant: true,
    summary: 'Network copyleft license extending copyleft obligations to users interacting with the software remotely over computer networks (SaaS/Cloud).',
  },
  'LGPL-3.0': {
    name: 'GNU Lesser General Public License v3.0',
    type: 'Weak Copyleft',
    spdx: 'LGPL-3.0',
    url: 'https://spdx.org/licenses/LGPL-3.0.html',
    fsfApproved: true,
    osiApproved: true,
    copyleft: true,
    patentGrant: true,
    summary: 'Weak copyleft license allowing dynamic linking with proprietary applications while requiring modifications to the LGPL library itself to remain open source.',
  },
  'MPL-2.0': {
    name: 'Mozilla Public License 2.0',
    type: 'File-level Weak Copyleft',
    spdx: 'MPL-2.0',
    url: 'https://spdx.org/licenses/MPL-2.0.html',
    fsfApproved: true,
    osiApproved: true,
    copyleft: true,
    patentGrant: true,
    summary: 'File-level copyleft license. Modifications to MPL-covered files must be open-sourced, but new files in the same project can be under proprietary or other licenses.',
  },
  'Unlicense': {
    name: 'The Unlicense',
    type: 'Public Domain Dedication',
    spdx: 'Unlicense',
    url: 'https://spdx.org/licenses/Unlicense.html',
    fsfApproved: true,
    osiApproved: true,
    copyleft: false,
    patentGrant: false,
    summary: 'Dedicated public domain text relinquishing copyright interest worldwide.',
  },
};

/** Normalize common raw strings or SPDX variants into canonical keys */
export const normalizeSpdx = (raw) => {
  if (!raw) return null;
  const s = String(raw).trim();
  const lower = s.toLowerCase();

  if (lower === 'mit') return 'MIT';
  if (lower === 'apache-2.0' || lower === 'apache 2.0' || lower === 'apache-2' || lower === 'apache') return 'Apache-2.0';
  if (lower === 'bsd-3-clause' || lower === 'bsd-3') return 'BSD-3-Clause';
  if (lower === 'bsd-2-clause' || lower === 'bsd-2') return 'BSD-2-Clause';
  if (lower === 'isc') return 'ISC';
  if (lower === 'gpl-3.0' || lower === 'gpl-3.0-only' || lower === 'gpl-3.0-or-later' || lower === 'gplv3') return 'GPL-3.0';
  if (lower === 'gpl-2.0' || lower === 'gpl-2.0-only' || lower === 'gpl-2.0-or-later' || lower === 'gplv2') return 'GPL-2.0';
  if (lower === 'agpl-3.0' || lower === 'agpl-3.0-only' || lower === 'agpl-3.0-or-later' || lower === 'agplv3') return 'AGPL-3.0';
  if (lower === 'lgpl-3.0' || lower === 'lgpl-3.0-only' || lower === 'lgpl-3.0-or-later' || lower === 'lgplv3') return 'LGPL-3.0';
  if (lower === 'mpl-2.0' || lower === 'mplv2.0') return 'MPL-2.0';
  if (lower === 'unlicense') return 'Unlicense';

  return s;
};

/**
 * Compare two license identifiers and evaluate compatibility
 * @param {string} incoming - License of incoming dependency or repository
 * @param {string} target - License of host repository or target project
 */
export const checkLicenseCompatibility = (incoming, target) => {
  const normIncoming = normalizeSpdx(incoming);
  const normTarget = normalizeSpdx(target);

  const incomingInfo = LICENSE_INFO[normIncoming];
  const targetInfo = LICENSE_INFO[normTarget];

  if (!normIncoming || !normTarget) {
    return {
      status: 'unknown',
      level: 'warning',
      badge: 'Manual Review Required',
      title: 'Missing or Unspecified License',
      basis: 'One or both repositories do not provide an explicit SPDX license identifier. Undocumented repositories are all-rights-reserved by default.',
      sourceUrl: 'https://choosealicense.com/no-permission/',
      isKnown: false,
      disclaimer: 'This comparison is provided for general guidance only and does not constitute legal advice.',
    };
  }

  if (!incomingInfo || !targetInfo) {
    return {
      status: 'custom',
      level: 'warning',
      badge: 'Custom License Detected',
      title: `Custom License Review: ${normIncoming} vs ${normTarget}`,
      basis: `One of the licenses (${normIncoming || 'Unknown'} / ${normTarget || 'Unknown'}) is non-standard or custom. Manual review of copyright notices and terms is required.`,
      sourceUrl: 'https://spdx.org/licenses/',
      isKnown: false,
      disclaimer: 'This comparison is provided for general guidance only and does not constitute legal advice.',
    };
  }

  // Same license
  if (normIncoming === normTarget) {
    return {
      status: 'compatible',
      level: 'success',
      badge: 'Directly Compatible',
      title: `Identical Licenses (${normIncoming})`,
      basis: `Both repositories use ${incomingInfo.name}. Code can be combined directly under identical licensing terms.`,
      sourceUrl: incomingInfo.url,
      isKnown: true,
      disclaimer: 'This comparison is provided for general guidance only and does not constitute legal advice.',
    };
  }

  // Both Permissive (MIT, BSD, ISC, Apache-2.0)
  const isIncomingPermissive = !incomingInfo.copyleft;
  const isTargetPermissive = !targetInfo.copyleft;

  if (isIncomingPermissive && isTargetPermissive) {
    return {
      status: 'compatible',
      level: 'success',
      badge: 'Compatible Permissive Mix',
      title: `${normIncoming} can be included in a ${normTarget} project`,
      basis: `Both licenses are permissive. ${incomingInfo.name} terms are fulfilled by retaining original copyright and permission notices. The combined work can be distributed under ${targetInfo.name}.`,
      sourceUrl: targetInfo.url,
      isKnown: true,
      disclaimer: 'This comparison is provided for general guidance only and does not constitute legal advice.',
    };
  }

  // Permissive into Copyleft (e.g. MIT into GPL-3.0 or MPL-2.0)
  if (isIncomingPermissive && targetInfo.copyleft) {
    if (normIncoming === 'Apache-2.0' && normTarget === 'GPL-2.0') {
      return {
        status: 'incompatible',
        level: 'danger',
        badge: 'Incompatible',
        title: 'Apache-2.0 is Incompatible with GPL-2.0-only',
        basis: 'The Free Software Foundation (FSF) documents that Apache 2.0 includes patent termination clauses and indemnification requirements that constitute extra restrictions under GPL-2.0 section 6.',
        sourceUrl: 'https://www.gnu.org/licenses/license-list.html#apache2',
        isKnown: true,
        disclaimer: 'This comparison is provided for general guidance only and does not constitute legal advice.',
      };
    }

    return {
      status: 'compatible-with-conditions',
      level: 'info',
      badge: 'Compatible with Copyleft Terms',
      title: `${normIncoming} permitted under ${normTarget} distribution`,
      basis: `Permissive code from ${normIncoming} can be integrated into a ${normTarget} project. However, the resulting combined binary/distribution must satisfy ${targetInfo.name} copyleft obligations.`,
      sourceUrl: targetInfo.url,
      isKnown: true,
      disclaimer: 'This comparison is provided for general guidance only and does not constitute legal advice.',
    };
  }

  // Copyleft into Permissive (e.g. GPL into MIT)
  if (incomingInfo.copyleft && isTargetPermissive) {
    return {
      status: 'incompatible',
      level: 'danger',
      badge: 'Copyleft Restriction',
      title: `${normIncoming} Cannot Be Sub-licensed under ${normTarget}`,
      basis: `${incomingInfo.name} requires any derivative or combined work to be licensed under ${normIncoming} in its entirety. You cannot re-license a combined work containing ${normIncoming} code under a permissive license like ${normTarget}.`,
      sourceUrl: incomingInfo.url,
      isKnown: true,
      disclaimer: 'This comparison is provided for general guidance only and does not constitute legal advice.',
    };
  }

  // Copyleft into Copyleft (e.g. GPL-3.0 vs AGPL-3.0 or MPL-2.0)
  if (normIncoming === 'GPL-3.0' && normTarget === 'AGPL-3.0') {
    return {
      status: 'compatible-with-conditions',
      level: 'info',
      badge: 'Compatible via AGPL Section 13',
      title: 'GPL-3.0 and AGPL-3.0 Combinations Allowed',
      basis: 'Section 13 of both GPLv3 and AGPLv3 explicitly permits linking modules licensed under GPLv3 and AGPLv3 into a single combined work. The combined work is distributed under AGPL-3.0.',
      sourceUrl: 'https://www.gnu.org/licenses/why-affero-gpl.html',
      isKnown: true,
      disclaimer: 'This comparison is provided for general guidance only and does not constitute legal advice.',
    };
  }

  // Weak copyleft (MPL-2.0 / LGPL-3.0)
  if (normIncoming === 'MPL-2.0' || normIncoming === 'LGPL-3.0') {
    return {
      status: 'compatible-with-conditions',
      level: 'info',
      badge: 'File / Library Scope Allowed',
      title: `File-Level Copyleft (${normIncoming})`,
      basis: `${incomingInfo.name} allows separate files or dynamically linked components to remain under ${normIncoming} while other modules in the same project use ${normTarget}. Modifications to the ${normIncoming} files themselves must remain open.`,
      sourceUrl: incomingInfo.url,
      isKnown: true,
      disclaimer: 'This comparison is provided for general guidance only and does not constitute legal advice.',
    };
  }

  return {
    status: 'incompatible',
    level: 'danger',
    badge: 'Conflicting Copyleft Terms',
    title: `Incompatible Copyleft: ${normIncoming} vs ${normTarget}`,
    basis: `Both ${normIncoming} and ${normTarget} impose reciprocal copyleft requirements that conflict unless an explicit cross-licensing exception exists in the upstream source.`,
    sourceUrl: 'https://www.gnu.org/licenses/license-list.html',
    isKnown: true,
    disclaimer: 'This comparison is provided for general guidance only and does not constitute legal advice.',
  };
};
