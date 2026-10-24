# Cross-stack contract consistency

This is the core anti-regression procedure for applications with separate frontend/backend stacks or multiple languages.

## Contract table

For every changed feature, write down:
- UI entry point and client state.
- Endpoint/route and HTTP method.
- Request payload, required/optional fields, constraints.
- Response payload and error envelope.
- Authn/authz rules and resource ownership.
- Domain/business invariants.
- Database tables, fields, relations, indexes, transaction behavior.
- Loading, empty, success, validation, forbidden, not-found, and server-error states.
- Retry/idempotency/concurrency requirements.
- Tests and docs that define the expected behavior.

## Single source of truth

Prefer a machine-checkable contract over repeated assumptions:
- OpenAPI schema with generated clients/types where appropriate.
- Shared TypeScript types for a single TS codebase.
- JSON Schema or another schema shared across languages.
- Explicit DTOs/serializers and API contract tests.
- Stable API docs and examples for separately deployed repositories.

Do not force one tool across all stacks. Choose the smallest source of truth the repository can maintain reliably.

## Cross-stack verification

- Test response and error shape against the client.
- Test validation rules on the server, including invalid/missing fields.
- Test authorization and resource ownership.
- Test success and failure UI states.
- Check that generated types/clients are regenerated and committed if the project expects it.
- Search for stale duplicate interfaces, old endpoints, hardcoded arrays, mocked fetches, and TODO fallbacks.
- Run integration/contract tests and frontend build/type checks.
- If backend and frontend live in separate repositories, record compatible API versions and contract ownership.

## High-risk flows

For payments, provisioning, account access, data deletion, and similar flows, consider duplicate requests, race conditions, retries, webhook authenticity, transaction boundaries, and reconciliation. Add concurrency tests where relevant.
