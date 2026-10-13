FROM node:24-alpine AS build
WORKDIR /cms
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY public ./public
COPY scripts ./scripts
ARG CMS_AUTH_URL
RUN test -n "$CMS_AUTH_URL" && CMS_AUTH_URL="$CMS_AUTH_URL" npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /cms/dist /usr/share/nginx/html
EXPOSE 80
