# Repository Guidelines

## Project Structure & Module Organization
Core application code lives in `src/`:
- `src/views/` contains page-level screens (for example `Dashboard`, `Indicadores`, `Previsao`).
- `src/components/` holds reusable UI and feature components (`Chat`, `Map`, `Table`, `Graph`).
- `src/services/` contains API access helpers, while `src/utils/` stores shared utility functions.
- `src/layouts/` and `src/routes.js` define navigation and app shell behavior.

Static assets are in `public/` and `src/assets/`. Deployment manifests are in `argocd-arm/` and `argocd-mgc/`. Container setup is at repo root (`Dockerfile`, `docker-compose.yml`, `nginx.conf`).

## Build, Test, and Development Commands
- `yarn install` or `npm install`: install dependencies.
- `yarn start` or `npm start`: run local dev server (CRA) with legacy OpenSSL flag.
- `yarn build` or `npm run build`: create production build in `build/`.
- `npm run build:prod`: production build without legacy OpenSSL flag.
- `npm test`: run Jest via `react-scripts test`.
- `npm run lint:check`: run ESLint for `.js/.jsx`.
- `npm run lint:fix`: auto-fix lint issues where possible.

## Coding Style & Naming Conventions
Follow ESLint + Prettier (`.eslintrc.js`, `plugin:prettier/recommended`). Use 2-space indentation, semicolons, and single responsibility per component/module.

Naming patterns used in this codebase:
- React components/files: `PascalCase` (example: `ChatiaPage.js`).
- Utilities/helpers/constants: descriptive `camelCase` exports in grouped files (example: `formatter.js`, `validators.js`, `ConstantsMap.js`).
- Keep feature-specific helpers near their feature folders (for example `src/views/TableList/PoluentesHelper.js`).

## Codex Formatting Guide
When editing code, Codex should preserve the local style of the touched file and avoid broad formatting-only diffs.

- Indentation: use 2 spaces (never tabs).
- Semicolons: always keep semicolons at statement end.
- Quotes:
- Prefer single quotes in new files or new modules.
- If a file already uses double quotes consistently (for example `src/components/Map/ReactMap2.js`), keep that file's style unless the task is an explicit full-file normalization.
- Trailing commas: keep trailing commas in multi-line objects/arrays/imports.
- JSX formatting:
- Break props into multiple lines when a tag becomes long.
- Keep one prop per line in complex components.
- Prefer readable line wraps over compact one-line JSX.
- Imports:
- Group by source type (React/libs first, internal modules next, local relative imports last).
- Keep import ordering stable; do not reorder unless needed for clarity or lint.
- Inline styles and objects:
- For objects with 3+ properties, use multi-line formatting.
- Keep CSS keys and values readable; avoid long one-line style objects.
- Function/component formatting:
- Use `const` by default and arrow functions for handlers/utilities.
- Keep components focused; extract helper functions when blocks grow too large.
- Diff hygiene:
- Change only what is needed for the task.
- Do not reformat unrelated lines/files.

## Testing Guidelines
`npm test` uses the default CRA/Jest setup. The current `tests/` tree is present but empty, so add tests with each new feature or bug fix.

Prefer `*.test.js` naming, colocated with source or under `tests/` by feature. Prioritize coverage for:
- data formatting/validation utilities,
- API service behavior and error handling,
- critical rendering logic in views/components.

## Commit & Pull Request Guidelines
Recent commits use short, imperative messages in Portuguese (for example `adicionado setores`, `alterado logo`). Keep commits focused and scoped to one change.

For pull requests, include:
- clear summary and motivation,
- linked issue/ticket,
- screenshots or GIFs for UI changes,
- test/lint evidence (`npm test`, `npm run lint:check`),
- notes about `.env` or deployment manifest changes when applicable.
