# vtecxblank
a blank project for vte.cx

## Setup

checkout vtecxblank master branch

npm install
```
npm install
```

## Usage

login
```
npm run login

service:fooservice
is production?:n
login:foo@bar.com
password:*********
Logged in.
```

webpack-dev-server
```
npm run serve -- --env.entry=/components/login.tsx
```

webpack-dev-server(index.tsx)
```
npm run serve:index
```

webpack-dev-server(login.tsx)
```
npm run serve:login
```

watch & deploy
```
npm run watch -- --env.entry=/components/login.tsx
```

watch & deploy(index.tsx)
```
npm run watch:index
```

watch & deploy(server)
```
npm run watch:server -- --env.entry=/server/foo.tsx
```

deploy(index.tsx)
```
npm run deploy:index
```

deploy(all)
```
./deploy.sh
```

download(template,schema,properties,bigquery.json,folderacls)
```
npm run download
```

download schema
```
npm run download:template
```

download index.d.ts(TypeScript Interface)
```
npm run download:typings
```

download properties
```
npm run download:properties
```

download bigquery.json
```
npm run download:bigquery.json
```

download folderacls
```
npm run download:folderacls
```

upload(all)
```
npm run upload
```

upload schema
```
npm run upload:template
```

upload contents
```
npm run upload:htmlfolders
```

upload folderacls
```
npm run upload:folderacls
```

upload data
```
npm run upload:data
```

clean
```
npm run clean
```

clean(server)
```
npm run clean:server
```

## License
MIT
