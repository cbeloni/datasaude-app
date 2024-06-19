FROM arm64v8/node:hydrogen-buster-slim AS build
WORKDIR /app
COPY package*.json ./
RUN yarn install --verbose
COPY . .
RUN yarn run build:prod
EXPOSE 3000
CMD ["yarn", "start"]
