'use strict'

let path = require('path'),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	webpack = require('webpack')

module.exports = {
	entry: {
		app: './src/index.js',
		vendor: ['jquery']
	},
	output: {
		filename: '[name].bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					'file-loader'
				]
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: [
					'file-loader'
				]
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Phylogician'
		}),
		new webpack.ProvidePlugin({ // inject ES5 modules as global vars
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery',
			Tether: 'tether'
		}),
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: 'jquery',
			Popper: 'popper.js'
		})
	],
	devtool: 'inline-source-map'
}
