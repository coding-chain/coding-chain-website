FROM  node:alpine as builder
WORKDIR /app
COPY . .
RUN npm ci  --debug && npm run build-prod

FROM nginx:1.17.5
COPY --from=builder  /app/dist/coding-chain-website /usr/share/nginx/html
ENTRYPOINT ["nginx", "-g", "daemon off;"]
