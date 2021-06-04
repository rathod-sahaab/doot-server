FROM node:alpine
WORKDIR /app

# cache packages first
COPY ./package.json .
COPY yarn.lock .

RUN yarn


# if this is done before installing packages
# packages will be fetched again when the code
# changes
COPY . .

CMD ["yarn", "start"]
EXPOSE 3000
