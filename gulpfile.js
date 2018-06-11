const gulp = require('gulp')
const minifyHtml = require('gulp-minify-html')
const webserver  = require('gulp-webserver')
const imagemin  = require('gulp-imagemin')
const vfs = require('vinyl-fs') 
const runSequence = require('run-sequence')
const clean = require('gulp-clean')
const argv = require('minimist')(process.argv.slice(2))
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const gutil = require('gulp-util')
const eventStream = require('event-stream')
const fs = require('fs-sync')
const fsasync = require('fs')
const tap = require('gulp-tap')
const recursive = require('recursive-readdir')
const request = require('request')
const mocha = require('gulp-mocha')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

function webpackconfig(filename,externals,devtool) { 
	return {
		mode: devtool ? 'development' : 'production',
		output: {
			filename: filename.replace(/(.tsx)|(.ts)/g,'.js')
		},
		module: {
			rules: [
				{
					test: /\.css$/,
					use: [ 'style-loader', 'css-loader' ]
				},
				{
					test: /\.sass$/,
					use: [ 'style-loader', 'css-loader', 'sass-loader' ]

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
					test: /\.tsx?$/,
					use: { loader: 'awesome-typescript-loader'}
				},
				{
					enforce: 'pre',
					test: /\.js$/,
					use: { loader: 'source-map-loader'},
					exclude: /node_modules/
				},
				{
					test: /\.(js|ts|tsx)$/,
					exclude: /(node_modules)/,
					use: { loader: 'eslint-loader', options: { emitWarning: true,fix:true,failOnError: true } }
				}                      
			]
		},
		resolve: {
			extensions: [
				'.ts', '.tsx', '.js'
			]
		},		
		externals: externals ? {
			'react': 'React',
			'react-dom': 'ReactDOM',
			'react-bootstrap': 'ReactBootstrap',
			'react-router-dom': 'ReactRouterDOM',            
			'axios': 'axios'
		} : {
		},
		plugins: devtool ? [
			new webpack.LoaderOptionsPlugin({ options: {} })			
		] : [
			new webpack.LoaderOptionsPlugin({ options: {} }),
			 /* UglifyJsPluginの実行 */
			new UglifyJsPlugin()	
		]
		,devtool: devtool ? 'source-map' : ''
	}
}

gulp.task('watch:components', function(){
	gulp.watch('./src/components/*')
		.on('change', function(changedFile) {
			let srcfile = changedFile.path
			if (argv.f) {
				srcfile = './src/components/'+ argv.f
			}
			gulp.src(srcfile)
				.pipe(webpackStream(webpackconfig(srcfile.replace(/^.*[\\\/]/, ''),true,true),webpack))
				.on('error', gutil.log)
				.pipe(gulp.dest('./dist/components'))
				.on('end',function(){
					if (argv.k) {
						const p = changedFile.path.match(/(.*)(?:\.([^.]+$))/)
						if (p&&p[2]!=='map') {
							const filename = 'dist/components/'+srcfile.replace(/^.*[\\\/]/, '').match(/(.*)(?:\.([^.]+$))/)[1]+'.js'
							sendcontent(filename)
						}        
					}
				})
		})
})

gulp.task('watch:sass', function(){
	gulp.watch(['./src/styles/**/*.sass','./src/styles/*.css'])
		.on('change', function(changedFile) {
			let srcfile = changedFile.path
			if (argv.f) {
				srcfile = './src/components/'+ argv.f
				gulp.src(srcfile)
					.pipe(webpackStream(webpackconfig(srcfile.replace(/^.*[\\\/]/, ''),true,true),webpack))
					.on('error', gutil.log)
					.pipe(gulp.dest('./dist/components'))
					.on('end',function(){
						if (argv.k) {
							const p = changedFile.path.match(/(.*)(?:\.([^.]+$))/)
							if (p&&p[2]!=='map') {
								const filename = 'dist/components/'+srcfile.replace(/^.*[\\\/]/, '').match(/(.*)(?:\.([^.]+$))/)[1]+'.js'
								sendcontent(filename)
							}        
						}
					})
			}    
		})
})


