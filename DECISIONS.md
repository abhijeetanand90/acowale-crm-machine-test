## 1. Why did you choose this technology stack?
I chose React (with Vite) + MUI on the frontend and Node.js + Express on the backend, with PostgreSQL (Supabase) via Sequelize.

React + Vite — The product is two interactive surfaces: a public feedback form and an admin dashboard with filtering, search, and pagination. That's genuine client-side state (form state, loading states, filter state, table updates), which React's component model handles cleanly. I used Vite rather than Next.js deliberately: the backend is a separate Express API, so I didn't need server-side rendering or a full-stack framework. Vite keeps the frontend simple, fast to build, and easy to deploy as static files.

MUI — For a v1 admin dashboard, MUI gave me production-quality tables, chips, dropdowns, and form controls out of the box, so I could spend my time on data flow and API design rather than rebuilding UI primitives. The trade-off is a heavier dependency than plain CSS; I judged that acceptable because the dashboard needs a fair amount of standard UI furniture, and consistency across those components matters more than a custom look for an internal tool.

Node.js + Express — A lightweight REST API with a handful of endpoints (submit, list, analytics) doesn't need a heavier framework. Express is minimal, well-understood, and let me structure the code in clear layers (routes → validation → controller → service → model) without ceremony. Keeping frontend and backend both in JavaScript also reduced context-switching.

The database is PostgreSQL through Supabase because feedback data is structured and needs reliable filtering, sorting, pagination, and analytics queries.

## 2. Why did you choose this database?
I chose PostgreSQL because the feedback data is relational and structured. Each feedback item has a category, comment, optional email, status, and timestamps.

The admin dashboard also needs analytics such as total feedback count, category-wise distribution, status-wise counts, and recent submissions. PostgreSQL is a good fit because these can be handled efficiently using COUNT, GROUP BY, indexes, sorting, and pagination.

Supabase was chosen because it provides a hosted PostgreSQL database quickly, which is useful for a time-boxed assignment while still being close to a production-style setup.

## 3. Why did you structure your application this way?
I structured the backend using layered separation: routes → middleware → controllers → services → models.

Each layer has one clear responsibility.
Routes define the API endpoints and attach the required middleware. They do not contain business logic.

Middleware handles cross-cutting concerns such as validation, rate limiting, request logging, CORS, and error handling. Validation runs before the controller, so controllers can rely on req.validated instead of working with raw request input.

Controllers handle HTTP concerns only. They read validated input, call the required service, and shape the API response. This keeps controllers thin and easy to reason about.

Services contain the business logic and database access. Services do not depend on Express request or response objects, which makes them easier to test and reuse later from scripts, background jobs, or queue workers.
Models define the database schema, enum values, indexes, and data-layer constraints. I also kept feedback categories and statuses as shared constants in the model so validation, services, analytics, and frontend labels stay aligned.

I added reusable utility helpers for pagination and feedback filtering. This keeps the service code clean and makes changes easier. For example, if search logic changes later, I only need to update the filter builder instead of changing the controller and route.

I also added production-readiness pieces around the core APIs: centralized error handling, Zod validation, Winston logging, request logging middleware, CORS configuration, a health-check endpoint, rate limiting, environment-based configuration, and service tests. These are separated from the business logic so the application remains maintainable as it grows.

On the frontend, I used a feature-oriented structure with pages, API helpers, constants, and layout components.

API calls are kept in feedbackApi, so React components do not call Axios directly. Components call named functions like createFeedback, getFeedbackList, and getFeedbackSummary. Category options live in a constants file and are reused by both the public feedback form and the admin dashboard.

## 4. What trade-offs did you make due to time constraints?

Authentication was not implemented. The admin dashboard is currently accessible through the /admin route. In a production version, this should be protected with authentication and role-based access control.

I also used Sequelize sync for faster development instead of writing full database migrations. In production, migrations would be safer and more controlled.

The dashboard uses simple MUI components instead of advanced chart libraries. This keeps the UI lightweight and functional while still showing category distribution and counts clearly.

Monitoring was not integrated with an external tool. Instead, I added structured Winston logging and a health-check endpoint as a lightweight observability baseline.

