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
var buble = require('gulp-buble');
var webpack = require('webpack');;
var webpackStream = require('webpack-stream');;
var webpackConfig = require('./webpack/webpack.config.js');
var htmlreplace = require('gulp-html-replace');;
var uglify = require('gulp-uglify');

gulp.task('transpile', function() {
  return gulp.src('./src/*.js')
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
    .pipe(gulp.dest('./app/scripts'))
    .pipe(webpackStream({
      output: {
          filename: 'packed.'+changedFile.path.replace(/^.*[\\\/]/, '')
        }
      }
      ,webpack))
    .pipe(gulp.dest('./app/scripts'));
  });
});

gulp.task('webpack', function() {
  return gulp.src('./app/scripts/*.js')
    .pipe(webpackStream(webpackConfig,webpack))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('watch:server', function(){
  gulp.watch('./src/server/*.js')
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
    .pipe(gulp.dest('./test'))
    .pipe(webpackStream({
      output: {
          filename: 'packed.'+changedFile.path.replace(/^.*[\\\/]/, '')
        }
      }
      ,webpack))
    .pipe(gulp.dest('./test'));
  });
});

gulp.task('build:server', function() {
  return gulp.src('./src/server/*.js')
    .pipe(through.obj((file, enc, cb) => {
      file.contents = new Buffer(flowRemoveTypes(file.contents.toString('utf8')).toString())
      cb(null, file);
    }))
    .pipe(buble())
    .pipe(uglify())
    .pipe(gulp.dest('./dist/server'));
});

gulp.task('copyhtml', function() {
  gulp.src('./app/*.html')
      .pipe(htmlreplace({
          'separate': { src :null, tpl: '<script src="js/%f.bundle.js"></script>' },
          'common': { src :null, tpl: '<script src="js/common.bundle.js"></script>' }
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
  return vfs.src('node_modules',{followSymlinks: false})
    .pipe(vfs.symlink('app')
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
  runSequence('clean-dist','symlink','transpile',['copyhtml','webpack','build:server','copyimages','copyxlspdf'],callback);
}); 

gulp.task('deploy', function ( callback ) {
  runSequence('default','upload1','upload2',callback);
}); 

gulp.task('upload', function ( callback ) {
  runSequence('upload1','upload2',callback);
}); 

gulp.task('default', ['transpile','watch']);
