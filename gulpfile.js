const gulp = require('gulp');
const minifyHtml = require('gulp-minify-html');
const webserver  = require('gulp-webserver');
const imagemin  = require('gulp-imagemin');
const vfs = require('vinyl-fs'); 
const runSequence = require('run-sequence');
const exec = require('child_process').exec;
const clean = require('gulp-clean');
const argv = require('minimist')(process.argv.slice(2));
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const gutil = require('gulp-util');
const eventStream = require('event-stream');
const fs = require('fs-sync');
const tap = require('gulp-tap');
const BabiliPlugin = require('babili-webpack-plugin');
const recursive = require('recursive-readdir');

gulp.task('watch:components', function(){
  gulp.watch('./src/components/*.js')
  .on('change', function(changedFile) {
    let srcfile = changedFile.path
    if (argv.f) {
      srcfile = './src/components/'+ argv.f
    }
    gulp.src(srcfile)
    .pipe(webpackStream({
      output: {
          filename: srcfile.replace(/^.*[\\\/]/, '')
        },
        module: {
            rules: [
		                  {
		                          test: /\.css$/,
		                          use: [ 'style-loader', 'css-loader' ]
		                  },
		                  {
		                          test: /\.(png|gif|svg|ttf|woff|woff2|eot)$/,
		                          use: { loader: 'url-loader', options: { limit: 100000 } },
		                  },
		                  {
		                          test: /\.(jpg)$/,
		                          use: { loader: 'file-loader', options: { name : '[name].[ext]'}}
		                  },
		                  {
		                          test: /\.(js)$/,
		                          use: { loader: 'babel-loader'},
                              exclude: /node_modules/
		                  },
                      {
                              test: /\.js$/,
                              exclude: /(node_modules)/,
                              loader: 'eslint-loader',
                              options: {
                                fix: true,
                                failOnError: true,
                              }
                      }                      
            ]
        },
        externals: {
            "react": "React",
            "react-dom": "ReactDOM",
            "react-bootstrap": "ReactBootstrap",
            "react-router-dom": "ReactRouterDOM",            
            "axios": "axios"
        },
        plugins: [
            new BabiliPlugin()		          
        ]
        ,devtool: 'source-map'
      }
      ,webpack))
      .on('error', gutil.log)
    .pipe(gulp.dest('./dist/components'))
    .on('end',function(){
      if (argv.k) {
        const p = changedFile.path.match(/(.*)(?:\.([^.]+$))/);
        if (p&&p[2]!=='map') {
          const filename = 'dist/components/'+srcfile.replace(/^.*[\\\/]/, '').match(/(.*)(?:\.([^.]+$))/)[1]+'.js';
          sendcontent(filename);
        }        
      }
    })
  });
});


gulp.task('watch:html', function(){
  gulp.watch('./src/*.html')
  .on('change', function(changedFile) {
	gutil.log('copied:'+changedFile.path.replace(/^.*[\\\/]/, ''));
    gulp.src(changedFile.path)
      .pipe(minifyHtml({ empty: true }))
      .pipe(gulp.dest('./dist'))
      .on('end',function(){
      if (argv.k) {
        const filename = 'dist/'+changedFile.path.replace(/^.*[\\\/]/, '').match(/(.*)(?:\.([^.]+$))/)[1]+'.html';
        sendcontent(filename);
      }
      })
  });
});

gulp.task('watch:settings', function(){
  gulp.watch('./setup/_settings/*')
  .on('change', function(changedFile) {
    const file = './setup/_settings/'+changedFile.path.replace(/^.*[\\\/]/, '')
    sendentry(file, null)
  });
});

function webpack_files(src,dest,done) {
  let filenames = [];
  let streams = tap(function(file){
    const filename = file.path.replace(/^.*[\\\/]/, '').match(/(.*)(?:\.([^.]+$))/)[1]+'.js';
      if (fs.exists(src+'/'+filename)) {
          filenames.push(filename);
      }
  });

  eventStream.merge(streams).on('end', function() { 
    let tasks = filenames.map(function(filename) {
        return webpack_file(filename,src,dest);   
      }
    );
    eventStream.merge(tasks).on('end', done); 
  });

return streams;
}

