FROM arm64v8/node:hydrogen-buster-slim AS build
WORKDIR /app
RUN apt-get update && apt-get install -y ca-certificates speedtest-cli
RUN speedtest-cli
COPY package*.json ./
# RUN yarn config set strict-ssl false
# RUN yarn install --network-timeout 1000000
RUN yarn install 
COPY . .
RUN yarn run build
EXPOSE 3000
CMD ["yarn", "start"]
