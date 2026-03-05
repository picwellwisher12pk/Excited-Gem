# Production Release Process

This document outlines the professional workflow for versioning, tagging, and releasing Excited Gem.

## 1. Conventional Commits

To automate versioning and changelog generation, use the following prefix format for your commit messages:

- `feat:` for new features (triggers a **minor** version bump)
- `fix:` for bug fixes (triggers a **patch** version bump)
- `perf:` for performance improvements
- `refactor:` for code changes that neither fix a bug nor add a feature
- `style:` for changes that do not affect the meaning of the code (white-space, formatting, etc.)
- `docs:` for documentation updates
- `chore:` for updating build tasks, package manager configs, etc.
- `feat!:` or `fix!:` (adding a `!`) for breaking changes (triggers a **major** version bump)

**Example:**
`feat: add tab grouping functionality`

## 2. Releasing a New Version

When you are ready to release, follow these steps:

### Automatic Versioning (Recommended)
This uses `standard-version` to update `package.json`, generate `CHANGELOG.md`, and create a git tag.

```bash
# To let the tool decide the version bump based on commits:
npm run release

# To explicitly force a specific bump:
npm run release:patch
npm run release:minor
npm run release:major
```

### Pushing to GitHub
After running the release command locally, push the changes and the new tag:

```bash
git push github develop --tags
```

## 3. CI/CD Workflow

The project is configured with a GitHub Action (located in `.github/workflows/release.yml`) that triggers on every new tag starting with `v*`.

### What the workflow does:
1. **Triggers:** On `git push --tags`.
2. **Builds:** Runs `npm run build` to generate the production extension.
3. **Packages:** Creates a `.zip` file of the extension.
4. **Releases:** Creates a new GitHub Release and attaches the ZIP file.

## 4. Manual Chrome Web Store Upload

Until the CI/CD is fully automated with Store API keys, you can find the production-ready ZIP in the "Releases" section of the GitHub repository after the CI/CD finishes.

1. Download the ZIP from GitHub Releases.
2. Go to the [Chrome Web Store Developer Console](https://chrome.google.com/webstore/devconsole).
3. Select "Excited Gem".
4. Upload the new ZIP file.
