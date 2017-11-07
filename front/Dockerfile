FROM node:6.10-alpine
RUN mkdir -p /home/web

#docker run vittusaatana -it -p 2451:3000
#COPY reactfront/src/ /home/web/
COPY reactfront/public/ /home/web/public/
COPY reactfront/src/ /home/web/src/
COPY reactfront/*.json /home/web/
WORKDIR "/home/web"
RUN npm install
EXPOSE 3000
ENTRYPOINT npm start --host 0.0.0.0
