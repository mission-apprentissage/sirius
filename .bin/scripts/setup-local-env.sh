#!/usr/bin/env bash
set -euo pipefail

echo "Updating local server/.env & ui/.env"
ANSIBLE_CONFIG="${ROOT_DIR}/.infra/ansible/ansible.cfg" ansible all \
  --limit "local" \
  -m template \
  -a "src=\"${ROOT_DIR}/.infra/.env_server\" dest=\"${ROOT_DIR}/server/.env\"" \
  --extra-vars "@${ROOT_DIR}/.infra/vault/vault.yml" \
  --vault-password-file="${SCRIPT_DIR}/get-vault-password-client.sh"
ANSIBLE_CONFIG="${ROOT_DIR}/.infra/ansible/ansible.cfg" ansible all \
  --limit "local" \
  -m template \
  -a "src=\"${ROOT_DIR}/.infra/.env_ui\" dest=\"${ROOT_DIR}/ui/.env\"" \
  --extra-vars "@${ROOT_DIR}/.infra/vault/vault.yml" \
  --vault-password-file="${SCRIPT_DIR}/get-vault-password-client.sh"

echo "PUBLIC_VERSION=0.0.0-local" >> "${ROOT_DIR}/server/.env"
echo "PUBLIC_PRODUCT_NAME=\"${PRODUCT_NAME}\"" >> "${ROOT_DIR}/server/.env"

echo "REACT_APP_ENV=local" >> "${ROOT_DIR}/ui/.env"
echo "REACT_APP_VERSION=0.0.0-local" >> "${ROOT_DIR}/ui/.env"
echo "REACT_APP_PRODUCT_NAME=\"${PRODUCT_NAME}\"" >> "${ROOT_DIR}/ui/.env"
echo "REACT_APP_PRODUCT_REPO=\"${REPO_NAME}\"" >> "${ROOT_DIR}/ui/.env"
echo "REACT_APP_API_PORT=5001" >> "${ROOT_DIR}/ui/.env"


yarn
yarn services:start
yarn build
yarn cli db:init
