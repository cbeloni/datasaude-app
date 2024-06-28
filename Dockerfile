FROM alpine:3.18

# Instale dependências necessárias
RUN apk update && apk upgrade && \
    apk add --no-cache \
    ca-certificates \
    nodejs \
    npm \
    yarn \
    nginx

COPY package*.json ./
# RUN yarn config set strict-ssl false
RUN yarn config set network-timeout 1000000 \
    && yarn config set network-concurrency 50
RUN yarn install    
COPY . .
RUN yarn run build
# EXPOSE 3000
# CMD ["yarn", "start"]

COPY nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /usr/share/nginx/html
RUN cp -r build/* /usr/share/nginx/html/

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
