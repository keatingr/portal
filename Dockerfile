FROM node:boron

WORKDIR /app

COPY package.json .

RUN yarn
COPY yarn.lock .
COPY . .
EXPOSE 3000
CMD ["yarn", "start"]