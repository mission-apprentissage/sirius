# Temporary solution freeze NodeJs version https://github.com/vercel/next.js/discussions/69326
# https://github.com/vercel/next.js/issues/69150
FROM node:22.6-slim AS builder_root
WORKDIR /app
RUN yarn set version 3.3.1
COPY .yarn /app/.yarn
COPY package.json package.json
COPY yarn.lock yarn.lock
COPY .yarnrc.yml .yarnrc.yml
COPY ui/package.json ui/package.json
COPY server/package.json server/package.json

RUN --mount=type=cache,target=/app/.yarn/cache yarn install --immutable

FROM builder_root AS root
WORKDIR /app

##############################################################
######################    SERVER    ##########################
##############################################################

# Rebuild the source code only when needed
FROM root AS builder_server
WORKDIR /app

COPY ./server ./server

RUN yarn workspace server build
# Removing dev dependencies
RUN --mount=type=cache,target=/app/.yarn/cache yarn workspaces focus --all --production

RUN mkdir -p /app/server/node_modules

# Production image, copy all the files and run next
FROM node:22-slim AS server
WORKDIR /app

RUN apt-get update && apt-get install -y ca-certificates curl && update-ca-certificates && apt-get clean

ENV NODE_ENV=production

ARG PUBLIC_PRODUCT_NAME
ENV PUBLIC_PRODUCT_NAME=$PUBLIC_PRODUCT_NAME

ARG PUBLIC_VERSION
ENV PUBLIC_VERSION=$PUBLIC_VERSION

COPY --from=builder_server /app/server ./server
COPY --from=builder_server /app/node_modules ./node_modules
COPY --from=builder_server /app/server/node_modules ./server/node_modules
COPY ./server/static /app/server/static

EXPOSE 5000
WORKDIR /app/server
ENV NODE_OPTIONS=--max_old_space_size=2048
CMD ["node", "dist/index.js", "start"]


##############################################################
######################      UI      ##########################
##############################################################

# Rebuild the source code only when needed
FROM root AS builder_ui
WORKDIR /app
COPY ./ui ./ui

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

ARG PUBLIC_REPO_NAME
ENV REACT_APP_PRODUCT_REPO=$PUBLIC_REPO_NAME

ARG PUBLIC_PRODUCT_NAME
ENV REACT_APP_PRODUCT_NAME=$PUBLIC_PRODUCT_NAME

ARG PUBLIC_VERSION
ENV REACT_APP_VERSION=$PUBLIC_VERSION

ARG PUBLIC_ENV
ENV REACT_APP_ENV=$PUBLIC_ENV

RUN yarn workspace ui dsfr:copy
RUN yarn workspace ui dsfr:update

RUN yarn workspace ui build

# Production image, copy all the files and run next
FROM node:22-slim AS ui
WORKDIR /app

RUN apt-get update && apt-get install -y ca-certificates curl && update-ca-certificates && apt-get clean

ENV NODE_ENV=production

ARG PUBLIC_REPO_NAME
ENV REACT_APP_PRODUCT_REPO=$PUBLIC_REPO_NAME

ARG PUBLIC_PRODUCT_NAME
ENV REACT_APP_PRODUCT_NAME=$PUBLIC_PRODUCT_NAME

ARG PUBLIC_VERSION
ENV REACT_APP_VERSION=$PUBLIC_VERSION

ARG PUBLIC_ENV
ENV REACT_APP_ENV=$PUBLIC_ENV

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# COPY --from=builder_ui --chown=nextjs:nodejs /app/ui/public /app/ui/public
COPY --from=builder_ui --chown=nextjs:nodejs /app/ui/package.json /app/package.json

COPY --from=builder_ui --chown=nextjs:nodejs /app/ui/build /app/

# RUN yarn global add serve
RUN yarn global add local-web-server

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["yarn","serve"]
