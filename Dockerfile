FROM arm64v8/node:hydrogen-buster-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --verbose
COPY . .
RUN npm run build:prod
EXPOSE 3000
CMD ["npm", "start"]
