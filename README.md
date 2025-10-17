# ThePlotPot

Application is running live at [https://theplotpot.onrender.com](https://theplotpot.onrender.com).  
It is hosted on Render’s free tier, so please allow a couple of minutes for the service to start if it has stopped due to inactivity.

This is a project for the [Full Stack Web Development Project Course](https://github.com/fullstack-hy2020/misc/blob/master/project.md).
---
## 📑 Table of Contents

- [Short Description](#-short-description)
- [Setup & Installation](#️-setup--installation)
  - [Normal setup (local development)](#-normal-setup-local-development)
  - [Docker Deployment](#-docker-deployment)
- [Documentation](#-documentation)
- [Authors](#-authors)
---

### 📝 Short Description

**The PlotPot** is a collaborative story writing platform where any user can start a story and other users can continue it by adding chapters.  
Each chapter can branch into up to three different paths, allowing stories to grow in unique directions.  
Users can also comment on chapters.

---

### ⚙️ Setup & Installation

#### Normal setup (local development)

Instructions for setting up the app locally (without Docker) can be found in the backend README:

📄 [backend/README.md](./backend/README.md)

---

### 🐳 Docker Deployment

To run the full stack (backend, MySQL, Redis, frontend) in Docker:

#### 1. Prerequisites

- [Docker](https://docs.docker.com/engine/install/) and Docker Compose installed  
- (Optional) A `.env` file or environment variables configured

#### 2. Build and start the containers

From the project root:

```bash
docker compose up --build
```

This will:
- Build the frontend and backend
- Start **MySQL** and **Redis**
- Serve the backend API at `http://localhost:4000/graphql`
- Serve the frontend (static files) through the backend at `http://localhost:4000`
- Automatically generate secure backend secrets on first startup

#### 3. Environment variables

Environment configuration is defined in `docker-compose.yml`.

Key variables include:

| Variable | Description | Example |
|-----------|-------------|----------|
| `DB_HOST` | Database host (usually `mysql`) | `mysql` |
| `DB_USER` | MySQL username | `your_user` |
| `DB_PASSWORD` | MySQL password | `your_password` |
| `DB_NAME` | Database name | `theplotpot` |
| `REDIS_HOST` | Redis host | `redis` |
| `REDIS_PASS` | Redis password | `redis_password` |
| `RECAPTCHA_SECRET_KEY` | Server-side reCAPTCHA key | *(optional)* |
| `REACT_APP_RECAPTCHA_PUBLIC_KEY` | Frontend reCAPTCHA key (build arg) | *(optional)* |
| `IDSECRET`, `SECRET`, `CSRF_SECRET` | Backend secret keys used for sessions, CSRF, and ID signing | *(auto-generated)* |

#### 🔐 Automatic secret generation

On the first container startup, the backend will:

- Create `/app/backend/secrets/.secrets.env`  
- Generate cryptographically strong secrets using `openssl rand -hex 32`
- Persist them in a Docker volume named `secrets_data`
- Reuse the same secrets across restarts and rebuilds

This ensures each deployment has unique, secure keys without manual setup.  
You can inspect them inside the container if needed:

```bash
docker compose exec backend cat /app/backend/secrets/.secrets.env
```

#### 4. Stopping the containers

```bash
docker compose down
```

---

### 📚 Documentation

- [Installation instructions (backend)](./backend/README.md)  
- [Workhours log](./documents/workhours.md)  
- [Requirements specification](./documents/requirementspecification.md)

---

### 🧑‍💻 Authors

Developed by **Henri Vikman** as part of the University of Helsinki Full Stack Project course.
