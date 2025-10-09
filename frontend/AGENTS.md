# Repository Guidelines

## Project Structure & Module Organization
The web client lives in `src/`, with routing views in `src/pages`, shared UI and state helpers in `src/services`, design tokens in `src/theme`, and generated DataConnect artifacts in `src/dataconnect-generated` (keep edits inside `services` when extending data access). Static assets ship from `public/`, while platform wrappers in `android/` and `ios/` are managed by Capacitor; call `pnpm run build` before syncing native projects. Environment and DataConnect configs sit in `dataconnect/` and `capacitor.config.ts`.

## Build, Test, and Development Commands
- `pnpm install` – install dependencies (ensure you use the workspace’s pnpm lockfile).
- `pnpm start` – run the React dev server with fast refresh and built-in lint checks.
- `pnpm build` – produce the production bundle in `build/`; run before `npx cap sync`.
- `pnpm test -- --watch` – execute Jest in watch mode; omit `--watch` in CI.
- `pnpm exec cap sync ios|android` – copy the latest web build into native shells.

## Coding Style & Naming Conventions
Follow React function components with PascalCase filenames (e.g., `pages/RedacaoPage.js`), camelCase hooks/utilities, and kebab-case asset names. Use 2-space indentation for JS/TS and CSS, favor ES modules, and colocate styles in `App.css`/component-level files when practical. The CRA ESLint profile (`react-app`, `react-app/jest`) runs on `start`/`build`; fix warnings before merging. Avoid editing files under `src/dataconnect-generated`; extend via wrapper services instead.

## Testing Guidelines
Tests rely on Jest and React Testing Library (`@testing-library/*`). Place specs alongside source as `*.test.js` (see `src/App.test.js` for conventions). Target user-facing behavior over implementation details, mock network calls via service layers, and maintain the default coverage thresholds (raise blockers if you add critical paths without tests). Run `pnpm test -- --coverage` prior to large merges.

## Commit & Pull Request Guidelines
Prefer concise, imperative commit subjects in the style `feat: add editor comment toolbar` or `fix: guard empty draft payloads`; keep scopes small and reference issues in the body when relevant. For pull requests, include: purpose summary, key implementation notes (especially around DataConnect or Capacitor changes), screenshots/GIFs for UI updates, and a checklist of manual/automated tests executed. Request review before syncing native projects and mention follow-up tasks if platform builds are pending.
