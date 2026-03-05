# PEER

> **Work with Peer in Life**
> A developer productivity platform built for the coding community — starting at Hive Helsinki.

---

## What is PEER?

PEER is an all-in-one platform for developers and CS students that combines **scheduling**, **algorithm learning with peer evaluation**, and a **community board** — all in one place.

The name *PEER* reflects the core philosophy: learning and growing *together*, through honest feedback from your peers.

---

## Features

### Calendar & Scheduler
- Full calendar with monthly view and day-based event creation
- Color-coded events with repeat rules (daily, weekly, biweekly, monthly, yearly)
- Auto-adjust end time when start time exceeds it
- "Today" quick-navigation button

### Todos
- Task management with priority levels and due dates

### AlgoBank
- Problem bank — anyone can submit algorithm problems (Easy / Medium / Hard)
- Submit your solution with code blocks and explanation
- **Peer Evaluation System** — reviewers score solutions on 4 criteria (1-5 each):
  - Correctness
  - Code Readability
  - Comments & Clarity
  - Problem Condition Satisfaction
- Both the evaluator and the author earn XP
- Collapsible code blocks for long solutions (10+ lines)
- Empty review state messaging

### Community
- Single unified board with dropdown tag system
- Tags: `[Algorithm]` `[Development]` `[Hobby]` `[IT News]` `[Job Info]` `[Learning]` `[Free]`
- Like, comment, and reply (2-level threading with auto-flattening)
- Report system: auto-blind when reports >= max(3, 10% of total users) -> admin review queue
- Real-time like count sync with server

### Notifications
- In-app notification system
- Triggers: likes, comments, evaluations, XP earned, level-up
- Read/unread tracking

### XP & Level System

| Activity | XP Earned |
|---|---|
| Daily login | +1 XP |
| Submit a solution | +1 XP |
| Evaluate a peer's solution | +2 XP |
| Receive an evaluation | +1 ~ +5 XP (equal to average score received) |

**Level-up formula:** `Required XP for Level N = N^2 x 10`

**Profile border changes every 10 levels:**

| Level Range | Border |
|---|---|
| 1 - 9 | Default (Gray) |
| 10 - 19 | Bronze |
| 20 - 29 | Silver |
| 30 - 39 | Gold |
| 40 - 49 | Platinum |
| 50+ | Diamond |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Spring Boot 3 (Java 21) |
| Database | PostgreSQL 17 (AWS RDS) |
| Frontend | Next.js 16 (React 19) + TailwindCSS |
| Auth | Google OAuth 2.0 + JWT (access + refresh token rotation) |
| Cloud | AWS EC2 (Amazon Linux 2023) + RDS |
| Proxy | nginx reverse proxy (port 80 -> frontend:3000 / backend:8080) |
| CI/CD | GitHub Actions (auto-deploy on push to main) |

---

## Architecture

```
Browser (withpeer.mooo.com)
        |
     nginx (:80)
     /          \
Next.js (:3000)  Spring Boot (:8080)
  (standalone)      |
                 PostgreSQL (RDS)
```

- Frontend uses relative API paths (`/api/*`) — nginx proxies to backend
- `forward-headers-strategy: framework` ensures Spring reads correct forwarded headers for OAuth
- JWT stored in localStorage with automatic refresh token rotation

---

## Development History

### Phase 0: Project Setup
- Initialized monorepo structure with `peer-backend/` and `peer-frontend/`
- Set up Spring Boot 3 with Java 21, PostgreSQL, Google OAuth 2.0
- Set up Next.js frontend with TailwindCSS
- Designed database schema and REST API endpoints

### Phase 1: Core Feature Implementation
- **Backend:** Implemented all REST APIs — Calendar/Events, Todos, AlgoBank (Problems/Solutions/Evaluations), Community (Posts/Comments/Likes/Reports), Notifications, XP/Level system
- **Frontend:** Built all pages — Login (Google OAuth), Scheduler (monthly calendar), Todos, AlgoBank (problem list + detail + evaluation), Community (post list + detail + comments), Notifications, Profile
- **CI/CD:** Set up GitHub Actions workflow for automatic deployment on push to main

### Phase 2: AWS Deployment & Infrastructure
- Deployed backend (JAR) and frontend (Next.js standalone) to AWS EC2
- Configured nginx as reverse proxy: port 80 -> frontend(:3000) + backend(:8080)
- Set up PostgreSQL 17 on AWS RDS
- Registered domain via FreeDNS (withpeer.mooo.com)

### Phase 3: OAuth & Proxy Issues
Encountered and resolved critical deployment issues:
- **Google OAuth `redirect_uri_mismatch`:** Spring Boot generated redirect URIs with `:8080` behind nginx. Fixed by adding `forward-headers-strategy: framework` to `application.yml` and `X-Forwarded-Port` to nginx config.
- **Frontend API routing failure:** `NEXT_PUBLIC_API_URL=""` is falsy in JS, causing fallback to hardcoded `localhost:8080`. Fixed by setting default to empty string `""` for relative path routing through nginx.
- **Post-login redirect loop:** API calls failing due to wrong base URL caused auth context to clear tokens and redirect back to login.

