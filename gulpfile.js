var gulp = require('gulp');
var minifyHtml = require('gulp-minify-html');
var rev = require('gulp-rev');
var webserver  = require('gulp-webserver');
var imagemin  = require('gulp-imagemin');
var vfs = require('vinyl-fs'); 
var runSequence = require('run-sequence');
var exec = require('child_process').exec;
var clean = require('gulp-clean');
var argv = require('minimist')(process.argv.slice(2));
var flow = require('gulp-flowtype');
var flowRemoveTypes = require('flow-remove-types');
var through = require('through2');
var webpack = require('webpack');;
var webpackStream = require('webpack-stream');;
var htmlreplace = require('gulp-html-replace');;
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var eventStream = require('event-stream');
var fs = require('fs');
var tap = require('gulp-tap');

gulp.task('removetypes', function() {
  return gulp.src('./app/scripts/*.js')
    .pipe(through.obj((file, enc, cb) => {
      file.contents = new Buffer(flowRemoveTypes(file.contents.toString('utf8')).toString())
      cb(null, file);
    }))
    .pipe(gulp.dest('./app/build'));
});

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
    .pipe(through.obj((file, enc, cb) => {
      file.contents = new Buffer(flowRemoveTypes(file.contents.toString('utf8')).toString())
      cb(null, file);
    }))
    .pipe(gulp.dest('./app/build'))
    .pipe(webpackStream({
      output: {
          filename: changedFile.path.replace(/^.*[\\\/]/, '')
        },
        module: {
            rules: [
                  {
                          test: /\.(js)$/,
                          use: { loader: 'buble-loader'}
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
	  .pipe(htmlreplace({
          'common': { src :null, tpl: '<script src="scripts/common.bundle.js"></script>' }
      }))
      .pipe(minifyHtml({ empty: true }))
      .pipe(gulp.dest('./dist'))
  });
});

function webpack_scripts(done) { webpack_file('common.bundle.js','./app/build','./dist/scripts'); return webpack_files('./app/build','./dist/scripts',done) };

function webpack_files(src,dest,done) {
  var tasks = tap(function(file){
    var filename = file.path.replace(/^.*[\\\/]/, '').match(/(.*)(?:\.([^.]+$))/)[1]+'.js';
  	return webpack_file(filename,src,dest);   
  });
  eventStream.merge(tasks).on('end', done);
  return tasks;
}

function webpack_file(filename,src,dest) {

    var srcfile = src+'/'+filename;
    fs.stat(srcfile, function(err, stat) {
	    if(err == null||filename==='common.bundle.js') {
	      return gulp.src(srcfile)
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
		                          use: { loader: 'buble-loader'}
		                  }
		            ]
		        },
		        plugins: [
//		          new webpack.optimize.UglifyJsPlugin({sourceMap: true}),  // minify
 				  new webpack.ProvidePlugin({
	               		 $: "jquery",
	          		jQuery: "jquery"
            	  })		          
		        ]
//		        ,devtool: 'source-map'
		      }
	      ,webpack))
	      .pipe(gulp.dest(dest))
	    }
	});
}

gulp.task('build:htmlscripts',['symlink','removetypes'], function(done){
  gulp.src('./app/*.html')
      .pipe(htmlreplace({
          'common': { src :null, tpl: '<script src="scripts/common.bundle.js"></script>' }
      }))
      .pipe(minifyHtml({ empty: true }))
      .pipe(gulp.dest('./dist'))
      .pipe(webpack_scripts(done));
});

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
    .pipe(through.obj((file, enc, cb) => {
      file.contents = new Buffer(flowRemoveTypes(file.contents.toString('utf8')).toString())
      cb(null, file);
    }))
    .pipe(gulp.dest('./app/build/server'))
    .pipe(webpackStream({
      output: {
          filename: changedFile.path.replace(/^.*[\\\/]/, '')
        },
        module: {
            rules: [
                  {
                          test: /\.(js)$/,
                          use: { loader: 'buble-loader'}
                  }
            ]
        }
        ,devtool: 'source-map'        
      }
      ,webpack))
    .pipe(gulp.dest('./test'));
  });
});

gulp.task('build:server_scripts', function(done) {
  return gulp.src('./app/server/*.js')
    .pipe(through.obj((file, enc, cb) => {
      file.contents = new Buffer(flowRemoveTypes(file.contents.toString('utf8')).toString())
      cb(null, file);
    }))
    .pipe(gulp.dest('./app/build/server'))
    .pipe(webpack_files('./app/build/server','./dist/server',done));      
});

gulp.task('build:server_test', function(done){
  gulp.src('./test/*.html')
      .pipe(webpack_files('./app/build/server','./test',done));      
});

gulp.task('build:server', function ( callback ) {
  runSequence('clean-dist',['build:server_scripts','build:server_test']);
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

gulp.task('upload1', function (cb) {
  exec('./rxcp.sh '+argv.k+' dist '+argv.h+' content', function (err, stdout, stderr) {
    console.log(stdout);
    cb(err);
  });
})

gulp.task('upload2', function (cb) {
  exec('./rxcp.sh '+argv.k+' setup '+argv.h+'/d', function (err, stdout, stderr) {
    console.log(stdout);
    cb(err);
  });
})

gulp.task('build:client', function ( callback ) {
  runSequence('clean-dist',['build:htmlscripts','copy:images']);
}); 
gulp.task('build', function ( callback ) {
  runSequence('clean-dist',['build:htmlscripts','copy:images','build:server_scripts','build:server_test']);
}); 
gulp.task('deploy', function ( callback ) {
  runSequence('build','upload',callback);
}); 

gulp.task('upload', function ( callback ) {
  runSequence('upload1','upload2',callback);
}); 

gulp.task('watch', ['watch:scripts','watch:html']);

gulp.task('default', function ( callback ) {
  runSequence('build:htmlscripts','watch',callback);
}); 
