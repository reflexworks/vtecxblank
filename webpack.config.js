const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const vtecxutil = require('vtecxutil')
const writeFilePlugin = require('write-file-webpack-plugin')

class VtecxutilPlugin {
  constructor(entry) {
    this.entry = 'dist' + entry.replace(/(\.tsx)|(\.ts)/g, '.js')
  }
  apply(compiler) {
    compiler.hooks.afterEmit.tap({ name: 'vtecxutil' }, compilation => {
      vtecxutil.sendfile(this.entry, '?_content&_bulk&_async')
    })
  }
}

module.exports = env => {
  let target = env.target
  if (target) {
    if (target.match(/https/)) {
      target = target.replace(/https/, 'http')
      console.log('using HTTP instead of HTTPS.:' + target)
    }
    target = target.substr(target.length - 1) === '/' ? target.substr(0, target.length - 1) : target
  }
  return {
    mode: env.mode ? 'development' : 'production',
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
          test: /\.sass$/,
          use: ['style-loader', 'css-loader', 'sass-loader']
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
      env.mode === 'production'
        ? [new UglifyJsPlugin(), new VtecxutilPlugin(env.entry)]
        : [new writeFilePlugin(), new VtecxutilPlugin(env.entry)],
    devtool: env.mode === 'production' ? '' : 'source-map'
  }
}