function webpack_file(filename,src,dest) {
	      return gulp.src(src+'/'+filename)
	      .pipe(webpackStream({
		      output: {
		          filename: filename
		        },
		        module: {
		            rules: [
		                  {
		                          test: /\.css$/,
		                          use: [ 'style-loader', 'css-loader' ]
		                  },
		                  {
		                          test: /\.(png|gif|svg|ttf|woff|woff2|eot)$/,
		                          use: { loader: 'url-loader', options: { limit: 100000 } },
		                  },
		                  {
		                          test: /\.(jpg)$/,
		                          use: { loader: 'file-loader', options: { name : '[name].[ext]'}}
		                  },
		                  {
		                          test: /\.(js)$/,
		                          use: { loader: 'babel-loader'},
                              exclude: /node_modules/
		                  },
                      {
                              test: /\.js$/,
                              exclude: /(node_modules)/,
                              loader: 'eslint-loader',
                              options: {
                                fix: true,
                                failOnError: true,
                              }
                      }                      
		            ]
		        },
            externals: {
                "react": "React",
                "react-dom": "ReactDOM",
                "react-bootstrap": "ReactBootstrap",
                "react-router-dom": "ReactRouterDOM",            
                "axios": "axios"
            },
		        plugins: [
                new BabiliPlugin()		          
		        ]
//		        ,devtool: 'source-map'
		      }
	      ,webpack))
	      .pipe(gulp.dest(dest))
}

gulp.task('build:html_components',['copy:pdf','copy:xls'], function(done){
  gulp.src('./src/*.html')
      .pipe(minifyHtml({ empty: true }))
      .pipe(gulp.dest('./dist'))
      .pipe(webpack_files('./src/components','./dist/components',done));
});

gulp.task('upload:content', function(){
  recursive('dist', [sendcontent],function(){});
});

gulp.task('upload:server', function(){
  recursive('dist/server', [sendcontent],function(){});
});

gulp.task('upload:entry', function(){
  recursive('setup', [sendentry],function(){});
});

function sendcontent(file, stats) { 
  const argvh = argv.h.substr( argv.h.length-1 ) === '/' ? argv.h.substr(0,argv.h.length-1) : argv.h;
  curl(getargs(file,stats,argvh,'?_content'),file,argvh,false)
;}

function sendentry(file, stats) {  
  const argvh = argv.h.substr( argv.h.length-1 ) === '/' ? argv.h.substr(0,argv.h.length-1)+'/d' : argv.h+'/d';
  curl(getargs(file,stats,argvh,''),file,argvh,true);
}

function getargs(file, stats, argvh, option) {
  let args = '';
  if (stats&&stats.isDirectory()) {
    args += '-H "Authorization:Token '+argv.k+'"';
    args += ' -H "Content-Type:'+gettype(file)+'"';
    args += ' -H "Content-Length:0"';
    args += ' -X PUT '+argvh+file.substring(file.indexOf('/'))+'?_content';
  }else {
    args += '-H "Authorization:Token '+argv.k+'"';
    args += ' -H "Content-Type:'+gettype(file)+'"';
    args += ' -T '+file;
    args += ' '+argvh+file.substring(file.indexOf('/'))+option;    
  }
  return args;
}

function curl(args,file,argvh,isentry) {
  exec('curl '+args,function (err, stdout, stderr) {
    if (isentry) {
      console.log(file);
    }else {
      console.log(file+' --> '+argvh+file.substring(file.indexOf('/')));
    }
    console.log(stdout);
    console.log(stderr);
  });
}

function gettype(file) {
  const ext = file.match(/(.*)(?:\.([^.]+$))/);
  if (ext&&ext[2]) {
    switch (ext[2]){
    case 'json':
      return 'application/json';
    case 'xml':
      return 'text/xml';
    case 'html':
      return 'text/html;charset=UTF-8';
    case 'js':
      return 'text/javascript;charset=UTF-8';
    case 'css':
      return 'text/css;charset=UTF-8';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'jpeg':
      return 'image/jpeg';
    case 'jpg':
      return 'image/jpeg';
    default:
      return 'application/octet-stream';
  }
 }
 return 'application/octet-stream';
}

