FROM node:11.10.0-alpine

# 由于国内网络问题，yarn run build:prod 失败
# 暂时通过阿里云容器镜像服务的海外机器构建功能解决

RUN apk add git

COPY . /app

WORKDIR /app

RUN yarn install

RUN yarn run build:prod



FROM busybox

COPY --from=0 /app/dist /app_dist


