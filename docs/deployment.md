# Deployment & Infrastructure Guide

## 1. Authoritative Production Hosting

ExploreGit's official, canonical production deployment is hosted on **Vercel**:

- **Production URL**: [https://exploregit.vercel.app](https://exploregit.vercel.app)
- **Framework Preset**: Vite
- **Node.js Version**: 20.x
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Configuration**: [`vercel.json`](../vercel.json)

All canonical URLs, OpenGraph metadata, `robots.txt`, and `sitemap.xml` point authoritatively to `https://exploregit.vercel.app`.

---

## 2. Vercel Architecture & Routing

ExploreGit runs as a high-performance single-page application (SPA) powered by React and Vite on Vercel's global edge network.

Routing is defined in [`vercel.json`](../vercel.json):

```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [
    { "source": "/api", "destination": "/api" },
    { "source": "/api/(.*)", "destination": "/api" },
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

- **SPA Rewrites**: All client routes (`/dashboard`, `/languages`, `/gems`, `/report`, `/cheatsheet`) rewrite to `/index.html` for client-side routing via React Router.
- **Serverless API**: Requests prefixed with `/api/*` are handled by [`api/index.js`](../api/index.js), which invokes the Express application.

---

## 3. Environment Variables

Configure these in the **Vercel Dashboard → Project Settings → Environment Variables**:

| Variable | Required | Description |
|---|---|---|
| `VITE_GITHUB_TOKEN` | Optional | GitHub Personal Access Token to increase client-side rate limits from 60 to 5,000 req/hr. |
| `MONGODB_URI` | Optional | MongoDB connection string (e.g. MongoDB Atlas) if running server-side persistent report storage. |
| `CLOUDFLARE_TURNSTILE_SECRET_KEY` | Optional | Cloudflare Turnstile server secret if running backend bot verification. |
| `UPSTASH_REDIS_REST_URL` | Optional | Upstash Redis REST endpoint for cross-instance distributed serverless rate limiting. |
| `UPSTASH_REDIS_REST_TOKEN` | Optional | Upstash Redis REST access token. |

---

## 4. Continuous Integration (CI)

Pull requests and direct commits to the `main` branch are automatically validated using GitHub Actions in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml):

- **Job**: `Build & Lint Check`
- **Node Version**: 20.x with automated npm dependency caching.
- **Verification**: Executes `npm ci` followed by `npm run build` to ensure every merge is production-ready.

Once changes are merged into `main`, Vercel's native GitHub integration triggers an atomic production deployment.

---

## 5. Local Development

To run ExploreGit locally:

```bash
# Install dependencies
npm install

# Start local Vite development server
npm run dev
```

Open `http://localhost:5173` in your browser.
