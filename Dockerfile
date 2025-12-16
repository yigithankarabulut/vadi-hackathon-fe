# --- Stage 1: Build ---
from node:24-alpine as builder
WORKDIR /app

COPY frontend/package*.json ./

RUN npm install --legacy-peer-deps

COPY frontend/ .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

from nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]