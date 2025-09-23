const path = require('path')
const vtecxutil = require('@vtecx/vtecxutil')
const confy = require('confy')

module.exports = (env, argv) => {
  let target
  confy.get('$default', function (err, result) {
    if (result) {
      confy.get(result.service, function (err, result2) {
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
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: 'rspack.tsconfig.json'
            }
          }
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    resolve: {
      alias: {
        react: path.resolve(__dirname, 'node_modules/react'),
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom')
      },
      mainFields: ['module', 'browser', 'main'],
      extensions: ['.ts', '.tsx', '.js']
    },
    target:
      env.entry.indexOf('/server') >= 0 || argv.mode === 'production' ? ['web', 'es5'] : 'web',
    devServer: {
      host: 'localhost',
      port: 8000,
      proxy: [{ context: ['/d', '/s', '/xls'], target: target, changeOrigin: true }],
      static: {
        directory: path.join(__dirname, 'src/')
      },
      open: true,
      hot: true
    },
    plugins: [new vtecxutil.uploaderPlugin(env.entry)],
    devtool: argv.mode === 'production' ? undefined : 'source-map'
  }
}
