# 作成方法

- このリポジトリの作成手順

## Dockerfile / docker-compose.yml を作成

```bash
# docker-compose.ymlを作成
$ touch docker-compose.yml
# Dockerfileを作成
$ mkdir docker && cd docker && mkdir next-boilerplate && cd next-boilerplate && touch Dockerfile && cd ../../
```

**内容を以下のようにしてください**

`Dockerfile`

```Dockerfile
#==================================================
# for development
FROM node:14-alpine as development
WORKDIR /usr/src/app
```

`docker-compose.yml`

```
version: "3"
services:
  next:
    build:
      context: .
      dockerfile: ./docker/next-boilerplate/Dockerfile
    image: next
    container_name: nextjs-ts
    stdin_open: true
    # restart: always
    tty: true
    volumes:
      - .:/usr/src/app
      - yarn-cache:/usr/local/share/.cache/yarn/v2
    ports:
      # 3000は他でよく使用するので4001を開く
      - 4001:3000
    environment:
      - HOST=0.0.0.0
      - CHOKIDAR_USEPOLLING=true
    command: yarn dev
# ホスト側とコンテナ側と分離して管理,yarnの高速化
volumes:
  yarn-cache:
```

## docker を build して image を作成

```bash
$ docker-compose build
```

## next のプロジェクトを作成

```bash
$ docker-compose run --rm next npx create-next-app app
# exampleを使ってもいい
$ docker-compose run --rm next npx create-next-app --example with-typescript-eslint-jest app
```

## src/に`pages`,`styles`,`public`を src に移動

```bash
$ cd app && mkdir src && mv pages styles public src && cd ..
```

## app/を全て root に移動

ci/cd の時に app/にあると面倒なので app/を全てルートに移動します

## コンテナを起動

```bash
$ docker-compose up
```
