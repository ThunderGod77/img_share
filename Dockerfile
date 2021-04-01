FROM node:14.16.0

WORKDIR /usr/src/img-share

COPY ./ ./

RUN npm install


EXPOSE 8080

CMD [ "node", "app.js" ]
