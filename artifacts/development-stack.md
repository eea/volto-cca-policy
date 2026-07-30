# Climate-ADAPT Development Stack

> Reference document for the development environment setup.

## Repository Layout

```
cca/                                    # Root monorepo
├── Makefile                            # Top-level orchestration
├── docker-compose.yml                  # Root stack (Traefik + frontend + backend + db)
├── backend/                            # Plone 6 backend
│   ├── Makefile
│   ├── docker-compose.yml              # Backend-only dev stack
│   ├── version.txt                     # Plone version: 6.0.13
│   ├── sources/                        # Source-checked-out Plone add-ons
│   │   ├── eea.climateadapt/           # Main business-logic add-on
│   │   ├── eea.volto.policy/           # EEA Volto policy
│   │   ├── eea.api.dataconnector/      # Data connector API
│   │   ├── eea.plotly/                 # Plotly integration
│   │   ├── eea.coremetadata/           # Core metadata
│   │   ├── plone.restapi/              # RestAPI (fork/patch)
│   │   ├── collective.exportimport/    # Export/import
│   │   ├── collective.volto.subsites/  # Subsites
│   │   ├── pas.plugins.eea/            # EEA authentication
│   │   └── climateadapt-async-translate/  # Node.js/BullMQ translation service
│   ├── instance/etc/                   # Zope configuration (zope.ini, relstorage.conf)
│   ├── volto-blocks-converter/         # Micro-service: Volto blocks JSON ↔ HTML
│   └── scripts/                        # Helper scripts (e.g. create_site.py)
├── frontend/                           # Volto frontend
│   ├── Makefile
│   ├── package.json                    # Main package (@eeacms/volto-cca-policy: 1.0.0)
│   ├── jsconfig.json                   # Module path mappings
│   ├── mrs.developer.json              # Add-on development config
│   ├── razzle.config.js                # Razzle (React SSR) configuration
│   ├── babel.config.js
│   ├── cypress.config.js
│   └── src/addons/                     # 58 Volto add-ons
│       ├── volto-cca-policy/           # ★ Main add-on (our work lives here)
│       ├── volto-searchlib/            # EEA Semantic Search (core search library)
│       ├── volto-globalsearch/         # Global search configuration
│       ├── volto-openlayers-map/       # OpenLayers map wrapper
│       ├── volto-eea-design-system/    # EEA design system
│       ├── volto-eea-website-theme/    # EEA website theme
│       ├── volto-eea-kitkat/           # EEA kitkat utilities
│       ├── volto-embed/                # Embed functionality
│       ├── volto-datablocks/           # Data blocks
│       ├── volto-plotlycharts/         # Plotly charts
│       ├── volto-eea-chatbot/          # Chatbot
│       └── ... (47 more add-ons)
└── reference/                          # Checked-out reference copies (optional)
```

## Backend (Plone 6)

### Docker-First Development

The backend runs **inside a Docker container**. The developer does NOT run Plone directly on the host.

**Container image:** `eeacms/eea.docker.plone-clineadapt:v11.0.0-plone6.1`

**Key environment variables (backend/docker-compose.yml):**
```yaml
RELSTORAGE_DSN: host='master' dbname='datafsv2' user='zope' password='zope'
TRANSLATE_ON_CHANGE: true
REDIS_HOST: redis
TRANSLATION_AUTH_TOKEN: hello1234
```

**Volume mounts:**
- `./sources:/app/sources` — Plone add-on source code
- `./sources.ini:/app/sources.ini` — Buildout sources configuration
- `./pg-data:/var/lib/postgresql/data` — PostgreSQL data
- `./cca_downloads:/app/import` — Import directory

**Port:** `8080` (exposed from container)

**Python executable (inside container):** `/app/bin/python3`

**Site ID:** `cca` (production-like), `Plone` (default)

### Backend Docker Services

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| `master` | `eeacms/postgres:14.13-2.1` | 5432 | PostgreSQL database |
| `backend` | `eeacms/eea.docker.plone-clineadapt` | 8080 | Plone backend (entrypoint: `tail -f /dev/null`) |
| `redis` | `redis:7-alpine` | 6379 | Redis for BullMQ queues |
| `converter` | `eea/blocks-conversion-tool:v1.0.5` | 8000 | Volto blocks JSON ↔ HTML converter |
| `async` | built from `./climateadapt-async-translate` | 4000 | BullMQ async translation worker |
| `varnish` | `hashicorp/http-echo` | 5678 | Varnish testing |

### Running the Backend

```bash
# Start backend stack
cd backend
docker compose up -d

# Exec into the backend container
docker compose exec backend /bin/bash

# Inside the container, start Plone manually
/app/bin/instance/bin/runwsgi /app/instance/etc/zope.ini

# Run Python scripts inside the container
docker compose exec backend /app/bin/python3 /app/sources/eea.climateadapt/scripts/my_script.py
```

### Backend Makefile Targets

