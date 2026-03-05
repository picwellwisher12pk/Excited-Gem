#!/bin/bash
# Sync build output from WSL to Windows for browser loading
SOURCE="build/chrome-mv3-dev/"
DEST="/mnt/c/Users/amir/Documents/Projects/Personal/excited-gem/build/chrome-mv3-dev/"

mkdir -p "$DEST"

echo "Watching $SOURCE and syncing to $DEST..."

# Initial sync
rsync -av --delete "$SOURCE" "$DEST"

# Use a loop to sync every few seconds (since inotifywait is not available)
while true; do
  rsync -av --delete "$SOURCE" "$DEST" > /dev/null 2>&1
  sleep 1
done
