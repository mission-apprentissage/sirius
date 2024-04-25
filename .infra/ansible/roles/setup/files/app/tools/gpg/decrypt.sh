#!/usr/bin/env bash
set -euo pipefail

gpg --decrypt --default-key "ij_devops" $@
