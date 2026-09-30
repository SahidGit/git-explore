/**
 * Open Source Repository Health & Security Scorecard Calculator
 * Evaluates repository metadata, commit activity, issues, and license compliance.
 */

export const calculateRepoHealth = (repo, details, activity, issueStats) => {
    if (!repo) {
        return {
            totalScore: null,
            grade: 'N/A',
            color: '#71717A',
            licenseScore: 0,
            commitScore: 0,
            issueScore: 0,
            communityScore: 0,
            findings: ['No repository metadata available to evaluate'],
        };
    }

    let licenseScore = 0;
    let commitScore = 0;
    let issueScore = 0;
    let communityScore = 0;
    const findings = [];

    // 1. License & Security Transparency (Max 25 pts)
    const spdx = details?.license?.spdx_id || repo.license?.spdx_id || repo.license?.key || '';
    const spdxLower = spdx.toLowerCase();

    if (['mit', 'apache-2.0', 'bsd-3-clause', 'bsd-2-clause', 'isc'].includes(spdxLower)) {
        licenseScore = 25;
        findings.push('Permissive Open Source License (' + (spdx.toUpperCase() || 'MIT') + ')');
    } else if (spdxLower.includes('gpl') || spdxLower.includes('mpl') || spdxLower.includes('lgpl')) {
        licenseScore = 20;
        findings.push('Standard Copyleft Open Source License');
    } else if (spdx) {
        licenseScore = 15;
        findings.push('Custom / Open Source License Defined');
    } else {
        licenseScore = 8;
        findings.push('No explicit SPDX license tag found');
    }

    // 2. Commit & Release Rhythm (Max 25 pts)
    const weeks = Array.isArray(activity) ? activity.slice(-12) : [];
    const totalRecentCommits = weeks.reduce((sum, w) => sum + (w.total || 0), 0);
    const activeWeeksCount = weeks.filter((w) => w.total > 0).length;

    if (activeWeeksCount >= 8 || totalRecentCommits > 100) {
        commitScore = 25;
        findings.push('High Commit Velocity (' + totalRecentCommits + ' commits / 12 wks)');
    } else if (activeWeeksCount >= 4 || totalRecentCommits > 30) {
        commitScore = 20;
        findings.push('Steady Commit Activity');
    } else if (totalRecentCommits > 0) {
        commitScore = 14;
        findings.push('Moderate / Occasional Commit Activity');
    } else {
        commitScore = 10;
        findings.push('Low / Inactive Recent Commits');
    }

    // 3. Issue Resolution Tempo (Max 25 pts)
    const openIssues = typeof issueStats?.open === 'number' ? issueStats.open : (repo.open_issues_count ?? 0);
    const hasClosedData = typeof issueStats?.closed === 'number';
    const closedIssues = hasClosedData ? issueStats.closed : 0;

    if (hasClosedData && (openIssues + closedIssues > 0)) {
        const resolutionRatio = closedIssues / (openIssues + closedIssues);
        if (resolutionRatio >= 0.75) {
            issueScore = 25;
            findings.push('Excellent Issue Resolution Tempo (' + Math.round(resolutionRatio * 100) + '% closed)');
        } else if (resolutionRatio >= 0.5) {
            issueScore = 20;
            findings.push('Good Issue Triage Rhythms (' + Math.round(resolutionRatio * 100) + '% closed)');
        } else {
            issueScore = 14;
            findings.push('Active Open Issues Pending Resolution');
        }
    } else {
        // Evaluate based on open issues backlog size when closed count is unknown
        if (openIssues <= 10) {
            issueScore = 22;
            findings.push('Low Open Issue Backlog (' + openIssues + ' open)');
        } else if (openIssues <= 50) {
            issueScore = 18;
            findings.push('Moderate Open Issue Backlog (' + openIssues + ' open)');
        } else {
            issueScore = 14;
            findings.push('Large Issue Backlog (' + openIssues + ' open)');
        }
    }

    // 4. Community & Contributor Signal (Max 25 pts)
    const stars = repo.stargazers_count || repo.stars || 0;
    const forks = repo.forks_count || repo.forks || 0;
    const contribCount = details?.contributors?.length || 1;

    if (stars > 10000 && forks > 1000) {
        communityScore = 25;
        findings.push('Top-Tier Ecosystem Popularity (' + (stars / 1000).toFixed(1) + 'k stars)');
    } else if (stars > 1000) {
        communityScore = 22;
        findings.push('Strong Community Adoption');
    } else if (stars > 100) {
        communityScore = 18;
        findings.push('Growing Developer Interest');
    } else {
        communityScore = 14;
        findings.push('Early Stage / Niche Project');
    }

    if (contribCount >= 5) {
        findings.push('Distributed Maintainer Base (' + contribCount + '+ contributors)');
    }

    const totalScore = licenseScore + commitScore + issueScore + communityScore;

    let grade = 'B';
    let color = '#06B6D4'; // Cyan

    if (totalScore >= 92) {
        grade = 'A+';
        color = 'oklch(62.7% 0.194 149.214)';
    } else if (totalScore >= 84) {
        grade = 'A';
        color = 'oklch(62.7% 0.194 149.214)';
    } else if (totalScore >= 72) {
        grade = 'B';
        color = '#06B6D4'; // Cyan
    } else if (totalScore >= 60) {
        grade = 'C';
        color = '#F59E0B'; // Amber
    } else {
        grade = 'D';
        color = '#EF4444'; // Red
    }

    return {
        totalScore,
        grade,
        color,
        licenseScore,
        commitScore,
        issueScore,
        communityScore,
        findings,
    };
};