gulp.task('watch:html', function(){
	gulp.watch('./src/*.html')
		.on('change', function(changedFile) {
			gutil.log('copied:'+changedFile.path.replace(/^.*[\\\/]/, ''))
			gulp.src(changedFile.path)
				.pipe(minifyHtml({ empty: true }))
				.pipe(gulp.dest('./dist'))
				.on('end',function(){
					if (argv.k) {
						const filename = 'dist/'+changedFile.path.replace(/^.*[\\\/]/, '').match(/(.*)(?:\.([^.]+$))/)[1]+'.html'
						sendcontent(filename)
					}
				})
		})
})

gulp.task('watch:settings', function(){
	gulp.watch('./setup/_settings/*')
		.on('change', function(changedFile) {
			const file = './setup/_settings/'+changedFile.path.replace(/^.*[\\\/]/, '')
			sendfile(file, '',false,false)
		})
})

function webpack_files(src,dest,externals,done) {
	let filenames = []
	let streams = tap(function (file) {
		const filename = file.path.replace(/^.*[\\\/]/, '').match(/(.*)(?:\.([^.]+$))/)[1]+'.tsx'
		if (fs.exists(src+'/'+filename)) {
			filenames.push(filename)
		}
	})

	eventStream.merge(streams).on('end', function() { 
		let tasks = filenames.map(function(filename) {
			return webpack_file(filename,src,dest,externals)   
		}
		)
		eventStream.merge(tasks).on('end', done) 
	})

	return streams
}

function webpack_file(filename,src,dest,externals) {
	      return gulp.src(src+'/'+filename)
	      .pipe(webpackStream(webpackconfig(filename,externals,false),webpack))
	      .pipe(gulp.dest(dest))
}

gulp.task('build:html_components',['copy:images','copy:pdf','copy:xls'], function(done){
	gulp.src('./src/*.html')
		.pipe(minifyHtml({ empty: true }))
		.pipe(gulp.dest('./dist'))
		.pipe(webpack_files('./src/components','./dist/components',true,done))
})

gulp.task('upload:content', function(done){
	if (argv.f) {
		const file = 'dist/' + argv.f
		sendcontent(file)
		done()
	} else {
		recursive('dist', [createfolder], function (err, files) {
			files.map((file) => sendcontent(file))
			done()
		})
	}	
})

gulp.task('upload:directory', function (done) {
	if (argv.f) {
		const file = 'dist/' + argv.f
		senddirectory(file)
		done()
	} else {
		recursive('dist', [createfolder], function (err, files) {
			files.map((file) => sendcontent(file))
			done()
		})
	}	
})

gulp.task('upload:images', function(done){
	recursive('dist/img', [createfolder], function (err, files) {
		files.map( (file) => sendcontent(file) )		
		done()
	})
})

gulp.task('upload:server', function(done){
	recursive('dist/server', [createfolder], function (err, files) {
		files.map( (file) => sendcontent(file) )		
		done()
	})
})

gulp.task('upload:components', function(done){
	recursive('dist/components', [createfolder], function (err, files) {
		files.map( (file) => sendcontent(file) )		
		done()
	})
})

gulp.task('upload:entry', function (done) {
	recursive('setup', [], function (err, files) {
		files.map((file) => {
			if ((file.indexOf('template.xml')< 0) &&
				(file.indexOf('folderacls.xml') < 0)) {
				sendfile(file, '')	
			}
		})		
		done()
	})
})

gulp.task('upload:data', function (done) {
	if (argv.f) {
		const file = 'data/' + argv.f
		sendfile(file, '?_bulkserial')		
	} else {
		recursive('data', [], function (err, files) {
			files.map((file) => sendfile(file, '?_bulkserial'))				
			done()
		})		
	}
})

gulp.task('upload:htmlfolders', function (done) {
	sendfile('setup/_settings/htmlfolders.xml', '?_bulk',done)
})

