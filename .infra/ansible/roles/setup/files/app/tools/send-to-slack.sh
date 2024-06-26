#!/usr/bin/env bash
set -euo pipefail

readonly TEXT_MESSAGE=${1:?"Please provide a text message"}
readonly SLACK_URL="{{ vault[env_type].SIRIUS_SLACK_WEBHOOK_URL }}"
readonly CHANNEL_NAME="#sirius-alerting"
readonly IJ_ENV=$(cat /env)

curl -s -o /dev/null -X POST --data-urlencode \
  "payload={\"text\": \"[${IJ_ENV}] ${TEXT_MESSAGE}\", \"channel\": \"${CHANNEL_NAME}\" }" "${SLACK_URL}"
