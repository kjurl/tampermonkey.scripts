# 🛠️ Tampermonkey Scripts Workspace

[![Build & Deploy](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/actions/workflows/release.yml/badge.status.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/actions)
[![Monorepo: Turborepo](https://img.shields.io/badge/maintained%20with-Turborepo-6515DD?logo=turborepo)](https://turbo.build/)
[![Package Manager: pnpm](https://img.shields.io/badge/maintained%20with-pnpm-E1573D?logo=pnpm)](https://pnpm.io/)

A highly optimized monorepo managed with **Turborepo**, **pnpm**, and **Changesets** for building, testing, and automatically releasing ultra-fast Userscripts built with TypeScript, SolidJS, and Tailwind CSS.

---

## 🚀 Quick Installation Matrix

To install or update a script, click its corresponding **Install Link**. Your browser userscript extension (Tampermonkey, Violentmonkey, etc.) will intercept it automatically.

| Script Name | Current Version | Live Install Link (Auto-Updates) | Historical Archive | Description |
| :--- | :---: | :--- | :---: | :--- |
| **Gemini Auto Temp** | `v1.0.0` | [🔗 Install Script](https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO_NAME/dist/gemini-auto-temp.user.js) | [📂 View Branch](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/tree/dist) | Automatically switches your Gemini chats to Temporary mode. Supports hotkeys (`Ctrl+Shift+O`). |
| **PES-Files Enhancer** | `v1.0.0` | [🔗 Install Script](https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO_NAME/dist/pes-files-fetch.user.js) | [📂 View Branch](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/tree/dist) | Enhances search page elements with images, dates, and background network parsing. |

> 💡 **How Auto-Updates Work:** The live installation links route to our headless production `dist` branch. Your client extension queries this file periodically to pull changes completely seamless behind the scenes.

---

## 🛠️ Local Development Architecture

This workspace utilizes strict compilation constraints with shared tooling definitions to maintain lightning-fast injection bundles.

```
tampermonkey.scripts/
├── apps/               # Independent userscript codebases
├── packages/           # Shared internal workspace dependencies
│   ├── tsconfig/       # Base TypeScript layout mappings
│   └── vite-config/    # Multi-framework unified bundler setup
└── scripts/            # Build lifecycle staging and release handlers
```

### Setup & Commands

Ensure you have [NodeJS >=22](https://nodejs.org/) and [pnpm >=10](https://pnpm.io/) initialized on your terminal environment before running:

```bash
# Install unified dependencies mapping cleanly
pnpm install

# Run concurrent hot-reloading dev environment loops
pnpm dev

# Force clear build passes & compile pipeline distribution output
pnpm build:all
```
# 📌 Automated Release Blueprint
We handle development lifecycles systematically via Git hooks, structured commits, and automated pipeline actions.
1. Atomic Commit Constraints
Commits strictly follow Conventional Commits Specification. Our root hook triggers cz-customizable to ensure metadata properties match expected bounds:

Bash
pnpm commit
2. Version Tracking Management
When delivering changes that alter application state pipelines, initialize a tracking artifact before pushing to the cloud infrastructure:

Bash
pnpm change
This configures step-down markdown parameters. Upon code-review clearance onto main, the automated Changesets App integration handles version increments, generates changelogs, and streams production-ready assets seamlessly onto our deployment layer.

📄 License
This repository is open-sourced under the MIT License.


---

## 🛠️ Step 2: Swap the Placeholders

To make this template live and functional, perform a find-and-replace for the uppercase template paths inside the text code:

1. Replace **`YOUR_USERNAME`** with your exact GitHub handle (e.g., `kjurl`).
2. Replace **`YOUR_REPO_NAME`** with your target repository's name (e.g., `tampermonkey.scripts`).

---

## 🎨 Why this works beautifully

* **Interactive Matrix Table:** Users don't want to parse messy project directories to find your files. Placing your `dist` branch RAW URLs inside a table lets them single-click install.
* **Professional Badges:** The dynamic SVG badges tracking your real-time GitHub Actions pass states instantly elevate the open-source quality presentation of the repo.
* **Unified Workspace Guide:** It cleanly explains the Turborepo/Changesets flow to anyone looking at your source code.