gulp.task('upload:template', function (done) {
	sendfile('setup/_settings/template.xml','',done)
})

gulp.task('upload:folderacls', function (done) {
	sendfile('setup/_settings/folderacls.xml', '?_bulk',done)
})

gulp.task('upload:counts', function (done) {
	const path = argv.h.substr(argv.h.length - 1) === '/' ? argv.h.substr(0, argv.h.length - 1) : argv.h
	var options = {
		method: 'GET',
		url: path+'/s/adjustallocids',
		headers: {
			'Content-Type': 'text/html',
			'X-Requested-With': 'XMLHttpRequest',
			'Authorization': 'Token ' + argv.k,
		}
	}
	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body)
		} 
	})
})

gulp.task('test', function () {
	let target = 'test/*.test.js'
	if (argv.f) {
		target = 'test/'+argv.f+'.test.js'
	}
	return gulp.src([target], { read: false })
		.pipe(mocha({ reporter: 'list',require: 'babel-register',timeout:'120000'}))
		.on('error', gutil.log)
})

function sendcontent(file) {
	sendfile(file,'?_content',false,false)
}

function senddirectory(file) {
	sendfile(file,'?_content',false,true)
}

function sendfile(file,iscontent,done,isdirectory) {
	const path = argv.h.substr(argv.h.length - 1) === '/' ? argv.h.substr(0, argv.h.length - 1) : argv.h
	let url = path + file.substring(file.indexOf('/'))
	
	var options = {
		url: url+iscontent,
		headers: {
			'Content-Type': gettype(file),
			'X-Requested-With': 'XMLHttpRequest',
			'Authorization': 'Token ' + argv.k,
		}
	}
	if (isdirectory) {
		options.headers['Content-Length'] = '0'
	}
	let retrycount = 5

	function callback(error, response, body) {
		var dir =''
		if (isdirectory) {
			dir = ' (folder)'
		}
		console.log(file+dir+' --> '+url)
		if (!error && (response.statusCode == 200||response.statusCode == 202)) {
			console.log(body)
		} else {
			if (response) {
				if (response.statusCode) {
					if (response.statusCode == 302) {
						let status
						let errmsg
						response.headers['set-cookie'].map((msg) => {
							if (msg.indexOf('ERROR_STATUS') >= 0) {
								status = msg.split(';')[0]
							}else
							if (msg.indexOf('ERROR_MESSAGE') >= 0) {
								errmsg = msg.split(';')[0]
							}
						})
						if (errmsg.indexOf('ERROR_MESSAGE=Entry+is+required.') >= 0) {
							console.log('No updates.')
							retrycount=0
						} else {
							console.log(response.body)
							console.log(status)
							console.log(errmsg)							
						}
					}
				} else {
					console.log('can\'t PUT content. ')
				}
			} else {
				console.log('can\'t PUT content.')
			}	
			retrycount--
			if (retrycount > 0) {
				console.log('then retry :'+retrycount)
				fsasync.createReadStream(file).pipe(request.put(options,callback))				
			}
		}
		if (done) {
			done()		
		}
	}
	if (isdirectory) {
		request.put(options,callback)
	} else {
		fsasync.createReadStream(file).pipe(request.put(options,callback))	
	}

}

function createfolder(file, stats) { 

	if (stats && stats.isDirectory()) {
		sendfile(file, '?_content', false, true)
		return true
	}
	return false
}


function gettype(file) {
	const ext = file.match(/(.*)(?:\.([^.]+$))/)
	if (ext&&ext[2]) {
		switch (ext[2]){
		case 'json':
			return 'application/json'
		case 'xml':
			return 'text/xml'
		case 'html':
			return 'text/html;charset=UTF-8'
		case 'js':
			return 'text/javascript;charset=UTF-8'
		case 'css':
			return 'text/css;charset=UTF-8'
		case 'png':
			return 'image/png'
		case 'gif':
			return 'image/gif'
		case 'jpeg':
			return 'image/jpeg'
		case 'jpg':
			return 'image/jpeg'
		case 'svg':
			return 'image/svg+xml'
		case 'svgz':
			return 'image/svg+xml'
		default:
			return 'application/octet-stream'
		}
	}
	return 'application/octet-stream'
}

