var gulp = require('gulp');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var rev = require('gulp-rev');
var webserver  = require('gulp-webserver');
var imagemin  = require('gulp-imagemin');
var symlink = require('gulp-symlink'); 
var runSequence = require('run-sequence');
var exec = require('child_process').exec;
var clean = require('gulp-clean');
var autoprefixer = require('gulp-autoprefixer');
var argv = require('minimist')(process.argv.slice(2));

gulp.task('usemin', function() {
  return gulp.src(['./app/login.html'])
    .pipe(usemin({
      css: [ rev() ],
      html: [ minifyHtml({ empty: true }) ],
      js: [ uglify(), rev() ],
      inlinejs: [ uglify() ],
      inlinecss: [ minifyCss(), 'concat' ]
    }))
    .pipe(gulp.dest( 'dist' ));
});

gulp.task( 'copyserver', function() {
    return gulp.src(
        [ 'app/server/*.js' ],
        { base: 'app' }
    ).pipe( uglify() )
    .pipe( gulp.dest( 'dist' ) );
} );

gulp.task( 'copyimages', function() {
    return gulp.src(
        [ 'app/img/**' ],
        { base: 'app' }
    ).pipe( imagemin() ) 
    .pipe( gulp.dest( 'dist' ) );
} );

gulp.task('symlink', function () {
  return gulp.src('node_modules')
    .pipe(symlink('app/node_modules',{force: true})
    ); 
});

gulp.task('serve', function() {
  gulp.src('app')
    .pipe(webserver({
      livereload: true,
      open: true,
      proxies: [
        {
          source: '/d',
          target: argv.h+'/d'
        },
        {
          source: '/login.html',
          target: argv.h+'/login.html'
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
        'dist/img'
    ], {read: false} )
    .pipe(clean());
});

// ベンダープレフィックス付与設定
gulp.task('autoprefixer', function () {
    return gulp.src( 'app/{,**/}*.css' ) // 読み込みファイル
    .pipe(autoprefixer({
        browsers: ['last 2 versions'] // 対象ブラウザの設定
    }))
    .pipe( gulp.dest( 'dist' ) ); // 書き出しファイル
});

gulp.task('upload1', function (cb) {
  exec('./rxcp.sh dist '+argv.h+' content', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
})

gulp.task('upload2', function (cb) {
  exec('./rxcp.sh setup '+argv.h+'/d', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
})

gulp.task('default', function ( callback ) {
  runSequence('clean-dist','symlink',['autoprefixer','usemin','copyserver','copyimages'],callback);
}); 

gulp.task('deploy', function ( callback ) {
  runSequence('default','upload1','upload2',callback);
}); 