gulp.task('watch:server',['watch:settings'], function(){
  gulp.watch('./src/server/*.js')
  .on('change', function(changedFile) {
    let srcfile = changedFile.path
    if (argv.f) {
      srcfile = './src/server/'+ argv.f
    }
    gulp.src(srcfile)
    .pipe(webpackStream({
      output: {
          filename: srcfile.replace(/^.*[\\\/]/, '')
        },
        module: {
            rules: [
		                  {
		                          test: /\.(js)$/,
		                          use: { loader: 'babel-loader'},
                              exclude: /node_modules/
		                  },
                      {
                              test: /\.js$/,
                              exclude: /(node_modules)/,
                              loader: 'eslint-loader',
                              options: {
                                fix: true,
                                failOnError: true,
                              }
                      }                      
            ]
        }
        ,plugins: [
            new BabiliPlugin()              
        ]
        ,devtool: 'source-map'        
      }
      ,webpack))
      .on('error', gutil.log)      
      .pipe(gulp.dest('./test/server'))
      .on('end',function(){
      if (argv.k) {
        const p = changedFile.path.match(/(.*)(?:\.([^.]+$))/);
        if (p&&p[2]!=='map') {
          const filename = 'test/server/'+srcfile.replace(/^.*[\\\/]/, '').match(/(.*)(?:\.([^.]+$))/)[1]+'.js';
          sendcontent(filename);
        }        
      }
    });
  });
});

gulp.task('build:server_dist', function(done){
  gulp.src('./test/*.html')
      .pipe(webpack_files('./src/server','./dist/server',done));      
});

gulp.task('build:server_test', function(done){
  gulp.src('./test/*.html')
      .pipe(webpack_files('./src/server','./test/server',done));      
});

gulp.task('build:server', function ( callback ) {
  runSequence('clean-dist',['build:server_dist','build:server_test']);
}); 

gulp.task( 'copy:images', function() {
    return gulp.src(
        [ 'src/img/**' ],
        { base: 'src' }
    ).pipe( imagemin() ) 
    .pipe( gulp.dest( 'dist' ) );
} );

gulp.task( 'copy:pdf', function() {
    return gulp.src(
        [ 'src/pdf/**' ],
        { base: 'src' }
    ).pipe( gulp.dest( 'dist' ) );
} );

gulp.task( 'copy:xls', function() {
    return gulp.src(
        [ 'src/xls/**' ],
        { base: 'src' }
    ).pipe( gulp.dest( 'dist' ) );
} );

gulp.task('symlink', function () {
     vfs.src('dist/server',{followSymlinks: false})
       .pipe(vfs.symlink('test'));
 });

gulp.task('serve', ['watch','watch:server'],function() {
	return serve('dist');
});

gulp.task('serve:server', ['symlink','watch:server'],function() {
	return serve('test');
});

function serve(tgt) {
  let target = argv.h; 
  if (target) {
    if (target.match(/https/)) {
      target = target.replace(/https/,'http');
      gutil.log('using HTTP instead of HTTPS.:'+target);
    }
    target = target.substr( target.length-1 ) === '/' ? target.substr(0,target.length-1) : target;
  }
  return gulp.src(tgt)
    .pipe(webserver({
      livereload: true,
      open: true,
      proxies: [
        {
          source: '/d',
          target: target+'/d'
        },
        {
          source: '/s',
          target: target+'/s'
        },
        {
          source: '/xls',
          target: target+'/xls'
        }
      ]      
    }));
}

// distフォルダ内を一度全て削除する
gulp.task('clean-dist', function () {
    return gulp.src([
        'dist/{,**/}*.html', // 対象ファイル
        'dist/components',
        'dist/server',
        'dist/pdf',
        'dist/xls',
        'dist/img'
    ], {read: false} )
    .pipe(clean());
});

gulp.task('build:client', function ( callback ) {
  runSequence('clean-dist',['build:html_components','copy:images']);
}); 
gulp.task('build', function ( callback ) {
  runSequence('clean-dist',['build:html_components','copy:images'],['build:server_dist','build:server_test']);
}); 
gulp.task('deploy', function ( callback ) {
  runSequence('clean-dist',['build:html_components','copy:images'],'build:server_dist','upload');
}); 

gulp.task('deploy:server', function ( callback ) {
  runSequence('clean-dist','build:server_dist','upload:server');
}); 

gulp.task('upload', ['upload:content','upload:entry']);

gulp.task('watch', ['watch:components','watch:html','watch:settings']);

gulp.task('default', function ( callback ) {
  runSequence('build',callback);
}); 