gulp.task('watch:server',['watch:settings'], function(){
	gulp.watch('./src/server/*')
		.on('change', function(changedFile) {
			let srcfile = changedFile.path
			if (argv.f) {
				srcfile = './src/server/'+ argv.f
			}
			gulp.src(srcfile)
				.pipe(webpackStream(webpackconfig(srcfile.replace(/^.*[\\\/]/, ''),false,false)
					,webpack))
				.on('error', gutil.log)      
				.pipe(gulp.dest('./test/server'))
				.on('end',function(){
					if (argv.k) {
						const p = changedFile.path.match(/(.*)(?:\.([^.]+$))/)
						if (p&&p[2]!=='map') {
							const filename = 'test/server/'+srcfile.replace(/^.*[\\\/]/, '').match(/(.*)(?:\.([^.]+$))/)[1]+'.js'
							sendcontent(filename)
						}        
					}
				})
		})
})

gulp.task('build:server_dist', function(done){
	gulp.src('./src/server/*')
		.pipe(webpack_files('./src/server','./dist/server',false,done))      
})

gulp.task('build:server_test', function(done){
	gulp.src('./test/*.html')
		.pipe(webpack_files('./src/server','./test/server',false,done))      
})

gulp.task('build:server', function ( callback ) {
	runSequence('clean-dist',['build:server_dist','build:server_test'],callback)
}) 

gulp.task( 'copy:images', function() {
	return gulp.src(
		[ 'src/img/**' ],
		{ base: 'src' }
	).pipe( imagemin() ) 
		.pipe( gulp.dest( 'dist' ) )
} )

gulp.task( 'copy:pdf', function() {
	return gulp.src(
		[ 'src/pdf/**' ],
		{ base: 'src' }
	).pipe( gulp.dest( 'dist' ) )
} )

gulp.task( 'copy:xls', function() {
	return gulp.src(
		[ 'src/xls/**' ],
		{ base: 'src' }
	).pipe( gulp.dest( 'dist' ) )
} )

gulp.task('symlink', function () {
	vfs.src('dist/components',{followSymlinks: false})
		.pipe(vfs.symlink('test'))
	vfs.src('dist/server',{followSymlinks: false})
		.pipe(vfs.symlink('test'))
})

gulp.task('serve', ['watch','watch:server'],function() {
	return serve('dist')
})

gulp.task('serve:test', ['symlink','watch:server'],function() {
	return serve('test')
})

function serve(tgt) {
	let target = argv.h 
	if (target) {
		if (target.match(/https/)) {
			target = target.replace(/https/,'http')
			gutil.log('using HTTP instead of HTTPS.:'+target)
		}
		target = target.substr( target.length-1 ) === '/' ? target.substr(0,target.length-1) : target
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
		}))
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
		.pipe(clean())
})

gulp.task('build:client', function ( callback ) {
	runSequence('clean-dist',['build:html_components'],callback)
}) 
gulp.task('build', function ( callback ) {
	runSequence('clean-dist',['build:html_components'],['build:server_dist','build:server_test'],callback)
}) 
gulp.task('deploy', function ( callback ) {
	runSequence('clean-dist',['build:html_components'],'build:server_dist','upload',callback)
}) 

gulp.task('deploy:server', function ( callback ) {
	runSequence('clean-dist','build:server_dist','upload:server',callback)
}) 

gulp.task('upload', function ( callback ) {
	runSequence('upload:htmlfolders','upload:template','upload:folderacls','copy:images',['upload:images','upload:content','upload:components','upload:entry','upload:server'],callback)
}) 

gulp.task('watch', ['watch:components','watch:html','watch:settings','watch:sass'])

gulp.task('default', function ( callback ) {
	runSequence('build',callback)
}) 
