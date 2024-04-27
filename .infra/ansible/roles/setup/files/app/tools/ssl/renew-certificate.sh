#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly DOMAINS=${1:?"Please provide the domain names for informational purposes only, separated by commas"}; shift;

start_reverse_proxy() {
  docker container start sirius_reverse_proxy
}

stop_reverse_proxy() {
  docker container stop sirius_reverse_proxy
}

renew_certificate() {
  echo "Renewing SSL certificate covering the following domains: $DOMAINS..."
  cd "${SCRIPT_DIR}"
  docker build --tag sirius_certbot certbot/
  
  # Renew the certificate, Certbot will renew all due certificates
  docker run --rm --name sirius_certbot \
    -p 80:5000 \
    -v /opt/sirius/data/certbot:/etc/letsencrypt \
    -v /opt/sirius/data/ssl:/ssl \
    sirius_certbot renew

  cd -
}

handle_error() {
  bash /opt/sirius/tools/send-to-slack.sh "[SSL] Unable to renew certificate covering domains: $DOMAINS"
  start_reverse_proxy
}
trap handle_error ERR

echo "****************************"
echo "[$(date +'%Y-%m-%d_%H%M%S')] Running ${BASH_SOURCE[0]} for domains: $DOMAINS"
echo "****************************"
stop_reverse_proxy
renew_certificate
start_reverse_proxy
bash /opt/sirius/tools/send-to-slack.sh "[SSL] Certificate has been renewed for domains: $DOMAINS"
