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
var foreach = require('gulp-foreach');

gulp.task('usemin', function() {
  return gulp.src(['./app/*.html'])
 .pipe(foreach(function (stream, file) {
      return stream
        .pipe(usemin({
          css: [ autoprefixer({ browsers: ['last 2 versions']}),rev() ],
          html: [ minifyHtml({ empty: true }) ],
          js: [ uglify(), rev() ],
          inlinejs: [ uglify() ],
          inlinecss: [ minifyCss(), 'concat' ]
        }))
        // BE CAREFUL!!!
        // This now has the CSS/JS files added to the stream
        // Not just the HTML files you sourced
        .pipe(gulp.dest('dist/'));
    }))
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

gulp.task('default', function ( callback ) {
  runSequence('clean-dist','symlink',['usemin','copyserver','copyimages','copyxlspdf'],callback);
}); 

gulp.task('deploy', function ( callback ) {
  runSequence('default','upload1','upload2',callback);
}); 

gulp.task('upload', function ( callback ) {
  runSequence('upload1','upload2',callback);
}); 
