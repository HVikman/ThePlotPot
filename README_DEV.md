# ThePlotPot (Development Guide)

This document describes **how to run The PlotPot in development mode with Docker Compose Watch** for live-reloading and hot-reload support.

---

## 📑 Table of Contents

- [Setup & Installation](#️setup--installation)
  - [Normal setup (local development)](#normal-setup-local-development)
  - [Docker Deployment (production)](#docker-deployment-production)
  - [Docker Development Mode (Compose Watch)](#docker-development-mode-compose-watch)
- [Documentation](#documentation)
- [Authors](#authors)
- [Summary](#summary)
---



## Setup & Installation

### Normal setup (local development)

Instructions for setting up the app locally (without Docker) can be found in the backend README:

[backend/README.md](./backend/README.md)

---

### Docker Deployment (production)

To run the full stack (backend, MySQL, Redis, frontend) in **production mode**:

```bash
docker compose up --build
```

This will:
- Build the production-optimized frontend and backend images  
- Start MySQL and Redis  
- Serve everything from a single container on **http://localhost:4000**

More details in the main [README.md](./README.md).

---

### Docker Development Mode (Compose Watch)

This mode provides **live reload** for both backend and frontend, similar to running `npm start` locally.

#### 1. Build and start dev environment

From the project root:

```bash
docker compose -f docker-compose.dev.yml up --watch --build
```

This starts:
- Backend with **nodemon** (auto-restarts on file changes)
- Frontend with **React dev server (port 3000)**
- MySQL and Redis in containers
- Compose Watch monitors file changes and syncs them live into the container

You’ll have:
- Backend API → [http://localhost:4000/graphql](http://localhost:4000/graphql)
- Frontend UI → [http://localhost:3000](http://localhost:3000)

---

#### 2. How it works

The development image uses `dockerfile.dev`, which:
- Installs dev dependencies
- Mounts your local source code directly into the container (`/app`)
- Runs both backend and frontend + databases
---

#### 3. Live Reload Details

| Component | Tool | Notes |
|------------|------|-------|
| Backend | nodemon | Restarts automatically on JS file changes |
| Frontend | CRA dev server | Hot Module Reload (HMR) via Webpack |
| Docker Watch | Compose Watch | Syncs local changes into container |
| Database | MySQL 8 | Same setup as production |
| Cache | Redis 7 | Same setup as production |

---

#### 4. Environment Variables

The dev compose file (`docker-compose.dev.yml`) defines:
```yaml
services:
  app:
    ports:
      - "4000:4000"
      - "3000:3000"
    environment:
      DB_HOST: mysql
      DB_USER: your_user
      DB_PASSWORD: your_password
      DB_NAME: theplotpot
      REDIS_HOST: redis
      REDIS_PASS: redis_password
      PORT: 4000
      FRONTEND_PORT: 3000
      HOST: 0.0.0.0
      CHOKIDAR_USEPOLLING: "1"
      WATCHPACK_POLLING: "true"
```
> 🔸 Tip:  
> If your filesystem supports inotify (Linux), you can disable polling to make it even faster:
> ```yaml
> CHOKIDAR_USEPOLLING: "false"
> WATCHPACK_POLLING: "false"
> ```

---

#### 5. Common Commands

| Command | Description |
|----------|-------------|
| `docker compose -f docker-compose.dev.yml up --watch --build` | Start development containers |
| `docker compose stop` | Stop containers without removing data |
| `docker compose down --remove-orphans` | Clean up containers and networks |
| `docker logs -f theplotpot-app-1` | Follow live logs for the dev container |

---


### Documentation

- [Workhours log](./documents/workhours.md)  
- [Requirements specification](./documents/requirementspecification.md)

---

### Authors

Developed by **Henri Vikman** as part of the University of Helsinki Full Stack Project course.  

---

### Summary

| Mode | Command | Description |
|------|----------|-------------|
| Production | `docker compose up --build` | Optimized build, serves frontend+backend from one container |
| Development | `docker compose -f docker-compose.dev.yml up --watch --build` | Hot-reloading dev mode with React dev server and nodemon |

---
