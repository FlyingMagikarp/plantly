# Plantly

Personal plant collection and care logging application.

For detailed project documentation see:

* [Product](docs/product.md)
* [Domain](docs/domain.md)
* [Business Rules](docs/business-rules.md)
* [Architecture](docs/architecture.md)
* [Architecture Decisions](docs/decisions/)
* [Use Cases](docs/usecases/)

## Development

### Prerequisites

* Node.js 24 or newer
* npm
* Docker with Docker Compose

Install the frontend and backend dependencies:

```bash
npm --prefix frontend install
npm --prefix backend install
```

Copy `.env.example` to `.env` and `backend/.env.example` to `backend/.env`.
The defaults reserve PostgreSQL host port `5433` for the clean `plantlyv2`
database so an existing Plantly v1 database on port `5432` is not touched.

Start PostgreSQL for local development:

```bash
docker compose up -d database
docker compose stop frontend backend
```

The second command is safe when those services are not running. It prevents a
previously started Compose backend from occupying port `3000` and masking the
status of the local development process.

Then start the applications in separate terminals:

```bash
npm run dev:backend
npm run dev:frontend
```

The frontend is available at `http://localhost:5173` and proxies `/api`
requests to the backend at `http://localhost:3000`.

## Deployment

Plantly is deployed using Docker Compose.

```bash
npm run docker:up
npm run docker:down
```

The complete application is available at `http://localhost:8080`. The backend
health endpoint is available directly at `http://localhost:3000/api/health`.
PostgreSQL data is persisted in the `plantly_plantlyv2-data` Docker volume.

## Synchronizing Species Definitions

Species definitions in `docs/species/` are synchronized on demand through the
backend API. With the backend running, trigger a synchronization from the
repository root:

```bash
curl -i -X POST http://localhost:3000/api/admin/species/sync
```

When running the application with Docker Compose, rebuild and restart the
backend first so that changes under `docs/species/` are copied into its image:

```bash
docker compose up --build -d backend
curl -i -X POST http://localhost:3000/api/admin/species/sync
```

A successful synchronization returns `204 No Content`. Invalid definitions
return `422 Unprocessable Content`, and unexpected failures return `500
Internal Server Error`. Failed synchronizations do not partially update species
data. See [Species Definitions](docs/species/README.md) for the required file
format and naming rules.

## Useful Commands

Run commands from the repository root:

| Task | Command |
| --- | --- |
| Build both applications | `npm run build` |
| Run all tests | `npm test` |
| Lint both applications | `npm run lint` |
| Type-check both applications | `npm run typecheck` |
| Run migrations | `npm run migration:run` |
| Revert the latest migration | `npm run migration:revert` |
| Create a migration | `npm run migration:create -- src/database/migrations/MigrationName` |
| Generate a migration | `npm run migration:generate -- src/database/migrations/MigrationName` |
| Start the Compose stack | `npm run docker:up` |
| Stop the Compose stack | `npm run docker:down` |

Migration paths are relative to `backend/`. Schema synchronization is disabled;
all future schema changes must be represented by TypeORM migrations. The backend
runs pending migrations during startup, including when the Compose stack starts
against a new or existing Plantly v2 database.
