# 使用官方 nginx 镜像作为基础镜像
FROM nginx:1.24-alpine

# 维护者信息
LABEL maintainer="yubin"

# 删除默认 nginx 静态资源
RUN rm -rf /usr/share/nginx/html/*

# 拷贝前端打包后的文件到 nginx 目录
COPY dist/ /usr/share/nginx/html/

# 拷贝自定义 nginx 配置（可选）
# COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"] 