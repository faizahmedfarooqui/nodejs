FROM node:10

# Create app directory
WORKDIR /usr/src/app

RUN mkdir .data && cd .data && mkdir users checks tokens && cd ..

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "index-cluster.js" ]