| Target | Purpose |
|--------|---------|
| `make install` | Create venv, run mxdev, install packages |
| `make start` | Start Plone on localhost:8080 (outside Docker) |
| `make test` | Run backend tests via `tox -e test` |
| `make check` | Lint/format via `tox -e lint` |
| `make i18n` | Update locales |
| `make create-site` | Create a Plone site with default content |

---

## Frontend (Volto)

### Host-First Development

The frontend runs **directly on the host** (not in Docker), using `yarn`.

**Memory requirement:** `NODE_OPTIONS="--max-old-space-size=16384"` (mandatory for all yarn commands)

**Package manager:** `yarn` (NOT npm)

**Port:** `3000` (development server)

### Running the Frontend

```bash
cd frontend

# Install dependencies
make install
# or: NODE_OPTIONS="--max-old-space-size=16384" yarn install

# Start development server
make start
# or: NODE_OPTIONS="--max-old-space-size=16384" yarn start

# Build for production
make build

# Run tests for a specific add-on
make test src/addons/volto-cca-policy

# Create omelette symlink (Volto core source reference)
make omelette
```

### Add-on Management

**mrs.developer** manages local add-on development:

```bash
# Fetch/update add-ons from git
make develop
# or: npx -p mrs-developer missdev --config=jsconfig.json --output=addons --fetch-https
```

**Module path mapping** (`jsconfig.json`):

All add-ons follow the pattern `@eeacms/volto-<name>` → `addons/volto-<name>/src`:

```json
{
  "@eeacms/volto-cca-policy": ["addons/volto-cca-policy/src"],
  "@eeacms/volto-searchlib": ["addons/volto-searchlib/src"],
  "@eeacms/volto-globalsearch": ["addons/volto-globalsearch/src"],
  "@eeacms/volto-openlayers-map": ["addons/volto-openlayers-map/src"],
  "@plone/volto/*": ["../node_modules/@plone/volto/src/*"]
}
```

### Registered Add-ons (package.json)

The frontend registers 16 add-ons in order (order matters for config merging):

1. `@eeacms/volto-eea-kitkat` — Base utilities
2. `@eeacms/volto-datablocks` — Data blocks
3. `@eeacms/volto-embed` — Embed functionality
4. `@eeacms/volto-openlayers-map` — OpenLayers map
5. `@eeacms/volto-eea-design-system` — Design system
6. `@eeacms/volto-globalsearch` — Global search config
7. `@eeacms/volto-searchlib` — Search library
8. `@eeacms/volto-eea-website-theme` — EEA theme
9. `@eeacms/volto-workflow-progress` — Workflow progress
10. `@eeacms/volto-embed-static-content` — Static embed
11. `@eeacms/volto-cca-policy` — ★ Main policy add-on
12. `@eeacms/volto-plotlycharts` — Plotly charts
13. `@eeacms/volto-eea-chatbot` — Chatbot
14. `@eeacms/volto-slate-dataentity` — Slate data entities
15. `volto-subsites` — Subsites
16. `@plone-collective/volto-rss-provider` — RSS provider

### Add-on Structure

Each add-on follows the standard Volto add-on pattern:

```
volto-<name>/
├── src/
│   ├── index.js          # Main entry (applyConfig function)
│   ├── components/       # React components
│   ├── config/           # Configuration files
│   ├── helpers/          # Utility functions
│   ├── hocs/             # Higher-order components
│   ├── store/            # Redux store extensions
│   └── ...
├── theme/                # LESS/CSS theme files
│   └── globals/
├── package.json
├── Makefile
├── jest-addon.config.js  # Jest configuration
├── DEVELOP.md
└── README.md
```

### Key Add-ons for Our Work

| Add-on | Package | Purpose |
|--------|---------|---------|
| `volto-cca-policy` | `@eeacms/volto-cca-policy` | Main policy add-on — our primary workspace |
| `volto-searchlib` | `@eeacms/volto-searchlib` | EEA Semantic Search — provides `@eeacms/search` core library |
| `volto-globalsearch` | `@eeacms/volto-globalsearch` | Global search configuration and shared utilities |
| `volto-openlayers-map` | `@eeacms/volto-openlayers-map` | OpenLayers wrapper — `withOpenLayers` HOC, `<Map>`, `<Layer>`, etc. |
| `volto-eea-design-system` | `@eeacms/volto-eea-design-system` | EEA design tokens and base components |
| `volto-eea-website-theme` | `@eeacms/volto-eea-website-theme` | EEA website theme and styling |

### Omelette Symlink

```bash
frontend/omelette → node_modules/@plone/volto
```

Created via `make omelette`. Points to Volto core source code for quick reference.

---

## Full Stack (Root Docker Compose)

The root `docker-compose.yml` orchestrates the full development stack with Traefik reverse proxy:

| Service | Purpose |
|---------|---------|
| `traefik` | Reverse proxy (v2.11), routes to frontend/backend |
| `frontend` | Volto build image, serves on port 3000 |
| `backend` | Plone backend, serves on port 8080 |
| `db` | PostgreSQL database |

**Access URL:** `http://cca.localhost`

