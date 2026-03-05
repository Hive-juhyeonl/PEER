# PEER 🤝

> **Connect, Learn, and Grow Together**
> A developer productivity platform built for the coding community — starting at Hive Helsinki.

---

## What is PEER?

PEER is an all-in-one platform for developers and CS students that combines **scheduling**, **algorithm learning with peer evaluation**, and a **community board** — all in one place.

The name *PEER* reflects the core philosophy: learning and growing *together*, through honest feedback from your peers.

---

## Features

### 📅 Scheduler
- Full calendar with monthly / weekly / daily / agenda views
- Drag & drop event creation with color tags and repeat rules
- Todo list with subtasks, priority levels, and due date sync to calendar
- Notification system (in-app & mobile push)

### 🧩 AlgoBank
- Problem bank — anyone can submit algorithm problems
- Submit your solution with code blocks, time complexity analysis, and GitHub link
- **Peer Evaluation System** — reviewers score solutions on 4 criteria (1–5 each):
  - ✅ Correctness
  - 📖 Code Readability
  - 💬 Comments & Clarity
  - 🎯 Problem Condition Satisfaction
- Both the evaluator and the author earn XP
- Report system for inappropriate problems (same rules as Community)

### 📊 GitHub Integration *(planned — v2)*
- GitHub activity visualization: commit heatmap, language chart, streak tracker
- Sync GitHub commits to your PEER calendar

### 💬 Community
- Single unified board with dropdown tag system
- Tags: `[Algorithm]` `[Development]` `[Hobby]` `[IT News]` `[Job Info]` `[Learning]` `[Free]`
- Posts displayed as `[Tag] Title` format (e.g., `[Job Info] Tips for landing your first dev job`)
- Like, comment, and reply (2-level threading)
- Report system: auto-blind when reports exceed 10% of total users → admin review queue

---

## XP & Level System

| Activity | XP Earned |
|---|---|
| Daily login | +1 XP |
| Submit a solution | +1 XP |
| Evaluate a peer's solution | +2 XP |
| Receive an evaluation | +1 ~ +5 XP (equal to average score received) |

**Level-up formula:** `Required XP for Level N = N² × 10`

| Level | XP Required |
|---|---|
| 1 | 10 |
| 5 | 250 |
| 10 | 1,000 |
| 20 | 4,000 |

**Profile border changes every 10 levels:**

| Level Range | Border |
|---|---|
| 1 – 9 | Default (Gray) |
| 10 – 19 | 🥉 Bronze |
| 20 – 29 | 🥈 Silver |
| 30 – 39 | 🥇 Gold |
| 40 – 49 | 💎 Platinum |
| 50+ | 💠 Diamond |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Spring Boot 3 (Java 21) |
| Database | PostgreSQL |
| Cache | Redis |
| Frontend | React 18 + Vite + TailwindCSS |
| Mobile *(planned)* | React Native (Expo) |
| Auth | Google OAuth 2.0 |
| Cloud | AWS (EC2 + RDS + S3) |

---

## Architecture Overview

```
Client (React Web / React Native)
        │
        ▼
  REST API (Spring Boot 3)
        │
   ┌────┴─────┐
   │          │
PostgreSQL   Redis
(main DB)   (cache / JWT blacklist)
        │
  GitHub API (v2)
```

---

## Roadmap

| Phase | Goal |
|---|---|
| Phase 0 | Project setup, Google OAuth, DB schema (Flyway migrations) |
| Phase 1 | Scheduler — calendar, todos, notifications |
| Phase 2 | AlgoBank — problem bank, solutions, peer evaluation + XP system |
| Phase 3 | Community — unified board, tag system, report & moderation |
| Phase 4 | Polish, deploy to AWS, open beta at Hive Helsinki |
| Phase 5 | Mobile app (React Native) |
| Phase 6 | GitHub integration |

---

## Why PEER?

Most productivity tools are generic. PEER is built **by developers, for developers** — with the peer evaluation culture of Hive Helsinki baked into its core.

The goal is simple: a single platform where you manage your schedule, sharpen your algorithm skills with real feedback from peers, and stay connected with the developer community around you.

---

## Author

**Juhyeon Lee** — Hive Helsinki (42 Network)
> Backend developer with experience in Java / Spring Boot / Oracle from Korean fintech industry.
> Currently studying systems programming and algorithms at Hive Helsinki, Finland.

---

*Initial deployment target: Hive Helsinki students*
*Platform: Web first → Mobile (React Native) later*
