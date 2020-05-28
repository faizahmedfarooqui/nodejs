FROM node:10

# Create app directory
WORKDIR /usr/src/app

RUN mkdir .data && cd .data
RUN mkdir users checks tokens
RUN cd ..

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "index-cluster.js" ]
