# vtecxblank
blank project for vte.cx

## Setup

Install gulp&flow
```
npm install -g gulp 
npm install -g flow-bin
```
checkout vtecxblank master branch

npm install
```
npm install 
```

gulp makes a symbolic link. It is executed only once.
```
gulp
```

## Usage

gulp serve is to use a local dev environment.
```
gulp serve -h https://{service name}.1.vte.cx
```

with accesstoken, the updated file will be sent to the server at the same time.
```
gulp serve -h https://{service name}.1.vte.cx -k {accesstoken}
```

deploy (The accesstoken can be obtained by admin console.)
```
gulp deploy -h https://{service name}.1.vte.cx -k {accesstoken}
```

## License
MIT
