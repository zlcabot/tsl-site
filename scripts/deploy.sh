#!/usr/bin/env bash
# Build locally (free), deploy the prebuilt site to Netlify (no cloud
# build, no build credits). One-time setup: `npx netlify-cli login`
# then `npx netlify-cli link` (choose the thisspirituallife project).
# Policy: deploy at session end, not per commit — pushes to GitHub are
# free and unlimited; deploys are batched.
set -euo pipefail
cd "$(dirname "$0")/.."

npx quartz build
node scripts/build-llms-full.mjs
node scripts/inject-jsonld.mjs
npx netlify-cli deploy --prod --dir=public --message "$(git log -1 --format=%h\ %s)"
