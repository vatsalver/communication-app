# 1) Build static files
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2) Serve with nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Optional: tighten nginx config for SPA (history fallback)
# Create /etc/nginx/conf.d/default.conf if you need custom routes
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
