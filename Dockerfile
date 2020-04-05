# Dockerfile
# 使用node做为镜像
FROM node
# 在容器中创建该目录
RUN mkdir -p /home/img
# 设置容器的工作目录为该目录
WORKDIR /home/img
#复制所有文件到 工作目录。
COPY . /home/img
# 向外提供3002端口
EXPOSE 3002
# 容器创建完成后执行的命令
RUN npm install
CMD ["npm", "start"]