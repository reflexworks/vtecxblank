#!/bin/sh
npx vtecxutil upload
npx rspack --env entry=/components/index.tsx --mode=production
npx rspack --env entry=/components/login.tsx --mode=production
npx rspack --env entry=/components/change_password.tsx --mode=production
npx rspack --env entry=/components/complete_registration.tsx --mode=production
npx rspack --env entry=/components/forgot_password.tsx --mode=production
npx rspack --env entry=/components/login.tsx --mode=production
npx rspack --env entry=/components/signup.tsx --mode=production
npx rspack --env entry=/components/user_terms.tsx --mode=production
