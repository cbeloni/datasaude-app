FROM alpine:3.18

# Instale dependências necessárias
RUN apk update && apk upgrade && \
    apk add --no-cache \
    ca-certificates \
    nodejs \
    npm \
    yarn \
    nginx

WORKDIR /app

# Copie apenas arquivos de dependências para aproveitar o cache de camadas do Docker
COPY package.json yarn.lock ./

# Use cache do BuildKit para o yarn install
RUN --mount=type=cache,target=/root/.cache/yarn \
    yarn config set network-timeout 1000000 \
    && yarn config set network-concurrency 50 \
    && yarn install --frozen-lockfile

# Copie o restante dos arquivos do projeto
COPY . .

# Compile a build de produção otimizada
RUN yarn run build

COPY nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /usr/share/nginx/html
RUN cp -r build/* /usr/share/nginx/html/

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