### Phase 4: Bug Fixes from Test Cases
Executed 13 manual test cases across all features. Key fixes:

| Test Case | Issue | Root Cause & Fix |
|---|---|---|
| TC-2.7 | Calendar time validation | Auto-adjust end time when start >= end; added `min` attribute |
| TC-5.1 | "Show all" button unclickable | Gradient overlay blocking clicks; added `pointer-events-none` |
| TC-5.2 | No Cancel on solution form | Added Cancel button to clear form and close |
| TC-6.1 | Evaluation submission error | Frontend field names mismatched backend; aligned to `correctness/codeReadability/commentsClarity/conditionSatisfaction` |
| TC-6.4 | No empty reviews indicator | Added "No reviews yet" empty state message |
| TC-8.3 | Report shows "failed" on success | Backend returns 201 with empty body; `res.json()` threw on empty response. Fixed with `res.text()` check |
| TC-9.2 | Like count keeps decrementing | Error catch block called DELETE on failed POST; fixed by re-syncing state from server |
| TC-9.3/9.4 | Comment notifications missing | Added `COMMENT` notification type and trigger in CommentService |
| TC-9.5 | Nested reply depth error | Changed from throwing error to auto-flattening (attach reply to root parent) |
| TC-11.3 | XP showing 0 | Frontend used `user.xp` but backend returns `totalXp`; aligned type definitions |
| Notifications | Like/eval notifications missing | Added `LIKE`/`EVALUATION` notification types and triggers in PostLikeService |

### Phase 5: Polish & UX
- Changed slogan to "Work with Peer in Life"
- Added "Today" button to calendar navigation
- Added empty evaluation state message for AlgoBank
- Fixed report auto-blind threshold: `max(3, ceil(totalUsers * 0.1))`
- Updated CI/CD to use `NEXT_PUBLIC_API_URL=""`

---

## Testing

### Unit Tests
- Backend unit tests with JUnit 5 + Mockito
- Run: `cd peer-backend && mvn test`

### Manual Test Cases
- 13 test cases covering all features (documented in `TEST_CASES.csv`)
- Covers: Calendar events, AlgoBank solutions/evaluations, Community posts/comments/likes/reports, Notifications, XP/Level system
- All test cases passed after Phase 4 fixes

---

## Local Development

### Backend
```bash
cd peer-backend
mvn spring-boot:run
```

### Frontend
```bash
cd peer-frontend
npm install
npm run dev
```

### Environment Variables
- Backend: Configure in `application.yml` or `application-prod.yml`
- Frontend: `NEXT_PUBLIC_API_URL` — leave empty for nginx proxy setup, or set to backend URL for direct access

---

## Deployment

### Manual Deploy
```bash
# Backend
cd peer-backend && mvn package -DskipTests
scp target/peer-backend-*.jar ec2-user@<host>:/opt/peer/peer-backend.jar
ssh ec2-user@<host> "sudo systemctl restart peer"

# Frontend
cd peer-frontend && NEXT_PUBLIC_API_URL="" npm run build
cp -r .next/standalone /tmp/peer-deploy
cp -r .next/static /tmp/peer-deploy/.next/static
cp -r public /tmp/peer-deploy/public
tar czf peer-frontend.tar.gz -C /tmp/peer-deploy .
scp peer-frontend.tar.gz ec2-user@<host>:/tmp/
ssh ec2-user@<host> "sudo systemctl stop peer-frontend && \
  rm -rf /opt/peer-frontend/* && \
  tar xzf /tmp/peer-frontend.tar.gz -C /opt/peer-frontend && \
  sudo systemctl start peer-frontend"
```

### CI/CD
Push to `main` branch triggers automatic deployment via GitHub Actions. Backend and frontend deploy independently based on which files changed.

---

## Roadmap

| Phase | Goal | Status |
|---|---|---|
| Phase 0 | Project setup, Google OAuth, DB schema | Done |
| Phase 1 | Scheduler, Todos, AlgoBank, Community, Notifications | Done |
| Phase 2 | AWS deployment, nginx proxy, domain setup | Done |
| Phase 3 | OAuth & proxy bug fixes | Done |
| Phase 4 | Test case bug fixes (13 cases) | Done |
| Phase 5 | UX polish, slogan, CI/CD update | Done |
| Phase 6 | Integration tests | In Progress |
| Phase 7 | GitHub integration (commit heatmap, activity sync) | Planned |
| Phase 8 | Mobile app (React Native) | Planned |

---

## Author

**Juhyeon Lee** — Hive Helsinki (42 Network)

---

*Deployed at: withpeer.mooo.com*
