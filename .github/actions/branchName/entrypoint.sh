#!/usr/bin/env bash

echo "::set-output name=branchName::${GITHUB_HEAD_REF:-${GITHUB_REF##*/}}"

