FROM arm64v8/node:hydrogen-buster-slim AS build
WORKDIR /app
COPY package*.json ./
RUN yarn config set strict-ssl false
RUN yarn cache clean
RUN yarn config delete proxy
RUN yarn config delete https-proxy
RUN yarn config delete registry
RUN yarn install --network-timeout 1000000
RUN yarn install
COPY . .
RUN yarn run build
EXPOSE 3000
CMD ["yarn", "start"]
