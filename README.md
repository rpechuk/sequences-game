# Sequences - Number Sequence Puzzle Game

A daily number sequence puzzle game where players discover patterns and complete sequences. Built with React, TypeScript, and Vite.

🎮 **[Play Live](https://ron.github.io/sequences/)** *(Update with your GitHub username)*

## Features

- 🧩 Daily number sequence puzzles with various pattern types
- 🎨 Dark mode and high contrast accessibility options
- 📊 Statistics tracking and performance analytics
- 📱 Responsive design for all devices
- 🔄 Automatic daily puzzle generation
- 📅 Archive of previous puzzles

## Development

### Prerequisites

- Node.js 20 or higher
- npm

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Version Management

This project uses semantic versioning (MAJOR.MINOR.PATCH) with automated version management.

### Version Display

Version information is displayed in two places:
- **Settings Modal**: Shows full version with commit hash (e.g., "v1.0.3 • #abc1234")
- **About Modal**: Shows version number only (e.g., "1.0.3")

### Incrementing Versions

Use the following npm scripts to manually bump versions:

```bash
# Increment patch version (1.0.0 → 1.0.1)
npm run version:patch

# Increment minor version (1.0.0 → 1.1.0)
npm run version:minor

# Increment major version (1.0.0 → 2.0.0)
npm run version:major
```

**When to increment:**
- **Patch**: Bug fixes, minor tweaks, content updates
- **Minor**: New features, significant UI changes
- **Major**: Breaking changes, major redesigns

After running a version command:
1. The version is updated in both `version.json` and `package.json`
2. Commit the changes: `git add version.json package.json && git commit -m "chore: bump version to X.Y.Z"`
3. Push to trigger deployment: `git push origin main`

### Automatic Version Management

The CI/CD pipeline automatically:
- **Increments patch version** on every deployment to `main`
- **Injects commit hash** into the build for tracking
- **Updates version files** and commits them back to the repository

## Deployment

### GitHub Pages Setup

1. **Enable GitHub Pages** in your repository:
   - Go to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**

2. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

3. **Monitor deployment**:
   - Go to the **Actions** tab in your repository
   - Watch the "Deploy to GitHub Pages" workflow
   - Once complete, site will be live at: `https://[username].github.io/sequences/`

### Deployment Workflow

Every push to the `main` branch automatically:
1. ✅ Bumps the patch version
2. ✅ Injects the current commit hash
3. ✅ Runs the linter
4. ✅ Builds the production bundle
5. ✅ Deploys to GitHub Pages
6. ✅ Commits version changes back to the repository

### Manual Deployment

You can also trigger a deployment manually:
1. Go to **Actions** tab in GitHub
2. Select **Deploy to GitHub Pages** workflow
3. Click **Run workflow** → **Run workflow**

## Release Process

For significant releases:

1. **Update version appropriately**:
   ```bash
   # For a new feature
   npm run version:minor
   
   # For a major release
   npm run version:major
   ```

2. **Commit version changes**:
   ```bash
   git add version.json package.json
   git commit -m "chore: release v1.1.0"
   ```

3. **Create a git tag** (optional but recommended):
   ```bash
   git tag -a v1.1.0 -m "Release version 1.1.0"
   git push origin v1.1.0
   ```

4. **Push to deploy**:
   ```bash
   git push origin main
   ```

5. **Create GitHub Release** (optional):
   - Go to **Releases** → **Create a new release**
   - Select your tag
   - Add release notes describing changes

## Project Structure

```
sequences/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD workflow
├── src/
│   ├── components/             # React components
│   ├── store/                  # Zustand state management
│   ├── utils/                  # Utility functions
│   │   └── version.ts          # Version information
│   └── ...
├── scripts/
│   └── bump-version.js         # Version increment script
├── version.json                # Version source of truth
├── package.json                # Project metadata
└── vite.config.ts              # Vite configuration

```

## Technologies

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Framer Motion** - Animations
- **date-fns** - Date utilities
- **GitHub Actions** - CI/CD
- **GitHub Pages** - Hosting

## License

This project is private and not licensed for public use.

---

Made with ❤️ for puzzle enthusiasts
