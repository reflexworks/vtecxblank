const vtecxutil = require('@vtecx/vtecxutil')
const confy = require('confy')

module.exports = (env) => {
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
      console.log('target:' + target)
    }
    target = target.substr(target.length - 1) === '/' ? target.substr(0, target.length - 1) : target
  }
  return {
    mode: 'production',
    entry: './src' + env.entry,
    output: {
      filename: '.' + env.entry.replace(/(\.tsx)|(\.ts)/g, '.js')
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: 'builtin:swc-loader',
          options: {
            detectSyntax: 'auto'
          }
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    target: 'node',
    plugins: [new vtecxutil.uploaderPlugin(env.entry)]
  }
}