# Stratigen Scouting UI

Next.js frontend for prompt submission, report lifecycle tracking, and scouting report viewing.

## Module Role

`scouting-tool` is the presentation layer in the Stratigen system. It:
- collects user scouting prompts,
- sends report generation requests to the API,
- polls status until completion/failure,
- routes users to report views.

## Responsibilities

- Prompt capture and submission (`/reports/generate`).
- Status polling and progress UI (`/reports/{id}/status`).
- Final report navigation/view rendering (`/report/[teamId]`).
- Contract-compatible client models for additive API fields.

## Architecture Snapshot

```text
UI (Next.js)
  -> API client (src/lib/api/apiclient.ts)
      -> /reports/generate
      -> /reports/{id}/status (polling)
      -> /reports/{id}
```

Key files:
- API client: `src/lib/api/apiclient.ts`
- Polling service: `src/app/report/[teamId]/polling.ts`
- Types/contracts: `src/lib/types/interfaces.ts`

## Local Development

### Prerequisites

- Node.js
- npm

### Install and Run

```bash
npm install
npm run dev
```

Build/serve/lint:

```bash
npm run build
npm run start
npm run lint
```

## Environment Variables

The UI requires an API base URL and supports optional client/logging overrides.

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Yes | none | Browser-visible API base URL. Should point to API `/api` (for example `http://localhost:8080/api`). |
| `API_BASE_URL` | No | none | Optional server-side override for API base URL. |
| `API_TIMEOUT_MS` | No | `15000` | API request timeout in ms. |
| `API_LOGGING` | No | `true` in dev, `false` in prod | Enables API request/response logging. |
| `API_LOG_ERROR_BODY` | No | `true` in dev, `false` in prod | Logs non-2xx response bodies (use carefully). |
| `API_REQUEST_ID_HEADER` | No | `x-request-id` | Header name for request ID propagation. |
| `LOG_LEVEL` | No | `debug` in dev, `info` in prod | Logger level (`fatal/error/warn/info/debug/trace`). |
| `LOG_TO_CONSOLE` | No | `true` in dev, `false` in prod | Enables console transport. |
| `LOG_TO_FILE` | No | `false` in dev, `true` in prod | Enables file transport on server runtime. |
| `LOG_FILE_PATH` | No | `logs/app.log` | File log path when file logging is enabled. |
| `LOG_COLORS` | No | `true` in dev, `false` in prod | Terminal color output toggle. |
| `LOG_TIMESTAMPS` | No | `true` | Timestamp toggle for log lines. |

Example local `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
API_TIMEOUT_MS=15000
API_LOGGING=true
API_LOG_ERROR_BODY=false
API_REQUEST_ID_HEADER=x-request-id
```

## API Integration Expectations

Configured base URL should include `/api`.

The UI expects these API routes (relative to base URL):
- `POST /reports/generate`
- `GET /reports/{id}/status`
- `GET /reports/{id}`

Frontend interfaces already support additive contract fields such as:
- status: `workflowState`, `errorCode`, `retryable`, `contractVersion`
- report: `contractVersion`, `modelVersion`, `featureVersion`, `generatedAt`, `lineage`

## Project Structure Highlights

- `src/app/page.tsx`: prompt entry and generate flow.
- `src/app/report/[teamId]/polling.ts`: polling utility/service.
- `src/lib/api/apiclient.ts`: axios-based client, env resolution, interceptors.
- `src/lib/types/interfaces.ts`: report/status request-response types.

## Current Status / Known Limits

- Report detail route is currently mostly UI-shell/static sections; dynamic binding of full returned report content is still limited.
- Polling utility defaults to `3000ms` / `60` attempts, but current call-site overrides use larger values.
- Root layout metadata still uses default Next scaffold values (`Create Next App`) and can be replaced with product metadata.

## Related Docs

- [Root Orchestrator README](../README.md)
- [Scouting API README](../scouting-api/README.md)
- [Engine README](../scouting-engine/README.md)
