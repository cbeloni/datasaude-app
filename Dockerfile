# Use uma imagem base do Alpine
FROM alpine:3.18

# Instale dependências necessárias
RUN apk update && apk upgrade && \
    apk add --no-cache \
    ca-certificates \
    nodejs \
    npm \
    yarn

COPY package*.json ./
# RUN yarn config set strict-ssl false
# RUN yarn install --network-timeout 1000000
RUN yarn config set registry https://registry.npmjs.org
RUN yarn install
COPY . .
RUN yarn run build
EXPOSE 3000
CMD ["yarn", "start"]