## 5. What would you improve if you had one more week?

In rough priority order:

1. **Real authentication and authorization.**
   The admin dashboard is currently not protected. I would add proper user accounts, session/JWT-based authentication, and role-based access control so only authorized users can access feedback data. This is the most important gap for a real production product.

2. **Database migrations.**
   I used Sequelize sync for speed during the assignment. In production, I would move to versioned migrations so schema changes are reviewable, reversible, and safe to run against production data.

3. **Status-update workflow.**
   Right now admins can read, search, filter, and analyze feedback, but they cannot act on it directly from the dashboard. I would add a `PATCH /api/feedback/:id/status` endpoint and wire the admin table so feedback can move from Open → Reviewed → Resolved with a per-row control.

4. **Richer analytics.**
   I would add a proper charts layer, such as a donut chart for category share and a submission-trend line over time. I would also add a date-range filter and simple deltas like “this week vs last week” on the dashboard cards.

5. **More complete testing.**
   I added service-level tests for feedback creation, listing, and analytics summary. With more time, I would add API integration tests using Supertest and a test database, plus frontend tests for the feedback form and admin filters.

6. **Production hardening for scale.**
   I would move rate-limiting state to Redis so limits work correctly across multiple backend instances. I would also replace basic `ILIKE '%term%'` search with PostgreSQL full-text search or trigram indexes if feedback volume grows.

7. **Monitoring and observability.**
   The backend currently has structured Winston logging and a health-check endpoint. I would add production monitoring with error tracking, request latency metrics, and alerts for high error rates or database failures.

8. **Frontend polish.**
   I would add debounced search, better empty/error states, pagination controls, loading skeletons, and a stronger accessibility pass for keyboard navigation, focus management, and ARIA labels.

## 6. What was the most difficult technical challenge you faced?

The most difficult part was not writing one specific query, but designing the feedback dashboard data flow so it stayed correct and maintainable across the backend and frontend.

The admin dashboard needed multiple pieces of data: total feedback count, category-wise distribution, status-wise counts, recent submissions, search, filters, and pagination. I had to decide what should be computed by the backend, what should be left to the frontend, and how to keep the response shape stable.

For analytics, I chose to aggregate in PostgreSQL using `COUNT` and `GROUP BY` instead of fetching all feedback rows and counting in JavaScript. That part is standard, but the subtle issue was making the API response frontend-friendly. SQL only returns groups that exist in the data, so if there are no records for a category like `billing`, the database simply omits it. I handled this by zero-filling all known categories and statuses before returning the response. This lets the dashboard always render a complete and predictable state.

Another challenge was keeping category and status values consistent across the system. The backend uses machine values like `feature_request` and `ui_ux`, while the frontend needs readable labels like “Feature Request” and “UI / UX”. I kept the backend values strict for validation and querying, then mapped them to user-friendly labels in the frontend.

The final challenge was avoiding scope creep. There were many possible improvements, such as authentication, status updates, richer charts, and monitoring. I focused first on the required flow: submit feedback, fetch feedback, show analytics, add validation, logging, health checks, tests, and CI. That helped keep the product functional and production-aware within the time limit.

## 7. Which AI tools did you use?

I used ChatGPT as a pair-programming and review assistant during the assignment.

I used it mainly for:

* breaking the assignment into clear milestones
* reviewing backend architecture decisions
* debugging implementation errors
* checking API response shapes
* improving production-readiness items
* reviewing documentation wording
* thinking through trade-offs and edge cases

I did not use AI as a one-shot code generator. I used it more like a senior reviewer: I would implement or decide the approach, then use AI to challenge the structure, catch missing pieces, explain errors, and suggest improvements.

The final implementation decisions were still made by me, especially around scope control, naming, backend structure, what to include, and what to leave as future work.

## 8. Share one instance where AI helped you.
One clear instance was during debugging and scope control.

