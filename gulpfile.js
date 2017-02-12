var gulp = require('gulp');
var minifyHtml = require('gulp-minify-html');
var rev = require('gulp-rev');
var webserver  = require('gulp-webserver');
var imagemin  = require('gulp-imagemin');
var symlink = require('gulp-symlink'); 
var runSequence = require('run-sequence');
var exec = require('child_process').exec;
var clean = require('gulp-clean');
var argv = require('minimist')(process.argv.slice(2));
var foreach = require('gulp-foreach');
var flow = require('gulp-flowtype');
var flowRemoveTypes = require('flow-remove-types');
var through = require('through2');
var buble = require('gulp-buble');
var webpack = require('webpack');;
var webpackStream = require('webpack-stream');;
var webpackConfig = require('./webpack/webpack.config.js');
var serverWebpackConfig = require('./webpack/server.webpack.config.js');
var htmlreplace = require('gulp-html-replace');;
var uglify = require('gulp-uglify');

gulp.task('transpile', function() {
  return gulp.src('./src/*.js')
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
    .pipe(buble())
    .pipe(gulp.dest('./app/scripts'));
});

gulp.task('watch', function(){
  gulp.watch('./src/*.js')
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
    .pipe(buble())
    .pipe(gulp.dest('./app/scripts'));    
  });
});

gulp.task('webpack', function() {
  return gulp.src('./app/scripts/*.js')
    .pipe(webpackStream(webpackConfig,webpack))
    .pipe(gulp.dest('./dist'));
});


gulp.task('build_server', function() {
  return gulp.src('./app/server/*.js')
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
    .pipe(buble())
    .pipe(uglify())
    .pipe(gulp.dest('./dist/server'));
});

gulp.task('webpack_server', function() {
  return gulp.src('./dist/server/*.js')
    .pipe(webpackStream(serverWebpackConfig,webpack))
    .pipe(gulp.dest('./test'));
});

gulp.task('html', function() {
  gulp.src('./app/*.html')
      .pipe(htmlreplace({
          'separate': { src :null, tpl: '<script src="%f.bundle.js"></script>' },
          'common': { src :null, tpl: '<script src="common.bundle.js"></script>' }
      }))
      .pipe(minifyHtml({ empty: true }))
      .pipe(gulp.dest('dist/'));
});

gulp.task( 'copyimages', function() {
    return gulp.src(
        [ 'app/img/**' ],
        { base: 'app' }
    ).pipe( imagemin() ) 
    .pipe( gulp.dest( 'dist' ) );
} );

gulp.task( 'copyxlspdf', function() {
    return gulp.src(
        [ 'app/xls/**','app/pdf/**' ],
        { base: 'app' }
    ).pipe( gulp.dest( 'dist' ) );
} );

gulp.task('symlink', function () {
  return gulp.src('node_modules')
    .pipe(symlink('app/node_modules',{force: true})
    ); 
});

gulp.task('serve', function() {
  var tgt = 'app';
  if (argv.t) tgt = argv.t;
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
        },
        {
          source: '/js',
          target: argv.h+'/js'
        }
      ]      
    }));
});
// distフォルダ内を一度全て削除する
gulp.task('clean-dist', function () {
    return gulp.src([
        'dist/{,**/}*.html', // 対象ファイル
        'dist/css',
        'dist/js',
        'dist/xls',
        'dist/pdf',
        'dist/server',
        'dist/img'
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

gulp.task('build', function ( callback ) {
  runSequence('clean-dist','symlink','compile',['html','webpack','build_server','copyimages','copyxlspdf'],callback);
}); 

gulp.task('deploy', function ( callback ) {
  runSequence('default','upload1','upload2',callback);
}); 

gulp.task('upload', function ( callback ) {
  runSequence('upload1','upload2',callback);
}); 

gulp.task('default', ['transpile','watch']);
