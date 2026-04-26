#!/bin/sh

# Fail immediately if any command fails
set -e

echo "Running migrations..."
if [ "$NODE_ENV" = "production" ]; then
  npm run migration:run:prod
else
  npm run migration:run
fi

echo "Starting application..."
npm run start:prod

