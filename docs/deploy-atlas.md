# Publish and deploy

The site is a static export. After this pull request is merged, one command builds that export and publishes it as a single `gh-pages` commit. A second command, run on the Atlas droplet, installs that commit.

## 1. Publish GitHub Pages

From a checkout of the merged `master` commit:

```bash
npm run publish:gh-pages
```

That runs `npm run static:build`, replaces the `gh-pages` tree with the complete `out/` directory, and pushes one commit. It does not add a `CNAME` and it does not copy a subset of files. The script prints the new `gh-pages` SHA.

Do not merge this pull request and do not push `gh-pages` until that publish command is the one you intend to run.

## 2. Deploy on Atlas

On the droplet, from a copy of this repo:

```bash
deploy/atlas/deploy.sh <gh-pages-sha>
```

The script downloads `https://codeload.github.com/dnncha/jacked-blog/tar.gz/<sha>`, unpacks it to `/opt/jacked/releases/<UTC-stamp>-<sha7>`, checks that `index.html`, the privacy page, the support page, and `sitemap.xml` exist, records the previous `/opt/jacked/current` target in `/opt/jacked/PREVIOUS_RELEASE`, points `/opt/jacked/current` at the new release, prints the rollback command, and keeps at most three releases.

`deploy/atlas/jacked.coach.caddy` is the jacked.coach site block only. It keeps the legacy blog redirects, redirects extensionless paths to a trailing slash, and serves `/opt/jacked/current`. It does not answer privacy or support RSC fetches with 204. Leave the Tankful, Bronora, StatementCSV, and Super Time blocks untouched when installing this file.
