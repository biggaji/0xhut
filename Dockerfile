FROM node:18.17-alpine as build
WORKDIR /auth_server
COPY package*.json yarn*.lock ./
RUN yarn install
COPY . .
RUN yarn build

FROM build as development
ENV NODE_ENV development
EXPOSE 3000
CMD [ "node", "./dist/index.js" ] 