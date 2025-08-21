# API_CONTRACTS.md

This file defines API contract standards and planned scope for SparkTasks. Will migrate to `openapi.yaml` when endpoints stabilize.

## Planned API Scope

### Core Endpoints (Priority 1)

- **`/api/tasks`** — CRUD operations for task management (create, read, update, delete, list)
- **`/api/health`** — System health checks and dependency status
- **`/api/version`** — Application version and build information

### Authentication Endpoints (Priority 2)

- **`/api/auth`** — Authentication flow (if/when user management is added)
- **`/api/session`** — Session management for authenticated users

### Storage Integration (Priority 3)

- **`/api/storage`** — BYOS (Bring Your Own Storage) configuration endpoints
- **`/api/sync`** — Cross-device synchronization utilities

## Standard Error Response Schema

All API endpoints MUST return errors in this standardized format:

```json
{
  "type": "object",
  "required": ["error"],
  "properties": {
    "error": {
      "type": "object",
      "required": ["code", "message"],
      "properties": {
        "code": {
          "type": "string",
          "description": "Machine-readable error code (e.g., 'TASK_NOT_FOUND', 'VALIDATION_ERROR')"
        },
        "message": {
          "type": "string",
          "description": "Human-readable error description"
        },
        "details": {
          "type": "object",
          "description": "Optional additional context (validation errors, debug info, etc.)",
          "additionalProperties": true
        }
      }
    }
  }
}
```

### Error Code Standards

- `VALIDATION_ERROR` — Invalid request data (400)
- `NOT_FOUND` — Resource not found (404)
- `TASK_NOT_FOUND` — Specific task not found (404)
- `INTERNAL_ERROR` — Server-side failure (500)
- `STORAGE_ERROR` — BYOS integration failure (502)

## Migration Triggers

**Switch to `openapi.yaml` when:**

- ✅ At least 3 core endpoints are implemented and stable
- ✅ 2+ releases have passed without breaking changes to existing endpoints
- ✅ Error response format is validated across all endpoints
- ✅ Request/response schemas are finalized for core task operations

## Integration with Tests

### Acceptance Test Requirements

Every API endpoint MUST have:

1. **Contract Test** — Validates request/response schema compliance
2. **Error Format Test** — Ensures error responses follow standard schema
3. **Integration Test** — End-to-end workflow validation

### Mock Data Compliance

Test mocks MUST conform to the schemas defined here. Use Zod validation to ensure runtime compliance:

```typescript
// Example: Error response validation in tests
const ErrorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.any()).optional(),
  }),
});
```

## Guidelines

- Keep endpoints, request/response shapes, and error formats documented
- Any change to API contracts must be accompanied by acceptance tests and migration notes
- Use consistent HTTP status codes aligned with error response codes
- All timestamps should be ISO 8601 format (UTC)
- Use kebab-case for URL paths, camelCase for JSON properties

## Status

- **Current**: Placeholder with planned scope and error standards defined
- **Next**: Implement `/api/health` and `/api/tasks` with contract validation
- **Future**: Migrate to OpenAPI 3.0 specification once endpoints stabilize
