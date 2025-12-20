# Contributing to GitExplorer

Thank you for your interest in contributing to GitExplorer! We welcome contributions from the community to make this project better.

## dynamicCodebase Structure

- **`src/components`**: Reusable UI components.
  - **`ui`**: Basic building blocks (Buttons, Inputs, etc.).
  - **`layouts`**: Structural components (Header, Footer, Hero).
  - **`features`**: Domain-specific logic (RepoCard, Charts).
- **`src/pages`**: Route components (Home, Dashboard).
- **`src/services`**: API and logic layers.
- **`src/styles`**: Global styles and Tailwind configuration.

## Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally:
    ```bash
    git clone https://github.com/your-username/git-explorer.git
    cd git-explorer
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```
4.  **Start the development server**:
    ```bash
    npm run dev
    ```

## Development Workflow

1.  Create a new branch for your feature or fix:
    ```bash
    git checkout -b feature/amazing-feature
    ```
2.  Make your changes.
3.  Run tests (if available) and ensure the build passes:
    ```bash
    npm run build
    ```
4.  Commit your changes using descriptive messages.
5.  Push to your fork and submit a **Pull Request**.

## Code Style

- We use **Prettier** for code formatting.
- Follow **ESLint** rules configured in the project.
- Use functional components and hooks for React.
- Ensure responsive design with Tailwind CSS.

## Reporting Issues

If you find a bug or have a feature request, please open an issue on the [GitHub repository](https://github.com/SahidGit/git-explorer/issues).

Thank you for contributing!
