FROM node:11.10.0-alpine

# 由于国内网络问题，yarn run build:prod 失败
# 暂时通过阿里云容器镜像服务的海外机器构建功能解决

RUN apk add git

COPY . /app

WORKDIR /app

RUN yarn install

RUN yarn run build:prod



# https://docs.docker.com/develop/develop-images/multistage-build/

FROM busybox

COPY --from=0 /app/dist /app_dist


# git push aliyun master:master

# docker login --username=logig registry.cn-shenzhen.aliyuncs.com
# docker pull registry.cn-shenzhen.aliyuncs.com/logaxn/zealouscrm-vue

# 将镜像里的 /app_dist 目录拷出来
# docker run --rm -v $HOME/dist:/dist registry.cn-shenzhen.aliyuncs.com/logaxn/zealouscrm-vue cp -r -T /app_dist /dist
