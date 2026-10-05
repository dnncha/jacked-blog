#!/usr/bin/env bash
# Build the static export and publish the complete out/ tree as one gh-pages commit.
# Does not copy a partial set of files and does not add a CNAME.
# Run this after the site PR is merged. Do not run it from an unmerged branch
# unless you intend that branch's export to become the live GitHub Pages tree.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"
remote="${PUBLISH_REMOTE:-origin}"

npm run static:build

tmp="$(mktemp -d)"
cleanup() { git worktree remove --force "$tmp" >/dev/null 2>&1 || rm -rf "$tmp"; }
trap cleanup EXIT

git fetch "$remote" gh-pages
git worktree add --detach "$tmp" "$remote/gh-pages"
find "$tmp" -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +
cp -a "$root/out/." "$tmp/"
rm -f "$tmp/CNAME"

cd "$tmp"
git add -A
if git diff --cached --quiet; then
  echo "gh-pages already matches this export"
  exit 0
fi

git -c user.name="${GIT_AUTHOR_NAME:-Surpass publish}" \
  -c user.email="${GIT_AUTHOR_EMAIL:-support@jacked.coach}" \
  commit -m "Publish static export $(git -C "$root" rev-parse --short HEAD)"
git push "$remote" HEAD:gh-pages
echo "pushed gh-pages $(git rev-parse HEAD)"
echo "on Atlas: deploy/atlas/deploy.sh $(git rev-parse HEAD)"
