# CareerAI

CareerAI is a career preparation platform built with React, Vite, FastAPI, and MongoDB. The supported application is the `frontend/` and `backend/` pair.

## Run with Docker Compose

Requirements: Docker Engine with the Compose plugin.

1. Copy `.env.example` to `.env` in the project root.
2. Set unique MongoDB credentials and a random `JWT_SECRET` of at least 32 characters. Use URL-safe characters for the MongoDB credentials.
3. Set `FRONTEND_URL` to the exact public origin serving the site (for example, `https://careers.example.com`).
4. Start the stack:

```sh
docker compose up --build -d
```

The site is available on port 8080 by default. Set `APP_PORT` to change it. The API is available under `/api`; interactive API docs are bound to `127.0.0.1:8000/docs` for local administration. MongoDB is not published to the host. Put a TLS reverse proxy in front of the website for public production use.

View status and logs with `docker compose ps` and `docker compose logs -f backend`. Stop the stack with `docker compose down`; data is kept in the named `mongo-data` volume. To remove the stored database too, run `docker compose down -v`.

The default Compose file creates a MongoDB root account and uses it for the application connection. Protect the root `.env` file and do not reuse development credentials in production.

## Local development

Requirements: Python 3.11+, Node.js 20+, npm, and MongoDB.

On Windows, setup.ps1 creates the Python environment and installs frontend/backend dependencies. If MongoDB Community Server is installed but no MongoDB service is configured, run the MongoDB start script from inside the backend folder.

Backend (from the repository root):

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload --port 8000
```

Frontend, in another terminal:

```sh
cd frontend
npm ci
npm run dev
```

The development server is at `http://localhost:5173`. Vite forwards `/api` requests to the backend on port 8000. Configure `MONGODB_URI` in `backend/.env` if your database is not at `mongodb://localhost:27017`.

## Configuration and integrations

Backend settings are read from environment variables or `backend/.env`; see [backend/.env.example](backend/.env.example). Production startup requires a strong `JWT_SECRET` and a reachable MongoDB instance. `FRONTEND_URL` accepts a comma-separated list of exact browser origins.

When `OPENAI_API_KEY` is configured, the assistant sends the user's message and selected profile, resume-analysis, and assessment details to the OpenAI API. Without a key, it uses built-in rule-based guidance. Code execution requires a reachable Judge0 service in `JUDGE0_URL`; set `JUDGE0_API_KEY` when that service requires a key. Without a reachable runner, the API returns a configuration or service error when code is run.

The sample job roles are practice data, not live vacancies. CareerAI does not connect to a live job feed; administrators can add real listings and application links.

Company preparation pages provide separate, shortened pattern-aligned MCQ practice sets and mock assessments for TCS, Infosys, Accenture, Wipro, and Cognizant. The section counts are reference summaries and the assessment question content is original practice material, not verified previous-year or official company questions. Replace or extend the source data in `backend/app/data/company_patterns.py` only with questions whose source and reuse rights are clear.

## Resume score

The resume score is a text-based estimate from the extracted document. Its 100-point rubric covers contact details (8), education (10), skills (12), project detail (18), experience (15), certifications and achievements (10), readability and organization (12), and evidence of outcomes (15). Section presence alone does not earn full points; the scorer looks for details such as qualifications, project descriptions, action verbs, and measurable results. It does not assess actual skill proficiency, visual design, or guarantee ATS/recruiter outcomes. Scanned image PDFs may not yield enough text for a reliable result. Existing saved analyses are recalculated under this rubric the next time their analysis/report is loaded, when extracted resume text is available.

To create or reset only the administrator account without changing practice content, set `SEED_ADMIN_EMAIL=admin@gmail.com` (the default) and `SEED_ADMIN_PASSWORD` in your local environment, then run `python seed/seed_admin.py` from `backend`. This hashes the password before saving. Do not commit passwords to `.env.example` or source control. To seed the full sample content and demo account instead, set `SEED_ADMIN_PASSWORD` and `SEED_DEMO_PASSWORD` before running `python seed/seed.py`. After login, admins can manage account roles and deletion, MCQs, company career links, and student announcements. Published announcements appear in the signed-in Updates page and an in-app banner. Company links appear under Company Patterns. Running either seed script resets the admin password, so run it only when intended.

For the frontend, `VITE_API_BASE_URL` defaults to `/api`, which works behind the included Nginx proxy. When hosting the frontend separately, set it to the public API base URL at build time and set `FRONTEND_URL` on the backend to the frontend's exact origin.

## Deploy the frontend to Vercel

The repository includes [`vercel.json`](vercel.json) for deploying the Vite frontend from the repository root. The FastAPI backend must be deployed separately to a Python-capable host; Vercel should not use the local `http://localhost:8000` URL.

1. Import this repository into Vercel and keep the project root at the repository root.
2. Add the Vercel environment variable `VITE_API_BASE_URL`, set to the public backend URL, for example `https://api.example.com/api`.
3. On the backend host, set `FRONTEND_URL` to the exact Vercel origin, such as `https://careerai.vercel.app`.
4. Set production `MONGODB_URI`, `DATABASE_NAME`, and a random `JWT_SECRET` of at least 32 characters on the backend host.
5. Redeploy the Vercel project after setting `VITE_API_BASE_URL`; Vite injects this value during the build.

The Vercel rewrite handles client-side routes such as `/login` and `/register`. API requests go directly to the configured backend URL, avoiding the browser `Network Error` caused by a deployed frontend trying to call localhost.

## Project layout

- `frontend/src`: pages, components, routing, and API clients
- `frontend/nginx.conf`: SPA fallback, API reverse proxy, and response headers
- `backend/app`: API routes, authentication, persistence, and career services
- `backend/seed`: optional seed data loader
- `docker-compose.yml`: MongoDB, API, and web services
- `EmployeeApp/` and `express-app/`: separate prototype scaffolds; they are not used by the supported Docker or local run instructions above

## Checks

Frontend production build: `cd frontend && npm run build`.

Backend tests: `cd backend && pip install -r requirements-dev.txt && python -m pytest`.

## License

MIT
