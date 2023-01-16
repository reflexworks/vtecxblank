#!/bin/sh
npx vtecxutil upload
npx webpack --env entry=/components/index.tsx --mode=production --env externals=true
npx webpack --env entry=/components/login.tsx --mode=production --env externals=true
npx webpack --env entry=/components/change_password.tsx --mode=production --env externals=true
npx webpack --env entry=/components/complete_registration.tsx --mode=production --env externals=true
npx webpack --env entry=/components/forgot_password.tsx --mode=production --env externals=true
npx webpack --env entry=/components/login.tsx --mode=production --env externals=true
npx webpack --env entry=/components/signup.tsx --mode=production --env externals=true
npx webpack --env entry=/components/tutorial_1.tsx --mode=production --env externals=true
npx webpack --env entry=/components/tutorial_2.tsx --mode=production --env externals=true
npx webpack --env entry=/components/tutorial_pagination.tsx --mode=production --env externals=true
npx webpack --env entry=/components/upload_csv_sample.tsx --mode=production --env externals=true
npx webpack --env entry=/components/upload_pictures_sample.tsx --mode=production --env externals=true
npx webpack --env entry=/components/user_terms.tsx --mode=production --env externals=true
