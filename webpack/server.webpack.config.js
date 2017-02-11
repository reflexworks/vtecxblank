var path = require('path');
var webpack = require('webpack');

module.exports = {
	context: path.resolve(__dirname, '../app'),
  	entry: {
    	app: './server/reflexcontexttest.js',
  	},
  	output: {
    	path: path.resolve(__dirname, '../test'),
    	filename: '[name].bundle.js',
  	},
    plugins: [
        new webpack.optimize.UglifyJsPlugin()  // minify
    ]
}
