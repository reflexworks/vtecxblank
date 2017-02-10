var path = require('path');
var webpack = require('webpack');

module.exports = {
	context: path.resolve(__dirname, './app'),
  	entry: {
    		index: './scripts/index.js'
  	},
  	output: {
    		path: path.resolve(__dirname, './dist'),
    		filename: '[name].bundle.js'
  	},
	module: {
	    rules: [
	          {
		          test: /\.css$/,
		          use: [ 'style-loader', 'css-loader' ]
	          },
	     	  {
	                  test: /\.(png|svg|ttf|woff|woff2|eot)$/,
		          use: { loader: 'url-loader', options: { limit: 100000 } },
	          },
	          {
		          test: /\.(jpg)$/,
		          use: { loader: 'file-loader', options: { name : '[name].[ext]'}} 
	          }
	    ]
     	},
    	plugins: [
        //  new webpack.optimize.UglifyJsPlugin()  // minify
        ]
}