While building the backend I hit several small but blocking runtime issues: missing imports (a validator and Sequelize's fn/col helpers), route/controller naming mismatches, incorrect relative paths, and a missing model sync that meant the feedback table didn't exist yet. AI helped me narrow these down quickly reading the error, pointing to the exact file and layer involved, and suggesting the smallest fix rather than a structural change.
What I found most useful was that last part: it kept fixes local. When an import was missing, the answer was to add the import not to refactor the module. That discipline mattered because it's tempting, when something breaks, to "fix" it by rearranging more than necessary and introducing new problems. Using AI for fast, targeted diagnosis let me keep momentum on the actual product instead of getting stuck in avoidable debugging loops.

## 9. Share one instance where you disagreed with AI and why.

One instance where I disagreed with AI was around adding extra defensive error handling.

At one point, AI suggested adding additional `try/catch` blocks as a safety layer. I pushed back on that because some of those catch blocks would only catch an error and rethrow or forward it without adding any useful context.

The backend already has a centralized error-handling middleware, and controllers forward errors to it through `next(error)`. Because of that, adding catch blocks in lower-level service/helper functions just for the sake of “safety” would make the code noisier without improving behavior.

I kept error handling at the right layer: controllers handle HTTP flow, services focus on business/database logic, and the centralized error handler formats the response and logs server-side failures consistently.

This was a small disagreement, but it mattered because unnecessary defensive code can make a project harder to read. I wanted the backend to be explicit, not over-wrapped. So I chose the simpler structure where errors naturally propagate to the central error handler instead of adding redundant catch/rethrow blocks everywhere.

## 10. What would break first if this application suddenly had 100,000 users?

If the application suddenly had 100,000 users, the first thing I would expect to degrade is the public feedback submission path, specifically the backend-to-database write path.

Each backend instance has a limited Sequelize connection pool. Under a sudden spike of feedback submissions, requests would start waiting for available database connections. Once the pool and request queue are saturated, users would start seeing slow responses or timeouts. The current rate limiter helps reduce abuse, but it is process-local. If the backend is scaled to multiple instances, rate-limit state should move to Redis so limits are enforced globally instead of separately per instance.

The next bottleneck would be admin search as the feedback table grows. The list endpoint currently supports case-insensitive substring search using a pattern like `ILIKE '%term%'`. A leading-wildcard search cannot use a normal B-tree index effectively, so Postgres may scan many rows for each search. That is acceptable for a small assignment, but with a large feedback table, I would move to PostgreSQL full-text search or a `pg_trgm` trigram index.

The analytics summary endpoint is in a better position because it uses database aggregation with `COUNT` and `GROUP BY` instead of fetching all rows into JavaScript. However, if the dashboard is refreshed frequently, I would cache the summary for a short period such as 30–60 seconds, since dashboard metrics do not need to be perfectly real-time.

To harden the system for that scale, I would prioritize:

* increasing and tuning backend/database capacity
* moving rate limiting to Redis
* reviewing indexes based on real query patterns
* replacing basic substring search with full-text or trigram search
* caching hot dashboard summary reads
* adding observability for API latency, error rate, database load, and connection pool saturation

So the core design can grow, but the first things I would harden are the write path, database connection pool behavior, distributed rate limiting, and search performance.


## 11. What is one thing in this assignment that you would improve, change, or challenge?

The main thing I would improve is turning the dashboard from a reporting interface into an operational one.

Right now the dashboard is strong for visibility. It shows total feedback, category distribution, status counts, recent submissions, search, and filters. But it is still mostly read-only. A feedback tool’s real value is not just displaying feedback; it is helping the team act on it. As built, an admin can see that items are open, but cannot directly triage or resolve them from the dashboard.

The improvement I would make is a status-update workflow. I would add a `PATCH /api/feedback/:id/status` endpoint and let an admin move feedback from `Open` to `Reviewed` to `Resolved` directly from the table. I would also add audit fields to track who changed the status and when.

I deliberately did not ship a partial version of this in the time-box. A status control without authentication or audit history would look more interactive, but it would not be trustworthy. You cannot have an accountable workflow when actions are not attributable to a user.

The improvement I would make next is closing the loop: not just seeing feedback, but triaging and resolving it. That is what would make this dashboard something a team can actually operate from, not just a report they glance at.




