# AGENTS.md

## Taste — Style and Preferences

**CRITICAL:** Before generating or modifying code, read `@taste/taste.md` and apply those preferences without needing to be reminded in every prompt.

Each line in `taste.md` has a Confidence value (0.00–1.00). Treat it as a confidence level, **not** as an indication that the rule is optional: even a value of **0.70** should be considered a default rule to follow.

If an instruction I give you during the conversation contradicts something in `taste.md`, prioritize my current instruction, but mention it briefly (e.g., *"This contradicts your **`taste.md`**. Would you like me to update it with **`/taste-update`**?"*).

If `taste.md` is empty or does not exist yet, ignore this entire section without mentioning it.

## Project

Restobar point-of-sale system (sales, products, users, cash register) for a Peruvian restaurant/bar. Academic project — all code, comments, UI text, and DB schema are in **Spanish**.

## Architecture

- **Backend:** Java 21 / Spring Boot 3.5 / Maven — layered REST API (`entity` → `repository` → `services` → `controller`) under `backend/restobar-rdr/`
- **Frontend:** Vanilla HTML/CSS/JS + Bootstrap 5 CDN — no build step, no framework. Served via VS Code Live Server from `frontend/`
- **Database:** MySQL 8, 5 tables. Schema init: `recursos/script_restobar.sql`
- All REST endpoints live under `/api/` with wide-open CORS (`@CrossOrigin(origins = "*")`)
- Spring Security is on the classpath **only for BCrypt** — auto-config is explicitly disabled in `application.properties`

## Running

```bash
# Full stack (MySQL + backend) via Docker:
docker compose up --build
# Backend alone (needs local MySQL on 3306, DB 'restobar_db', root/no-password):
./mvnw spring-boot:run          # from backend/restobar-rdr/
# Frontend: open frontend/ with VS Code Live Server (configured in .vscode/settings.json)
```

Backend serves on port **8080**. Frontend JS files hardcode `http://localhost:8080` as the API base URL.

## Build & Test

```bash
# Build (from backend/restobar-rdr/):
./mvnw clean package -DskipTests
# Run the single existing test:
./mvnw test
```

There is only one test (`contextLoads`). No linting, formatting, CI, or pre-commit hooks are configured.

## Key Quirks

- **Soft deletes:** Products and users use `fecha_desactivacion` / `fecha_baja` columns instead of hard deletes. Endpoints: `PUT /api/productos/{id}/desactivar`, `/activar`, same pattern for `/api/usuarios/`.
- **Image uploads:** Product images stored on disk at `backend/restobar-rdr/uploads/productos/`. Served via `WebConfig.java` resource handler, not a CDN.
- **Auth:** localStorage-based role check (`auth-guard.js`), no JWT or session tokens. Roles: `Admin`, `Cajero`, `Mozo`.
- **No lockfiles** — Maven resolves deps at build time.
- **Dockerfile** is a multi-stage Maven build that skips tests.
