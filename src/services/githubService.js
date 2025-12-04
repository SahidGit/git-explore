import axios from 'axios';

const GITHUB_API_BASE = import.meta.env.VITE_GITHUB_API_URL || 'https://api.github.com';

const api = axios.create({
    baseURL: GITHUB_API_BASE,
    headers: {
        Accept: 'application/vnd.github.v3+json',
    },
});

export const setGithubToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `token ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export const searchRepositories = async ({ query, sort = 'stars', order = 'desc', page = 1, perPage = 30 }) => {
    const q = query || 'stars:>1000';
    const response = await api.get('/search/repositories', {
        params: {
            q,
            sort,
            order,
            page,
            per_page: perPage,
        },
    });
    return response.data;
};

export const getTrendingRepositories = async (language = '', since = 'daily', page = 1) => {
    // Note: GitHub API doesn't have a direct "trending" endpoint like the website.
    // We simulate it by searching for created date.
    const date = new Date();
    if (since === 'daily') date.setDate(date.getDate() - 1);
    else if (since === 'weekly') date.setDate(date.getDate() - 7);
    else if (since === 'monthly') date.setMonth(date.getMonth() - 1);

    const dateStr = date.toISOString().split('T')[0];
    const query = `created:>${dateStr}${language ? ` language:${language}` : ''}`;

    return searchRepositories({ query, sort: 'stars', order: 'desc', page });
};

export const getRepositoryDetails = async (owner, repo) => {
    const [repoData, languages, contributors] = await Promise.all([
        api.get(`/repos/${owner}/${repo}`),
        api.get(`/repos/${owner}/${repo}/languages`),
        api.get(`/repos/${owner}/${repo}/contributors?per_page=10`),
    ]);

    return {
        ...repoData.data,
        languages: languages.data,
        contributors: contributors.data,
    };
};

export const getRepositoryActivity = async (owner, repo) => {
    const response = await api.get(`/repos/${owner}/${repo}/stats/commit_activity`);
    // GitHub returns 202 if stats are being computed, so we might get empty array or need to retry.
    // For simplicity, we return the data if available or empty array.
    return Array.isArray(response.data) ? response.data : [];
};

export const getUserContributions = async (username) => {
    const response = await axios.get(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
    return response.data;
};

export const getUser = async (username) => {
    const response = await api.get(`/users/${username}`);
    return response.data;
};

export const getIssueStats = async (owner, repo) => {
    try {
        // We already have open_issues_count from repo details, but that includes PRs.
        // Let's get strict issue counts.
        const [openIssues, closedIssues] = await Promise.all([
            api.get(`/search/issues?q=repo:${owner}/${repo}+type:issue+state:open`),
            api.get(`/search/issues?q=repo:${owner}/${repo}+type:issue+state:closed`)
        ]);

        return {
            open: openIssues.data.total_count,
            closed: closedIssues.data.total_count
        };
    } catch {
        // Error handled by caller
        return { open: 0, closed: 0 };
    }
};
