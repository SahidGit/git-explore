# Deployment Guide

ExploreGit is configured for automated deployment to GitHub Pages using GitHub Actions.

## Prerequisites

1. A GitHub repository hosting the project.
2. `npm` installed locally for building.

## Automated Deployment (Recommended)

The project includes a GitHub Actions workflow `.github/workflows/deploy.yml` that handles deployment automatically.

### Steps:

1. **Push to Main**: Ensure your changes are committed and pushed to the `main` branch.
   ```bash
   git push origin main
   ```

2. **Check Actions**: Go to the "Actions" tab in your GitHub repository to see the deployment progress.

3. **Verify**: Once the workflow completes, your site will be live at `https://<your-username>.github.io/git-explorer/`.

## Manual Deployment

If you prefer to deploy manually:

1. **Build**: Run the build command to generate the `dist` folder.
   ```bash
   npm run build
   ```

2. **Deploy**: Use the `gh-pages` package (if installed) or manually upload the `dist` folder contents to your hosting provider.

## Configuration

- **Base URL**: If deploying to a subdirectory (e.g., `https://user.github.io/repo/`), ensure `vite.config.js` has the correct `base` property set.
  ```javascript
  export default defineConfig({
    base: '/git-explorer/',
    // ...
  })
  ```
