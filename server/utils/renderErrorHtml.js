/**
 * Renders brand-styled server-side HTML error pages matching Entire.io aesthetics.
 * Ensures search engines (Google, Bing) receive proper status codes & noindex directives.
 */

const getErrorPageData = (statusCode, customMessage) => {
    switch (statusCode) {
        case 404:
            return {
                code: '404',
                title: 'Page not found',
                description: customMessage || "The page you are looking for doesn't exist or has been moved.",
                buttonText: 'Home',
                buttonHref: '/'
            };
        case 400:
            return {
                code: '400',
                title: 'Bad request',
                description: customMessage || 'The server could not understand the request due to invalid syntax.',
                buttonText: 'Home',
                buttonHref: '/'
            };
        case 401:
        case 403:
            return {
                code: statusCode.toString(),
                title: 'Access denied',
                description: customMessage || 'You do not have permission to access the requested resource.',
                buttonText: 'Home',
                buttonHref: '/'
            };
        case 429:
            return {
                code: '429',
                title: 'Too many requests',
                description: customMessage || 'Rate limit exceeded. Please wait a few moments before trying again.',
                buttonText: 'Retry',
                buttonHref: 'javascript:window.location.reload()'
            };
        case 503:
            return {
                code: '503',
                title: 'Service unavailable',
                description: customMessage || 'The server is temporarily unavailable or undergoing maintenance.',
                buttonText: 'Refresh',
                buttonHref: 'javascript:window.location.reload()'
            };
        case 500:
        default:
            return {
                code: '500',
                title: 'Something went wrong',
                description: customMessage || 'An unexpected error occurred. Please try refreshing the page.',
                buttonText: 'Refresh',
                buttonHref: '/'
            };
    }
};

const renderErrorHtml = (statusCode = 500, message = null) => {
    const data = getErrorPageData(statusCode, message);

    return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex, nofollow" />
    <title>${data.code} · ${data.title} · ExploreGit</title>
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet" />
    <style>
        *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            background-color: #101012;
            color: #ffffff;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
        }
        .container {
            text-align: center;
            padding: 1.5rem;
            max-width: 32rem;
            margin: 0 auto;
        }
        .error-code {
            font-family: 'JetBrains Mono', monospace;
            font-size: 3.75rem;
            line-height: 1;
            font-weight: 700;
            letter-spacing: -0.025em;
            color: #ffffff;
            margin-bottom: 1rem;
        }
        .error-title {
            font-size: 1.5rem;
            font-weight: 600;
            line-height: 1.3;
            color: #ffffff;
            margin-bottom: 0.75rem;
        }
        .error-desc {
            font-size: 0.95rem;
            line-height: 1.6;
            color: #a1a1aa;
            margin-bottom: 1.75rem;
        }
        .action-btn {
            display: inline-block;
            background-color: #f4f4f5;
            color: #121215;
            font-family: 'Inter', sans-serif;
            font-weight: 500;
            font-size: 0.875rem;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            text-decoration: none;
            cursor: pointer;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: background-color 0.15s ease, transform 0.1s ease;
        }
        .action-btn:hover {
            background-color: #ffffff;
        }
        .action-btn:active {
            transform: scale(0.98);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="error-code">${data.code}</h1>
        <h2 class="error-title">${data.title}</h2>
        <p class="error-desc">${data.description}</p>
        <div>
            <a href="${data.buttonHref}" class="action-btn">${data.buttonText}</a>
        </div>
    </div>
</body>
</html>`;
};

module.exports = { renderErrorHtml, getErrorPageData };
