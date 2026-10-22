# NSE / Mutual funds standalone app

Updated from the main project's `/nse-login` page and its NSE dashboard dependencies. All required app source, API proxy, logo, NSE schema, tests and related NSE reference documents are contained in this folder.

The current dashboard uses `/mutual-funds/*`. Older `/nse-dashboard/*` links redirect to the matching section, preserving query parameters. The login page remains `/nse-login`.

This folder runs independently of the main Lendrix app. It includes the latest mutual fund login, investor screens, bank mandates, purchases, SIP/XSIP/STP/SWP management, transactions, reports, shared UI, API proxy, tests and document templates.

## First-time setup

Install Node.js 22.12 or later (Node.js 24 is also supported), then open a terminal in this folder:

```sh
npm run setup
npm start
```

Setup installs the frontend and server dependencies. Start launches both services and opens http://localhost:8081/nse-login automatically. Sign in with credentials issued by your API provider.

On Windows you can double-click **setup.cmd** once, then **start.cmd** whenever you want to run the app. Keep the terminal open while using the app. Press Ctrl+C to stop it. If another app is using port 8081 or 5000, stop that app first.

## Folder layout

- **src/** ? login, dashboard, UI components, API services, types and tests.
- **server/** ? local API proxy, endpoint allowlist and configuration.
- **public/** ? logo and downloadable document templates/manuals.
- **scripts/** ? setup, source packaging and build helpers.
- **nse-openapi.json** ? included API schema.

The app does not import code from the parent project. API calls go through the included backend at http://localhost:5000/nse-api. That backend connects to the configured API provider; the upstream service is not included in this project.

## Provider configuration

Default settings work with the currently configured provider. To change them, copy **server/.env.example** to **server/.env**, then update the provider URL. No login credentials are stored in that example file. Actual account access requires a reachable provider and valid credentials.

## Verify or build

```sh
npm test
npm run typecheck
npm run build
```

After building, **npm run serve** serves the API and compiled app together at http://localhost:5000. Direct dashboard links and hard refreshes use the included SPA fallback. Vite development mode also supports direct dashboard links.

## Share

```sh
npm run share
```

Send **share/mutual-funds-standalone.zip**. The recipient extracts it and runs the setup/start commands above. The ZIP includes source, tests, assets, lockfiles and server configuration examples. It excludes node_modules, builds, caches, logs, real .env files and local credentials. You can also share this entire source folder after excluding those local files.
