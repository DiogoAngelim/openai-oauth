# Branching Strategy

To keep the repository organized and collaboration efficient, follow this branching strategy:

**Always keep the main branch deployable and up to date with the latest stable code.**

## 1. Main Branch

- The `main` branch is always stable and production-ready.
- All releases are tagged from `main`.

## 2. Feature Branches

- Create a new branch from `main` for each new feature or bugfix.
- Name format: `feature/short-description` or `fix/short-description` (e.g., `feature/login-page`, `fix/typo-readme`).
- Merge back into `main` via Pull Request (PR) after review and CI/CD checks.

## 3. Release/Hotfix Branches (Optional)

- For urgent production fixes, use `hotfix/short-description` (e.g., `hotfix/critical-bug`).
- For preparing a release, use `release/x.y.z` (e.g., `release/1.2.0`).
- Merge these into `main` (and `develop` if you use it).

## 4. Branch Cleanup

- Delete feature/hotfix branches after merging to keep the repo clean.

## 5. General Guidelines

- Keep branches short-lived to avoid conflicts.
- Rebase or merge `main` regularly into your branch if it’s long-lived.
- Use descriptive PR titles and link issues when possible.

---

_This strategy helps maintain a clean, stable, and collaborative codebase. Adapt as needed for your team’s workflow._
