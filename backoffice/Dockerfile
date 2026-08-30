# Étape 1 : build Vite
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install -g npm@11.6.1 && npm ci
COPY . .
ARG VITE_API_URL=http://localhost:3001
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Étape 2 : servir avec Nginx
FROM nginx:1.31-alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
