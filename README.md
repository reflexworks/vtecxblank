# vtecxblank
blank project for vte.cx

## Setup

Install gulp
```
npm install -g gulp 
```
checkout vtecxblank master branch

npm install
```
npm install 
```

gulp makes a symbolic link. It is enough to be executed only once.
```
gulp
```

## Usage

gulp serve is to use a local dev environment.
```
gulp serve -h https://{service name}.1.vte.cx
```

deploy (The accesstoken be able to obtain by admin console.)
```
gulp deploy -h https://{service name}.1.vte.cx -k {accesstoken}
```

## License
MIT
