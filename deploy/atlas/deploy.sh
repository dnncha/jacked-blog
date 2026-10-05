#!/usr/bin/env bash
# Deploy one gh-pages commit of the static export onto the Atlas droplet.
# Run this on Atlas, after the publish command has pushed that commit.
# Usage: deploy/atlas/deploy.sh <gh-pages-sha>
set -euo pipefail

sha="${1:?usage: deploy/atlas/deploy.sh <gh-pages-sha>}"
if [[ ! "$sha" =~ ^[0-9a-fA-F]{7,40}$ ]]; then
  echo "expected a git sha, got: $sha" >&2
  exit 1
fi

stamp="$(date -u +%Y%m%dT%H%M%SZ)"
short="${sha:0:7}"
root="/opt/jacked"
release="${root}/releases/${stamp}-${short}"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

mkdir -p "${root}/releases"
curl -fsSL "https://codeload.github.com/dnncha/jacked-blog/tar.gz/${sha}" -o "${tmp}/src.tar.gz"
mkdir -p "$release"
tar -xzf "${tmp}/src.tar.gz" -C "$release" --strip-components=1

require() {
  if [[ ! -e "$1" ]]; then
    echo "smoke check failed, missing $1" >&2
    exit 1
  fi
}

require "${release}/index.html"
require "${release}/sitemap.xml"
if [[ -f "${release}/privacy/index.html" ]]; then
  require "${release}/privacy/index.html"
elif [[ -f "${release}/privacy.html" ]]; then
  require "${release}/privacy.html"
else
  echo "smoke check failed, missing privacy page" >&2
  exit 1
fi
if [[ -f "${release}/support/index.html" ]]; then
  require "${release}/support/index.html"
elif [[ -f "${release}/support.html" ]]; then
  require "${release}/support.html"
else
  echo "smoke check failed, missing support page" >&2
  exit 1
fi

if [[ -L "${root}/current" || -d "${root}/current" ]]; then
  readlink -f "${root}/current" > "${root}/PREVIOUS_RELEASE"
fi

ln -sfn "$release" "${root}/current"
echo "live: ${release}"
if [[ -f "${root}/PREVIOUS_RELEASE" ]]; then
  echo "rollback: ln -sfn $(cat "${root}/PREVIOUS_RELEASE") ${root}/current"
fi

mapfile -t releases < <(find "${root}/releases" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\n' | sort -nr | awk '{print $2}')
if (( ${#releases[@]} > 3 )); then
  for old in "${releases[@]:3}"; do
    if [[ "$(readlink -f "${root}/current")" == "$(readlink -f "$old")" ]]; then
      continue
    fi
    rm -rf "$old"
  done
fi
