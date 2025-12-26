
<!-- Badges -->
![Build Status](https://img.shields.io/github/actions/workflow/status/diogoangelim/openai-oauth/ci-cd.yml?branch=main)
![Coverage](https://img.shields.io/codecov/c/github/diogoangelim/openai-oauth?token=ghp_xxx)
[![codecov](https://codecov.io/gh/diogoangelim/openai-oauth/branch/main/graph/badge.svg?token=ghp_xxx)](https://codecov.io/gh/diogoangelim/openai-oauth)
![License](https://img.shields.io/github/license/diogoangelim/openai-oauth)
![Code Scanning](https://github.com/diogoangelim/openai-oauth/actions/workflows/codeql-analysis.yml/badge.svg)

# OpenAI OAuth Backend — Beginner Guide

> **Important:** Always run Docker builds from the monorepo root directory to avoid missing files in the build context. Example:
> ```sh
> cd /Users/diogoangelim/openai-oauth
> docker build -f apps/backend/Dockerfile -t openai-saas-backend:latest .
> ```

## Quick Start

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd openai-oauth
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in all required values (DB, Redis, OpenAI keys, etc).
4. **Set up the database:**
   - Edit `DATABASE_URL` in `.env` for your PostgreSQL instance.
   - Run migrations and generate Prisma client:
     ```sh
     npx prisma migrate deploy
     npx prisma generate
     ```
5. **Start Redis:**
   - Homebrew (macOS):
     ```sh
     brew install redis
     brew services start redis
     ```
   - Docker:
     ```sh
     docker run -p 6379:6379 redis
6. **Start the backend server:**
   ```sh
   cd apps/backend
   npm run start:dev
   ```
   - The server runs on [http://localhost:4000](http://localhost:4000)

---

## Project Structure

```
openai-oauth/
├── apps/
│   ├── backend/      # NestJS API backend
│   └── frontend/     # Next.js frontend
├── packages/         # Shared code (config, types, utils, prisma)
├── infra/            # Infrastructure as code (Terraform)
├── .env.example      # Environment variable template
├── README.md         # Project documentation
├── LICENSE           # Project license
```

---

## API Endpoints

### Health & Monitoring

### Authentication
- `POST /auth/refresh` — Refresh JWT

- `GET /api/admin` — Admin-only endpoint


### Billing



## Frontend Integration

### How to Connect the Frontend (Next.js) to the Backend API

1. **Set Backend URL**
   - In your frontend `.env`, add:
     ```env
     NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
     ```
   - Change the URL if your backend runs elsewhere.

2. **CORS Configuration**
   - Ensure your backend allows requests from your frontend domain. Set `FRONTEND_URL` in backend `.env`.

3. **Example: Chat Page Integration**
   - The chat page in `apps/frontend/app/chat/page.tsx` sends prompts to `/openai/chat` and displays responses.
   - Example usage:
     ```tsx
     'use client';
     import { useState, useRef } from 'react';

     export default function Chat() {
       const [prompt, setPrompt] = useState('');
       const [response, setResponse] = useState('');
       const [loading, setLoading] = useState(false);
       const eventSourceRef = useRef<EventSource | null>(null);

       const handleSubmit = async (e: React.FormEvent) => {
         e.preventDefault();
         setResponse('');
         setLoading(true);
         if (eventSourceRef.current) {
           eventSourceRef.current.close();
         }
         const url = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/openai/chat?stream=true`;
         const es = new EventSource(url, { withCredentials: true });
         eventSourceRef.current = es;
         es.onmessage = (event) => {
           setResponse((prev) => prev + event.data);
         };
         es.onerror = () => {
           setLoading(false);
           es.close();
         };
         await fetch(url, {
           method: 'POST',
           credentials: 'include',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ prompt }),
         });
       };

       return (
         <main>
           <form onSubmit={handleSubmit}>
             <textarea value={prompt} onChange={e => setPrompt(e.target.value)} />
             <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Send'}</button>
           </form>
           <div><pre>{response}</pre></div>
         </main>
       );
     }
     ```

4. **Authentication**
   - For protected endpoints, ensure the frontend sends JWT tokens (via cookies or headers) as required by the backend.

5. **Troubleshooting**
   - If you see CORS errors, check both frontend and backend URLs and allowed origins.
   - If you get network errors, verify both servers are running and accessible.

---

### Chat with OpenAI
**POST /openai/chat**
Request:
```json
{
  "prompt": "Hello, how are you?",
  "model": "gpt-3.5-turbo"
}
```
Response:
```json
{
  "response": "I'm an AI, so I don't have feelings, but I'm here to help!"
}
```
**GET /openai/history?orgId=ORG_ID&userId=USER_ID**
Response:
    "id": "chat1",
    "response": "I'm an AI, so I don't have feelings, but I'm here to help!",
    "model": "gpt-3.5-turbo",
    "createdAt": "2025-12-26T12:00:00Z"
  }
]
```

### Authentication
**GET /auth/google** — Redirects to Google OAuth login
**POST /auth/refresh**
Request:
```json
{
  "refreshToken": "your-refresh-token"
}
```
Response:
```json
{
  "accessToken": "new-access-token"
}
```

---

## Best Practices

### Security

### Code Quality

### Monitoring & Debugging

### Development Workflow
1. **Pull latest code** before starting work.
2. **Create a new branch** for each feature or bugfix.
3. **Write tests** for all new code.
4. **Run lint and tests** before pushing.
5. **Open a pull request** for review.


## Common Errors & Solutions

- **Port 4000 in use**: Kill any process using the port:
  ```sh
  lsof -i :4000 | grep LISTEN | awk '{print $2}' | xargs kill -9
  ```
- **Redis errors**: Ensure Redis is running and `REDIS_URL` is correct in `.env`.
- **Prisma errors**: Check your database connection and run `npx prisma generate`.
- **/metrics 500 error**: Ensure you are using Fastify-compatible controllers.
- **Missing .env file**: Copy `.env.example` to `.env` and fill in all required values.

---
- **Port 4000 in use**: Kill any process using the port (`lsof -i :4000 | grep LISTEN | awk '{print $2}' | xargs kill -9`).
- **Redis errors**: Ensure Redis is running and `REDIS_URL` is correct.

1. **Fork the repository** and clone your fork.
2. **Create a new branch** for your feature or fix.
3. **Write code and tests** following the style guide.
4. **Run lint and tests** before pushing.
5. **Open a pull request** for review.
6. **Respond to feedback** and update your code as needed.

All code must be reviewed and pass CI before merging.
---
## Contributing
- Follow the code style and commit guidelines.
- [NestJS Docs](https://docs.nestjs.com/)
- [Fastify Docs](https://www.fastify.io/docs/)
- [OpenAI API Docs](https://platform.openai.com/docs/)
- [Prometheus Docs](https://prometheus.io/docs/)

---

## Support
If you get stuck, ask for help in your team chat or open an issue in the repository.
