ARG NODE_VERSION=16

FROM node:$NODE_VERSION-buster as base

WORKDIR /app

FROM base as builder

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn lerna bootstrap
RUN rm -rf /app/packages/client/dist/ && yarn build --scope=client


FROM nginx:alpine as production

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/location /etc/nginx/location
COPY nginx/publicLocation /etc/nginx/publicLocation
COPY nginx/.ssl/ /etc/nginx/ssl/

WORKDIR /app

COPY --from=builder /app/packages/client/dist/ /app

EXPOSE 80
EXPOSE 443

CMD [ "nginx", "-g", "daemon off;" ]






CMD ["nginx", "-g", "daemon off;"]