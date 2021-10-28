const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //将打包后的 js 文件使用 script 标签引入 html
const {CleanWebpackPlugin} = require('clean-webpack-plugin'); //清除打包存储目录 \dist 旧文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //合并为一个 css
// const { loader } = require('mini-css-extract-plugin');
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
			},
			{
				test:/\.(jpg?g|png|gif)$/i,
				use:[
					{
						loader: 'url-loader',
						options: {
							limit:217521, //图片大小 217522 字节，<=此值，转为 base64（main.js 288k）；图片不转（main.js 8k）。不转 base64 总空间更小
							fallback:{
								loader: 'file-loader',
								options: {
									name: 'imgs/[name].[hash:3].[ext]'
								}
							}
						}
					}
				]
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