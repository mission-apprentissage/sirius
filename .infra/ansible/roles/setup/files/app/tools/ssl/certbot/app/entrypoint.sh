#!/bin/bash
set -euo

readonly SSL_OUTPUT_DIR="/ssl"

if [ ! -d "${SSL_OUTPUT_DIR}" ]; then
  echo "You must mount directory on path ${SSL_OUTPUT_DIR}"
  exit 1
fi

function start_http_server_for_acme_challenge() {
  mkdir -p /var/www
  serve -l 5000 /var/www &
}

function generate_certificate() {
  local domains=(${1//,/ })  # Split input domains separated by commas into an array
  local certbot_domains=()   # Initialize an array for certbot domain arguments

  echo "Generating certificate for domains: ${1}..."

  # Loop over the domains and add each one to the certbot_domains array
  for domain in "${domains[@]}"; do
    certbot_domains+=("--domain" "${domain}")
  done

  # Run certbot with all the collected domain arguments
  certbot certonly \
    --email contact@inserjeunes.beta.gouv.fr \
    --agree-tos \
    --non-interactive \
    --webroot \
    --webroot-path /var/www \
    "${certbot_domains[@]}"

  # Assuming all domains are managed under a common certificate directory
  local primary_domain="${domains[0]}"
  cp "/etc/letsencrypt/live/${primary_domain}/fullchain.pem" "${SSL_OUTPUT_DIR}"
  cp "/etc/letsencrypt/live/${primary_domain}/privkey.pem" "${SSL_OUTPUT_DIR}"
}


function generate_self_signed_certificate() {
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout "${SSL_OUTPUT_DIR}/privkey.pem" \
    -out "${SSL_OUTPUT_DIR}/fullchain.pem" \
    -subj "/C=FR/O=Mission Inserjeunes/CN=Root"
}

function renew_certificate() {
  local domains=(${1//,/ })  # Split input domains separated by commas into an array
  local primary_domain="${domains[0]}"

  echo "Preparing to renew certificates for domains: ${1}..."
  # Ensure the renewal uses the specific SSL directory, if required
  cp -R "${SSL_OUTPUT_DIR}" "/etc/letsencrypt/live/${primary_domain}"

  echo "Renewing certificate..."
  certbot renew --cert-name "${primary_domain}"

  echo "Copying renewed certificates for domain ${primary_domain} to the SSL output directory..."
  cp "/etc/letsencrypt/live/${primary_domain}/fullchain.pem" "${SSL_OUTPUT_DIR}"
  cp "/etc/letsencrypt/live/${primary_domain}/privkey.pem" "${SSL_OUTPUT_DIR}"
}

function main() {

  local task="${1}"
  local dns_name="${2:?"Please provide a dns name"}"

  case "${task}" in
  generate)
    if [ "${dns_name}" == "localhost" ]; then
      generate_self_signed_certificate
    else
      start_http_server_for_acme_challenge
      generate_certificate "${dns_name}"
    fi
    ;;
  renew)
    start_http_server_for_acme_challenge
    renew_certificate "${dns_name}"
    ;;
  *)
    echo "Unknown task '${task}'"
    usage
    exit 1
    ;;
  esac
}

main "$@"
