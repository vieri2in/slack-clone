FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
USER node
EXPOSE 9000
CMD [ "npm","run","start" ]
