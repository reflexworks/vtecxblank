#!/bin/sh
npx rspack --env entry=/server/hello-world.tsx --mode=production
npx rspack --env entry=/server/hello-world-error.tsx --mode=production
