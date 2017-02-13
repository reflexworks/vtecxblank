var path = require('path');
var webpack = require('webpack');

module.exports = {
	context: path.resolve(__dirname, '.'),
  	entry: {
    		common: './common.import.js',
    		index: './index.import.js',
    		login: './login.import.js',
    		demo: './demo.import.js',
    		demo_input: './demo_input.import.js',
    		demo_list: './demo_list.import.js',
    		forgot_password: './forgot_password.import.js',
    		password_change: './password_change.import.js',
    		registration: './registration.import.js'
  	},
  	output: {
    		path: path.resolve(__dirname, '../dist/js'),
    		filename: '[name].bundle.js'
  	},
	module: {
	    rules: [
	          {
		          test: /\.css$/,
		          use: [ 'style-loader', 'css-loader' ]
	          },
	     	  {
	                  test: /\.(png|gif|svg|ttf|woff|woff2|eot)$/,
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
	    new webpack.ProvidePlugin({
	               $: "jquery",
	          jQuery: "jquery"
            })
        ]
}
