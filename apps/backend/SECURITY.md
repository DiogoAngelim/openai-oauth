# Security Notes

## Auth Module

- OAuth handled server-side only; no secrets in frontend.
- JWT access tokens are short-lived; refresh tokens are httpOnly cookies.
- Role-based access enforced via guards.
- Organization auto-creation is safe (no privilege escalation).

## API Module

- All endpoints require JWT (except `/auth/*`).
- Role-based guards prevent privilege escalation.
- Organization context is always enforced from JWT.

## OpenAI Proxy

- Never exposes OpenAI API keys to frontend.
- All prompts validated and sanitized (Zod + regex).
- Quota checked before every OpenAI call.
- Usage logs always linked to org/user.
- Streaming responses use SSE, never expose backend internals.

## Rate Limiting

- Redis-backed, per-user and per-org.
- Prevents abuse and DoS.

## Data

- No prompts stored without org/user linkage.
- System prompts (if any) are immutable.

## General

- All secrets/config via env vars only.
- CORS is restricted to frontend origin.
- Centralized error handling and logging.