**Traefik routing:**
- `Host(\`cca.localhost\`)` → frontend:3000
- `/++api++/*` → backend VHM rewrite
- `/ClassicUI/*` → backend Classic UI

### Root Makefile Targets

| Target | Purpose |
|--------|---------|
| `make stack-start` | Start full root Docker Compose stack |
| `make stack-stop` | Stop the root stack |
| `make stack-rm` | Tear down root stack and remove Postgres volume |
| `make install` | Install both backend and frontend |
| `make start` | Start backend + frontend locally (outside Docker) |
| `make frontend-install` | Install frontend dependencies |
| `make frontend-build` | Build frontend |
| `make frontend-start` | Start frontend |
| `make frontend-test` | Run frontend tests |
| `make backend-install` | Install backend (venv + mxdev) |
| `make backend-start` | Start Plone backend |
| `make backend-create-site` | Create Plone site |

---

## Micro-Services

### climateadapt-async-translate

- **Technology:** Node.js + BullMQ + TypeScript
- **Purpose:** Asynchronous translation queue management
- **Port:** 4000 (inside backend Docker stack)
- **Environment:**
  - `PORTAL_URL: http://backend:8080/cca`
  - `TRANSLATION_AUTH_TOKEN: hello1234`
  - `BULL_QUEUE_NAMES_CSV: etranslation,save_etranslation,sync_paths`
  - `ENABLED_JOBS: call_etranslation,save_translated_html,sync_translated_paths`

### volto-blocks-converter

- **Technology:** Python (Flask/FastAPI)
- **Purpose:** Convert Volto blocks JSON ↔ HTML for translation
- **Port:** 8000 (inside backend Docker stack)
- **Image:** `eea/blocks-conversion-tool:v1.0.5`

---

## Authentication Flow

- **Plone ↔ Micro-services:** Shared `TRANSLATION_AUTH_TOKEN` header
- **Volto ↔ Plone API:** Standard Plone authentication (cookies/tokens)
- **Volto ↔ Elasticsearch:** Proxied through Volto Express middleware (`/_es/*`)
- **CORS:** `allowed_cors_destinations` includes `nominatim.openstreetmap.org`

---

## Environment Variables

### Frontend (Volto)

| Variable | Purpose |
|----------|---------|
| `NODE_OPTIONS` | `--max-old-space-size=16384` (required) |
| `RAZZLE_INTERNAL_API_PATH` | Plone API URL (Docker: `http://backend:8080/Plone`) |
| `RAZZLE_DEV_PROXY_API_PATH` | Local dev API proxy (`http://localhost:8080/www`) |
| `RAZZLE_ES_PROXY_ADDR` | Elasticsearch proxy address |
| `RAZZLE_ENV_CONFIG` | JSON environment configuration |
| `RAZZLE_VOLTO_LOCATIONS` | Semicolon-separated Volto path prefixes |
| `RAZZLE_MATOMO_SITE_ID` | Matomo tracking ID |

### Backend (Plone)

| Variable | Purpose |
|----------|---------|
| `RELSTORAGE_DSN` | PostgreSQL connection string |
| `TRANSLATE_ON_CHANGE` | Enable auto-translation on content change |
| `REDIS_HOST` | Redis hostname for BullMQ |
| `TRANSLATION_AUTH_TOKEN` | Shared auth token for micro-services |

---

## Testing

### Backend
```bash
cd backend
make test                    # Run all tests via tox -e test
make check                   # Lint via tox -e lint
```

### Frontend
```bash
cd frontend
make test src/addons/volto-cca-policy          # Run tests for cca-policy
CI=true make test src/addons/volto-cca-policy  # Non-interactive, full output
```

### Individual Add-on Testing
```bash
cd frontend/src/addons/volto-cca-policy
make addon-test TEST_FILE=src/MyComponent      # All tests in a directory
make addon-test TEST_FILE=src/MyComponent.test.jsx  # Single test file
```

### Acceptance Tests (Cypress)
```bash
cd frontend/src/addons/volto-cca-policy
make cypress-run     # Headless
make cypress-open    # Interactive
```

---

## Git Workflow

- **PR target branch:** `develop`
- **Add-on commits:** Must `cd` into the add-on directory first (each is its own git repo/submodule)
- **Branch naming:** Use hyphens, not slashes (e.g., `feature-map-view`, NOT `feature/map-view`)

```bash
# Example: commit changes in volto-cca-policy
cd frontend/src/addons/volto-cca-policy
git add -A
git commit -m "feat: implement navigator catalogue map view"
git push
```

---

## Key Constraints

1. **DO NOT read `frontend/start_*` scripts** — contain sensitive environment variables
2. **Backend commands must run inside Docker** — use `docker compose exec backend <command>`
3. **Frontend runs on host** — use `yarn` with `NODE_OPTIONS="--max-old-space-size=16384"`
4. **Never delete heavy directories** — move aside first (`mv frontend/ frontend.bak`)
5. **Shadowing convention** — include `README.md` explaining modifications when shadowing core components
