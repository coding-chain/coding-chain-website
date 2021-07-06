FROM  node:alpine as builder
WORKDIR /app
COPY . .
RUN npm ci  --debug && npm run build-docker-local

FROM nginx:1.17.5
COPY default.conf.template /etc/nginx/conf.d/default.conf.template
COPY --from=builder  /app/dist/coding-chain-website /usr/share/nginx/html
CMD /bin/bash -c "envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf" && nginx -g 'daemon off;'
