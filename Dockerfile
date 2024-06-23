FROM arm64v8/node:hydrogen-buster-slim AS build
WORKDIR /app
COPY package*.json ./
RUN yarn config set strict-ssl false
RUN yarn install
COPY . .
RUN yarn run build
EXPOSE 3000
CMD ["yarn", "start"]
