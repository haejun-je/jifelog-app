FROM node:22-alpine AS builder

WORKDIR /app

ARG GH_PACKAGES_TOKEN
ARG GH_ID
ARG GEMINI_API_KEY=""
ARG VITE_MODE

COPY package.json package-lock.json ./

RUN if [ -n "$GH_PACKAGES_TOKEN" ] && [ -n "$GH_ID" ]; then \
      printf "@%s:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=%s\nalways-auth=true\n" "$GH_ID" "$GH_PACKAGES_TOKEN" > .npmrc; \
    fi \
    && npm ci \
    && rm -f .npmrc

COPY . .

ENV GEMINI_API_KEY=$GEMINI_API_KEY

RUN npm run build -- --mode $VITE_MODE

FROM nginx:1.27-alpine

COPY deploy/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
