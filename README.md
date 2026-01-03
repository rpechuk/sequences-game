<div align="center">
  <h1>Sequences</h1>
  <h3>Number Sequence Puzzle Game</h3>
  
  <p>
    A daily puzzle game where players discover patterns and complete hidden number sequences.
    <br />
    Built with modern web technologies for a smooth, responsive experience.
  </p>

  <p>
    <a href="https://rpechuk.github.io/sequences-game/">
      <img src="https://img.shields.io/badge/PLAY_NOW-2563EB?style=for-the-badge&logo=rocket&logoColor=white" alt="Play Live" />
    </a>
  </p>

  <div>
    <img src="https://img.shields.io/badge/vibecoded-⚡-ff00ff?style=flat-square" alt="Vibecoded" />
    <img src="https://img.shields.io/github/package-json/v/rpechuk/sequences-game?style=flat-square&color=blue" alt="Version" />
    <img src="https://img.shields.io/github/actions/workflow/status/rpechuk/sequences-game/deploy.yml?style=flat-square" alt="Build Status" />
    <img src="https://img.shields.io/github/last-commit/rpechuk/sequences-game?style=flat-square&color=orange" alt="Last Commit" />
  </div>
</div>

<br />

## 🌟 Features

- **🧩 Daily Puzzles**: New challenges every day with varied pattern types (Arithmetic, Geometric, Fibonacci, Primes, etc.).
- **🎨 Modern Aesthetics**: Clean, minimalistic UI with full **Dark Mode** and **High Contrast** support.
- **📊 Detailed Analytics**: Track your solve rate, streaks, and guess history.
- **📱 Fully Responsive**: Optimized experience for both desktop and mobile devices.
- **🔄 Auto-Generation**: Self-sustaining puzzle generation ensures fresh content daily.
- **📅 Puzzle Archive**: Browse and replay previous days' puzzles.

## 🛠 Tech Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **CI/CD**: GitHub Actions & Pages

## 📂 Project Structure

```bash
sequences/
├── .github/
│   └── workflows/      # CI/CD pipelines
├── src/
│   ├── components/     # React functional components
│   ├── store/          # Zustand store definitions
│   ├── utils/          # Helper functions & game logic
│   └── ...
├── scripts/            # Build & maintenance scripts
└── ...
```

## 💻 Development

### Prerequisites
- Node.js 20+
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
```

## 📦 Version Management

This project uses semantic versioning (**MAJOR.MINOR.PATCH**) with automated workflows.

### Manual Bumps
Use the predefined scripts to update the version locally:

```bash
npm run version:patch  # 1.0.0 → 1.0.1 (Bug fixes)
npm run version:minor  # 1.0.0 → 1.1.0 (New features)
npm run version:major  # 1.0.0 → 2.0.0 (Breaking changes)
```

After bumping the version, you need to commit and push the changes:

```bash
git add version.json package.json
git commit -m "chore: bump version to X.Y.Z"
git push origin main
```

### Automated Pipeline
The CI/CD pipeline is configured to automatically:
- **Increment the patch version** on every merge/commit to `main`.
- **Inject the commit hash** into the build for precise tracking.
- **Deploy** the new version to GitHub Pages.

## 🚀 Release Process

For significant releases where you want to manually set a Minor or Major version:

1. **Bump Version**: Run `npm run version:minor` or `npm run version:major`.
2. **Commit & Push**:
   ```bash
   git add version.json package.json
   git commit -m "chore: release v1.2.0"
   git push origin main
   ```
3. **Tag (Optional)**:
   ```bash
   git tag -a v1.2.0 -m "Release version 1.2.0"
   git push origin v1.2.0
   ```

---

<div align="center">
  <p>Made with ❤️ for puzzle enthusiasts</p>
</div>
