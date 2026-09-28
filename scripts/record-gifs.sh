#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p docs/gifs

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git init
fi
git config user.email clay-example@localhost
git config user.name "Clay example"
git config color.ui always
git config pager.diff false

node scripts/demo/reset.mjs

if ! git rev-parse --verify demo-baseline >/dev/null 2>&1; then
  git add -A
  git commit -m "baseline"
  git tag demo-baseline
fi

restore() {
  mkdir -p /tmp/shelf-gifs
  cp docs/gifs/*.gif /tmp/shelf-gifs/ 2>/dev/null || true
  git reset --hard demo-baseline
  git clean -fd
  cp /tmp/shelf-gifs/*.gif docs/gifs/ 2>/dev/null || true
}

restore

vhs tapes/add-field.tape
restore
vhs tapes/add-mutation.tape
restore
vhs tapes/reject-unknown-key.tape
restore
vhs tapes/cancel-button.tape
restore
vhs tapes/role-check.tape
restore
