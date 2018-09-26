# vtecxblank
a blank project for vte.cx

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

gulp to build and make a symbolic link. It is executed only once.
```
gulp
```

## Usage

gulp serve is to use a local dev environment.
```
gulp serve -t http://{servicename}.vte.cx
```

With accesstoken, the updated file will be sent to the server at the same time. (The accesstoken can be obtained by admin console.)
```
gulp serve -t http://{servicename}.vte.cx -k {accesstoken}
```

-F option is to fix the target file.
```
gulp serve -F index.tsx -t http://{servicename}.vte.cx -k {accesstoken}
```

deploy 
```
gulp deploy -t http://{servicename}.vte.cx -k {accesstoken}
```

## License
MIT
