const path = require('path')
const vtecxutil = require('vtecxutil')
const writeFilePlugin = require('write-file-webpack-plugin')
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
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|gif|svg|ttf|woff|woff2|eot)$/,
          use: { loader: 'url-loader', options: { limit: 100000 } }
        },
        {
          test: /\.(jpg)$/,
          use: { loader: 'file-loader', options: { name: '[name].[ext]' } }
        },
        {
          test: /\.tsx?$/,
          use: { loader: 'ts-loader' }
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
    devServer: {
      host: 'localhost',
      port: 8000,
      proxy: [{ context: ['/d', '/s', '/xls'], target: target, changeOrigin: true }]
    },
    externals:
      env.externals === 'true'
        ? {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react-bootstrap': 'ReactBootstrap',
            'react-router-dom': 'ReactRouterDOM',
            axios: 'axios'
          }
        : {},
    plugins:
      argv.mode === 'production'
        ? [new vtecxutil.uploaderPlugin(env.entry)]
        : [new writeFilePlugin(), new vtecxutil.uploaderPlugin(env.entry)],
    devtool: argv.mode === 'production' ? '' : 'source-map'
  }
}
