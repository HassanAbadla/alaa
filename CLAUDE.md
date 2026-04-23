# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PMIS (Project Management Information System) / GRC Platform - A Nuxt 2 + Vue 2 + Vuetify 2 frontend application. The application supports two build variants: **default** (PMIS) and **zain** (Zain GRC), controlled by the `BUILD_TARGET` environment variable.

## Development Commands

```bash
# Install dependencies
yarn install

# Development servers (choose one based on build target)
yarn dev:default     # PMIS version - connects to api.ordonsoft.com
yarn dev:local       # Local development - connects to localhost:8000
yarn dev:zain        # Zain GRC version - connects to grc-api.zaincloud.com.sa

# Maintenance mode (shows maintenance page)
yarn dev:maintenance:default
yarn dev:maintenance:local
yarn dev:maintenance:zain

# Production builds
yarn build:default   # Build PMIS version
yarn build:zain      # Build Zain GRC version
yarn build-all       # Build both versions and create timestamped zip files

# Start production server
yarn start
```

## Architecture

### Build Configuration
- Build target determined by `BUILD_TARGET` env var (`default`, `local`, `zain`)
- Environment files: `.env.default`, `.env.local`, `.env.zain`
- Use `process.env.isZain` or `this.$config.isZain` for conditional rendering based on build target
- Theme colors and branding change based on build target (see `nuxt.config.js`)

### State Management (Vuex)

Two patterns for Vuex stores:

1. **Store Factory Pattern** (`utils/storeFactory.js`): Preferred for new stores. Creates standardized CRUD stores with:
   - Auto-generated actions: `fetch{EntityPlural}`, `fetch{Entity}ById`, `add{Entity}`, `update{Entity}`, `delete{Entity}`
   - Auto-generated mutations: `SET_{ENTITY_PLURAL}`, `SET_CURRENT_{ENTITY}`, etc.
   - Built-in tree structure support via `treeConfig`
   - Usage: `export default createCrudStore({ endpoint: 'api-path', entityName: 'item', ... })`

2. **Traditional Pattern** (e.g., `store/projects.js`): Manual state/mutations/actions/getters exports

### API Layer
- Primary API: `$axios` plugin with base URL set per build target
- Secondary APIs: `$orsApi` and `$pmwebApi` plugins for external integrations
- API response format: `{ status: 'success', data: {...} }` or `{ status: 'error', message: {...} }`

### Authentication & Permissions
- Uses `@nuxtjs/auth-next` with local strategy
- Permissions check: `$hasPermission('permission-name')` or `$hasAllPermissions(['perm1', 'perm2'])`
- User permissions available at `$auth.user.permissions`

### Module System
The app uses a dynamic module system where navigation is built from backend data:
- Modules have sub-modules with groupings
- Selected module persists to localStorage
- Module selection controls sidebar navigation

### Internationalization
- Supports 4 locales: `en`, `ar`, `fr`, `cn`
- Arabic (`ar`) is RTL
- Translation files in `lang/` directory
- Use `$t('key')` for translations

### Key Directories
- `api/`: API service functions for specific domains
- `components/forms/`: Form components (naming: `{Entity}Form.vue`)
- `components/tables/`: Data table components
- `components/custom-table/`: Reusable table infrastructure
- `components/custom-form/`: Reusable form infrastructure
- `helpers/`: Utility functions (dates, formatting, errors)
- `mixins/`: Vue mixins (attachments, PDF export, table formatting)
- `middleware/`: Route middleware (auth, build-check, subscription check)
- `layouts/`: Page layouts (default, grc, oss, education, etc.)

### Component Patterns
- Forms typically connect to Vuex stores via `mapState`, `mapActions`
- Use `v-can` directive or `VCan` component for permission-based visibility
- Rich text editing via `TextEditor.vue` (Editor.js) or `QuillEditor.vue`
- PDF export via `pdfExportMixin.js` and `pdfmake`

### Middleware
- `auth.js`: Redirects unauthenticated users to login
- `is-grc.js`, `is-oss.js`, `is-pmis.js`: Module-specific route guards
- `build-check.js`: Validates build target compatibility
