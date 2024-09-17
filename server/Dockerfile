FROM node:20.16-alpine

#Install and cache node_modules
COPY package.json yarn.lock /tmp/
RUN cd /tmp && \
    yarn install --frozen-lockfile && \
    mkdir -p /app && \
    mv /tmp/node_modules /app/

COPY ./ /app
WORKDIR /app

VOLUME /data
EXPOSE 5000

CMD sh -c 'if [ "$NODE_ENV" = "dev" ]; then yarn dev; else yarn start; fi'
