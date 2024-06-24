FROM arm64v8/node:18.20.3-slim AS build

WORKDIR /app
RUN apt-get update && apt-get install -y ca-certificates
COPY package*.json ./
# RUN yarn config set strict-ssl false
# RUN yarn install --network-timeout 1000000
RUN yarn config set registry https://registry.npmjs.org
RUN yarn install -network-concurrency 1
COPY . .
RUN yarn run build
EXPOSE 3000
CMD ["yarn", "start"]
