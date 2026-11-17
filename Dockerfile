# Imagem do site: compila o Angular com o Node e serve os arquivos com o nginx.
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npx ng build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/portal-mulheres-na-ciencia/browser /usr/share/nginx/html
EXPOSE 80
