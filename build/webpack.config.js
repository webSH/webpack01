const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //将打包后的 js 文件使用 script 标签引入 html
const {CleanWebpackPlugin} = require('clean-webpack-plugin'); //清除打包存储目录 \dist 旧文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //合并为一个 css
module.exports = {
	mode:'development', // 开发模式
	entry: {
		main:path.resolve(__dirname,'../src/main.js'), // 入口文件
		header:path.resolve(__dirname,'../src/header.js'), // 入口文件2
	},
	output: {
		filename: '[name].[hash:8].js', // 打包后的文件名称
		path: path.resolve(__dirname,'../dist') // 打包后的目录
	},
	module:{
		rules:[
			// {
			// 	test:/\.css$/,
			// 	use:['style-loader','css-loader'] // 从右向左解析原则
			// },
			{ //使用  MiniCssExtractPlugin 合并为一个 css
				test:/\.css$|.less$/,
				use:[MiniCssExtractPlugin.loader,'css-loader','less-loader'] // 从右向左解析原则
			}
		]
	},
	plugins:[
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname,'../public/index.html'),
			filename: 'index.html', //必须写，不写会出现文档链接错误（index.html 链接了 header.a0f.js）
			chunks:['main'] //与入口文件对应的模块名
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname,'../public/header.html'),
			filename: 'header.html', //必须写，不写会出现文档链接错误（index.html 链接了 header.a0f.js）
			chunks:['header'] //与入口文件对应的模块名
		}),
		new MiniCssExtractPlugin({
			filename: "[name].[hash].css",
			chunkFilename: "[id].css"
		})
	]
}