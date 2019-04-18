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

deploy(index.tsx)
```
npm run deploy:index
```

deploy(services)
```
./deploy.sh
```

download schema
```
npm run download:template
```

download index.d.ts(TypeScript Interface)
```
npm run download:typings
```

upload
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
