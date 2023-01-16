const path = require('path')
const vtecxutil = require('vtecxutil')
const confy = require('confy')

module.exports = (env, argv) => {
  let target
  confy.get('$default', function(err, result) {
    if (result) {
      confy.get(result.service, function(err, result2) {
        target = result2.path
      })
    } else {
      console.log('Please login.')
    }
  })

  if (target) {
    if (target.match(/https/)) {
      target = target.replace(/https/, 'http')
      console.log('using HTTP instead of HTTPS.:' + target)
    }
    target = target.substr(target.length - 1) === '/' ? target.substr(0, target.length - 1) : target
  }
  return {
    mode: argv.mode ? 'development' : 'production',
    entry: './src' + env.entry,
    output: {
      filename: '.' + env.entry.replace(/(\.tsx)|(\.ts)/g, '.js')
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                url: false
              }
            }
          ]
        },
        {
          test: /\.(gif|png|jpg|eot|wof|woff|ttf|svg)$/,
          // 画像をBase64として取り込む
          type: 'asset/inline'
        },
        {
          test: /\.tsx?$/,
          use: { loader: 'ts-loader' }
        },
        {
          test: /\.sass$/,
          use: ['style-loader', 'css-loader', 'sass-loader']
        },
        {
          enforce: 'pre',
          test: /\.js$/,
          use: { loader: 'source-map-loader' },
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    target:
      env.entry.indexOf('/server') >= 0 || argv.mode === 'production' ? ['web', 'es5'] : 'web',
    devServer: {
      host: 'localhost',
      port: 8000,
      proxy: [{ context: ['/d', '/s', '/xls'], target: target, changeOrigin: true }],
      static: {
        directory: path.join(__dirname, "src/"),
      },
      open: {
        app: {
          name: 'google-chrome',
        },
      },
      hot: true
    },
    externals:
      env.externals === 'true'
        ? {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react-bootstrap': 'ReactBootstrap',
            axios: 'axios'
          }
        : {},
    plugins: [new vtecxutil.uploaderPlugin(env.entry)],
    devtool: argv.mode === 'production' ? undefined : 'source-map'
  }
}
