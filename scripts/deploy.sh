#!/usr/bin/env bash
# Build locally (free), deploy the prebuilt site to Netlify (no cloud
# build, no build credits). Headless auth: NETLIFY_AUTH_TOKEN and
# NETLIFY_SITE_ID from the environment (see .env.example; secrets in
# 1Password, run via `op run --env-file=.env -- ./scripts/deploy.sh`).
# Interactive fallback: `npx netlify-cli login` + `link` once.
# Policy: deploy at session end, not per commit. Pushes to GitHub are
# free and unlimited; deploys are batched.
set -euo pipefail
cd "$(dirname "$0")/.."

npm run validate:content
node scripts/build-answers.mjs
npx quartz build
node scripts/build-llms-full.mjs
node scripts/inject-jsonld.mjs
node scripts/sidenotes.mjs
node scripts/answer-block.mjs
node scripts/build-claims.mjs
npx netlify-cli deploy --prod --dir=public --message "$(git log -1 --format=%h\ %s)"
