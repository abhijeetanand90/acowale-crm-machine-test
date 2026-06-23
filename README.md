# Acowale CRM Feedback Platform

A lightweight customer feedback platform built for collecting user feedback, viewing submissions, and tracking feedback analytics through an admin dashboard.

## Live Links

* Frontend: `https://acowale-crm-machine-test.vercel.app`
* Backend: `https://acowale-crm-machine-test.onrender.com`
* Health Check: `https://acowale-crm-machine-test.onrender.com/_health`

## Tech Stack

### Frontend

* React
* Vite
* Material UI
* Axios
* React Router

### Backend

* Node.js
* Express.js
* Sequelize
* PostgreSQL via Supabase
* Zod validation
* Winston logging
* Vitest service tests

### DevOps / Production Readiness

* GitHub Actions CI
* Vercel frontend deployment
* Render backend deployment
* Environment variable based configuration
* Request logging
* Centralized error handling
* Health-check endpoint
* Rate limiting on feedback submission

## Features

### Public Feedback Form

Users can submit feedback with:

* category
* comment
* optional email

### Admin Dashboard

The admin dashboard includes:

* total feedback count
* status-wise counts
* category-wise distribution
* recent feedback submissions
* feedback list table
* search
* category filter
* status filter

## API Endpoints

### Health Check

```http
GET /_health
```

Checks whether the server and database are reachable.

### Submit Feedback

```http
POST /api/feedback
```

Request body:

```json
{
  "category": "product",
  "comment": "The dashboard is useful but could be faster.",
  "email": "test@example.com"
}
```

### Fetch Feedback

```http
GET /api/feedback?page=1&limit=10
```

Supported query params:

```txt
search
category
status
page
limit
```

Example:

```http
GET /api/feedback?category=product&status=open&search=dashboard&page=1&limit=10
```

### Fetch Analytics Summary

```http
GET /api/feedback/summary
```

Returns:

```txt
total feedback count
status-wise counts
category-wise counts
recent feedback
```

## Environment Variables

### Backend

Create `server/.env`:

```env
PORT=3001
NODE_ENV=development
DATABASE_URL=your_supabase_postgres_connection_string
CLIENT_URL=http://localhost:5173
```

### Frontend

Create `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:3001
```

## Local Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd acowale-crm-machine-test
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Install frontend dependencies

```bash
cd ../client
npm install
```

### 4. Run backend

```bash
cd server
npm run dev
```

### 5. Run frontend

```bash
cd client
npm run dev
```

## Tests

Backend service tests can be run with:

```bash
cd server
npm test
```

The tests cover:

* feedback creation service
* feedback listing service
* feedback summary analytics service

## CI/CD

A GitHub Actions workflow runs on pushes and pull requests to `main`.

The CI workflow:

* installs frontend dependencies
* builds the frontend
* installs backend dependencies
* runs backend tests

Deployment is handled through platform-based CD:

* frontend is deployed on Vercel
* backend is deployed on Render
* both can be configured to redeploy automatically on push to `main`

## Production Readiness

Implemented production-readiness items:

* environment variables
* centralized error handling
* request validation
* structured backend logging
* health-check endpoint
* rate limiting
* service tests
* CI workflow

## Notes

Authentication was not added because the core assignment focuses on feedback submission, feedback retrieval, and analytics. In a production version, the admin dashboard should be protected with authentication and role-based access control.
