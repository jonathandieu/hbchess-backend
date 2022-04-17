# pull the official base image
FROM node:alpine
# set working direction
WORKDIR /backend
# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
# install application dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm i
# add app
COPY . ./
# map ports
EXPOSE 80
EXPOSE 443
# start app
CMD ["npm", "run", "tsc"]
# CMD ["npm", "run", "serve"]