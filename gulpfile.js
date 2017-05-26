var gulp = require('gulp');
var minifyHtml = require('gulp-minify-html');
var webserver  = require('gulp-webserver');
var imagemin  = require('gulp-imagemin');
var vfs = require('vinyl-fs'); 
var runSequence = require('run-sequence');
var exec = require('child_process').exec;
var clean = require('gulp-clean');
var argv = require('minimist')(process.argv.slice(2));
var flow = require('gulp-flowtype');
var webpack = require('webpack');;
var webpackStream = require('webpack-stream');;
var htmlreplace = require('gulp-html-replace');;
var gutil = require('gulp-util');
var eventStream = require('event-stream');
var fs = require('fs-sync');
var tap = require('gulp-tap');
var BabiliPlugin = require('babili-webpack-plugin');
var recursive = require('recursive-readdir');

gulp.task('watch:scripts', function(){
  gulp.watch('./app/scripts/*.js')
  .on('change', function(changedFile) {
    gulp.src(changedFile.path)
/*      .pipe(flow({
      all: false,
      weak: false,
      declarations: './declarations',
      killFlow: false,
      beep: true
    })) */
    .pipe(webpackStream({
      output: {
          filename: changedFile.path.replace(/^.*[\\\/]/, '')
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
        }
        ,devtool: 'source-map'        
      }
      ,webpack))
    .pipe(gulp.dest('./dist/scripts'));
  });
});

gulp.task('watch:html', function(){
  gulp.watch('./app/*.html')
  .on('change', function(changedFile) {
	gutil.log('copied:'+changedFile.path.replace(/^.*[\\\/]/, ''));
    gulp.src(changedFile.path)
      .pipe(minifyHtml({ empty: true }))
      .pipe(gulp.dest('./dist'))
  });
});

function webpack_files(src,dest,done) {
  var filenames = [];
  var streams = tap(function(file){
    var filename = file.path.replace(/^.*[\\\/]/, '').match(/(.*)(?:\.([^.]+$))/)[1]+'.js';
      if (fs.exists(src+'/'+filename)) {
          filenames.push(filename);
      }
  });

  eventStream.merge(streams).on('end', function() { 
    var tasks = filenames.map(function(filename) {
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
		        plugins: [
     				  new webpack.ProvidePlugin({
	               		 $: "jquery",
	          		jQuery: "jquery"
            	  })
//                new BabiliPlugin()		          
		        ]
//		        ,devtool: 'source-map'
		      }
	      ,webpack))
	      .pipe(gulp.dest(dest))
}

gulp.task('build:html_scripts',['symlink'], function(done){
  gulp.src('./app/*.html')
      .pipe(minifyHtml({ empty: true }))
      .pipe(gulp.dest('./dist'))
      .pipe(webpack_files('./app/scripts','./dist/scripts',done));
});

gulp.task('upload_content', function(cb){
  recursive('dist', [sendcontent],function(){});
});

gulp.task('upload_entry', function(){
  recursive('setup', [sendentry],function(){});
});

function sendcontent(file, stats) { 
  curl(getargs(file,stats,argv.h,'?_content'),file,argv.h)
;}

function sendentry(file, stats) {  
  var argvh = argv.h+'/d';
  curl(getargs(file,stats,argvh,''),file,argvh);
}

function getargs(file, stats, argvh, option) {
  var args = '';
  if (stats.isDirectory()) {
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

function curl(args,file,argvh) {
  exec('curl '+args,function (err, stdout, stderr) {
    console.log(file+' --> '+argvh+file.substring(file.indexOf('/')));
    console.log(stdout);
    console.log(stderr);
  });
}

function gettype(file) {
  var ext = file.match(/(.*)(?:\.([^.]+$))/);
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

gulp.task('watch:server', function(){
  gulp.watch('./app/server/*.js')
  .on('change', function(changedFile) {
    gulp.src(changedFile.path)
    .pipe(flow({
      all: false,
      weak: false,
      declarations: './declarations',
      killFlow: false,
      beep: true
    })) 
    .pipe(webpackStream({
      output: {
          filename: changedFile.path.replace(/^.*[\\\/]/, '')
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
        ,devtool: 'source-map'        
      }
      ,webpack))
    .pipe(gulp.dest('./test'));
  });
});

gulp.task('build:server_dist', function(done){
  gulp.src('./test/*.html')
      .pipe(webpack_files('./app/server','./dist/server',done));      
});

gulp.task('build:server_test', function(done){
  gulp.src('./test/*.html')
      .pipe(webpack_files('./app/server','./test',done));      
});

gulp.task('build:server', function ( callback ) {
  runSequence('clean-dist',['build:server_dist','build:server_test']);
}); 

gulp.task( 'copy:images', function() {
    return gulp.src(
        [ 'app/img/**' ],
        { base: 'app' }
    ).pipe( imagemin() ) 
    .pipe( gulp.dest( 'dist' ) );
} );

gulp.task('symlink', function () {
    vfs.src('node_modules',{followSymlinks: false})
    	.pipe(vfs.symlink('app'));
    vfs.src('app/pdf',{followSymlinks: false})
    	.pipe(vfs.symlink('dist'));
    vfs.src('app/xls',{followSymlinks: false})
    	.pipe(vfs.symlink('dist'));
});

gulp.task('serve', ['watch'],function() {
	return serve('dist');
});

gulp.task('serve:server', ['watch:server'],function() {
	return serve('test');
});

function serve(tgt) {
  return gulp.src(tgt)
    .pipe(webserver({
      livereload: true,
      open: true,
      proxies: [
        {
          source: '/d',
          target: argv.h+'/d'
        },
        {
          source: '/s',
          target: argv.h+'/s'
        },
        {
          source: '/xls',
          target: argv.h+'/xls'
        },
        {
          source: '/css',
          target: argv.h+'/css'
        }
      ]      
    }));
}

// distフォルダ内を一度全て削除する
gulp.task('clean-dist', function () {
    return gulp.src([
        'dist/{,**/}*.html', // 対象ファイル
        'dist/css',
        'dist/scripts',
        'dist/server',
        'dist/img',
        'app/build/*.js',
        'app/build/server/*.js'
    ], {read: false} )
    .pipe(clean());
});

gulp.task('build:client', function ( callback ) {
  runSequence('clean-dist',['build:html_scripts','copy:images']);
}); 
gulp.task('build', function ( callback ) {
  runSequence('clean-dist',['build:html_scripts','copy:images'],['build:server_dist','build:server_test']);
}); 
gulp.task('deploy', function ( callback ) {
  runSequence('clean-dist',['build:html_scripts','copy:images'],'build:server_dist','upload');
}); 

gulp.task('upload', ['upload_content','upload_entry']);

gulp.task('watch', ['watch:scripts','watch:html']);

gulp.task('default', function ( callback ) {
  runSequence('build:html_scripts','watch',callback);
}); 
