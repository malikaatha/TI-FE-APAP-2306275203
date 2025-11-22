# --- Stage 1: Build Stage ---
FROM node:20-alpine AS build-stage

WORKDIR /app

# Copy package.json dan lock file dulu (biar cache layer optimal)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy seluruh source code
COPY . .

# Setup Environment Variable untuk Build Time
# (Penting agar frontend tau alamat backend saat dibuild)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build aplikasi (sesuaikan script ini dengan package.json kamu)
# Tadi kamu pake "build-only" atau "build", pastikan command ini menghasilkan folder /dist
RUN npm run build

# --- Stage 2: Production Stage ---
FROM nginx:alpine AS production-stage

# Hapus config default nginx
RUN rm -rf /usr/share/nginx/html/*

# Copy hasil build dari Stage 1 ke folder nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy konfigurasi Nginx custom (agar Vue Router jalan lancar saat di-refresh)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]