# Stage 1 – Build frontend

FROM node:20 AS frontend-builder

WORKDIR /app
COPY theplotpot-frontend ./theplotpot-frontend

ARG REACT_APP_RECAPTCHA_PUBLIC_KEY
ENV REACT_APP_RECAPTCHA_PUBLIC_KEY=$REACT_APP_RECAPTCHA_PUBLIC_KEY

RUN cd theplotpot-frontend \
    && npm ci \
    && npm run build

# Stage 2 – Build backend

FROM node:20 AS backend-builder

WORKDIR /app
COPY backend ./backend

RUN cd backend && npm ci

# Stage 3 – Final runtime image

FROM node:20-slim

WORKDIR /app

COPY --from=backend-builder /app/backend ./backend
COPY --from=frontend-builder /app/theplotpot-frontend/build ./backend/dist

WORKDIR /app/backend

RUN apt-get update && apt-get install -y netcat-openbsd openssl && rm -rf /var/lib/apt/lists/*

EXPOSE 4000

CMD ["npm", "start"]