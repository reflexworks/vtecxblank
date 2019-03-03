#!/bin/sh
npx webpack --env.entry=/components/login.tsx --env.mode=production --env.externals=true
npx webpack --env.entry=/components/change_password.tsx --env.mode=production --env.externals=true
npx webpack --env.entry=/components/complete_registration.tsx --env.mode=production --env.externals=true
npx webpack --env.entry=/components/forgot_password.tsx --env.mode=production --env.externals=true
npx webpack --env.entry=/components/login.tsx --env.mode=production --env.externals=true
npx webpack --env.entry=/components/signup.tsx --env.mode=production --env.externals=true
npx webpack --env.entry=/components/tutorial_1.tsx --env.mode=production --env.externals=true
npx webpack --env.entry=/components/tutorial_2.tsx --env.mode=production --env.externals=true
npx webpack --env.entry=/components/tutorial_pagination.tsx --env.mode=production --env.externals=true
npx webpack --env.entry=/components/upload_csv_sample.tsx --env.mode=production --env.externals=true
npx webpack --env.entry=/components/upload_pictures_sample.tsx --env.mode=production --env.externals=true
npx webpack --env.entry=/components/user_terms.tsx --env.mode=production --env.externals=true
