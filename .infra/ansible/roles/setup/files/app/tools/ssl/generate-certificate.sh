#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ ! -f "/opt/sirius/data/ssl/privkey.pem" ]; then
  cd "${SCRIPT_DIR}"
    docker build --tag sirius_certbot certbot/
    docker run --rm --name sirius_certbot \
      -p 80:5000 \
      -v /opt/sirius/data/certbot:/etc/letsencrypt \
      -v /opt/sirius/data/ssl:/ssl \
      sirius_certbot generate "$@"
  cd -
else
  echo "Certificat SSL déja généré"
fi
