FROM node:12.18.2-stretch

ARG SIRIUS_ENV
ARG SIRIUS_HOTJAR_ID
ENV REACT_APP_SIRIUS_ENV=$SIRIUS_ENV
ENV REACT_APP_SIRIUS_HOTJAR_ID=$SIRIUS_HOTJAR_ID

#Install and cache node_modules
COPY package.json yarn.lock /tmp/
RUN cd /tmp && \
    yarn install --frozen-lockfile && \
    mkdir -p /app && \
    mv /tmp/node_modules /app/

WORKDIR /app
COPY ./ /app

RUN yarn build

EXPOSE 3000
CMD yarn serve
