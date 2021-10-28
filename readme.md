# webpack 从零
>node: v14.16.0  
webpack: 5.55.1  
webpack-cli: 4.8.0

## 一、初步
node 环境下
### 1.新建一个目录，初始化 npm
`npm init` //会生成 package.json文件
### 2.安装两个 webpack 开发的相关 npm 包（webpack 和 webpack-cli）
```
npm i -D webpack webpack-cli
```
### 3.新建一个文件夹 src，src/main.js
> main.js：
```js
console.log('输出点文字')
```
### 4.配置 package.json 命令：
```js
"scripts": {
	"build": "webpack src/main.js" //我用了 ./src/main.js 才成功，前面那样 url，报错
}
```
### 5.执行一下
```
npm run build
```
此时如果生成了一个 dist 文件夹，并且内部含有 main.js 说明打包成功！
- dist
   - main.js (webpack 打包生成)
- src
   - main.js
- package.json
## 二、实现更加丰富的自定义配置：
### 1.新建一个 build 文件夹，里面新建一个 webpack.config.js
> webpack.config.js
```js
const path = require('path');
module.exports = {
	mode:'development', // 开发模式
	entry: path.resolve(__dirname,'../src/main.js'), // 入口文件
	output: {
		filename: 'output.js', // 打包后的文件名称
		path: path.resolve(__dirname,'../dist') // 打包后的目录
	}
}
```
### 2.更改我们的打包命令
```js
"scripts": {
	"build": "webpack --config build/webpack.config.js"
}
```
### 3. 执行 `npm run build` 会在 dist 目录生成一个 output.js 文件。这就是我们需要再浏览器中实际运行的文件。
- dist
   - output.js
## 三、接下来，配置 html 模板：
js 文件打包好了，但是我们不可能每次在 html 文件中手动引入打包好的 js，为了清除 js 缓存，我们一般做如下配置：
### 1.打包动态文件名的配置
> webpack.config.js 片段
```js
module.exports = {
	// 省略其他配置
	output: {
		filename: '[name].[hash:8].js', // 打包后的文件名
		path: path.resolve(__dirname,'../dist') // 打包后文件保存的目录
	}
}
```
这时候生成的 dist 目录文件如下：
- dist
   - main.cac25ec2.js
如何引入每次打包文件名都不同的 js 文件？我们需要一个插件：
```
npm i -D html-webpack-plugin
```
### 2.新建一个 build 同级的文件夹 public，里面新建一个 index.html
- build
- public
   - index.html

### 3.让 index.html 待一会，我们先去配置一下刚刚装完的插件 html-webpack-plugin
> webpack.config.js
```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
	mode: 'development', // 开发模式
	entry: path.resolve(__dirname,'../src/main.js'), // 入口文件
	output: {
		filename: '[name].[hash:8].js', // 打包后的文件名称
		path: path.resolve(__dirname,'../dist') // 打包后的文件存储目录
	},
	plugins:[
		new HtmlWebpackPlugin({
			template:path.resolve(__dirname,'../public/index.html')
		})
	]
}
```
>index.html 初始文档 ↓
```html
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>
<body>
	<p>使用 html-webpack-plugin 自动引入 js 文件（随机js文件名）</p>
</body>
</html>
```
ok，执行以下：
```
npm run build
```
dist 目录下生成了新的 main.随即符.js 和 index.html
- dist
   - index.html
   - main.819ddf57.js
>index.html 自动插入了打包的 js 文件 `<script defer src="main.819ddf57.js"></script>`
```html
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
<script defer src="main.819ddf57.js"></script></head>
<body>
	<p>使用 html-webpack-plugin 自动引入 js 文件（随机js文件名）</p>
</body>
</html>
```
## 四、多入口文件的配置
### 生成多个 html-webpack-plugin 实例来解决这个问题
```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
	mode:'development',
	//单入口写法 entry: path.resolve(__dirname,'../src/main.js'),
	entry: {
		main: path.resolve(__dirname,'../src/main.js'), //入口文件 1 模块
		header:path.resolve(__dirname,'../src/header.js') //入口文件 2 模块
	},
	output:{
		filename: '[name].[hash:3].js', //打包后的文件名称
		path: path.resolve(__dirname,'../dist') //打包后的存储目录
	},
	plugins:[
		new HtmlWebpackPlugin({
			template:path.resolve(__dirname,'../public/index.html'),
			filename:'index.html', //必须写，不写会出现文档链接错误（index.html 链接了 header.a0f.js）
			chunks:['main'] //与入口文件对应的模块名
		}),
		new HtmlWebpackPlugin({
			template:path.resolve(__dirname,'../public/header.html'),
			filename:'header.html', //必须写，不写会出现文档链接错误（index.html 链接了 header.a0f.js）
			chunks:['header'] //与入口文件对应的模块名
		})
	]
}
```
### 使用 clean-webpack-plugin 清理打包存储目录中的残留上次打包文件
```js
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
module.exports = {
	// ...省略其他配置
	plugins:[new CleanWebpackPlugin()]
}
```
> 要安装一下啊 `npm i -D clean-webpack-plugin` (教程未提示安装，当然，我是新手)
## 五、引用CSS
### 一般引入
我们的入口文件是 main.js，所以我们在入口 js 中引入我们的 css 文件
> main.js 片段
```js
import './assets/index.css' // hN 正确路径：'../assets/index.css'
import './assets/index.less'
//。。。
```
同时，我们也需要使用一些 loader 来解析我们的 css 文件
`npm i -D style-loader css-loader`
如果我们使用 less 来构建样式，则需要多安装两个
`npm i -D less less-loader`
配置文件如下：
>webpack.config.js
```js
 module.exports = {
	 //。。。省略其他配置
	 module:{
		 rules:[
			 {
				 test:/\.css$/,
				 use:['style-loader','css-loader'] // 从右向左 ← 解析原则
			 },
			 {
				 test:/\.less$/,
				 use:['style-loader','css-loader','less-loader'] // 从右向左 ← 解析原则
			 }
		 ]
	 }
 }
```
>***说明：此处的 css 代码并不直接生成在 dist/index.html 中，仍是通过打包的 main.[hash].js 动态插入到 index.html 中<head><style>/*插入的css*/</style></head> 标签的***
### 为 css 添加浏览器前缀
#### 安装 postcss-loader 和 autoprefixer： `npm i -D postcss-loader autoprefixer`
#### 配置：
> webpack.config.js 片段
```js
 module.exports = {
 	module:{
 		rules:[
 			{
 				test: /\.less$/,
 				use:['style-loader','css-loader','postcss-loader','less-loader']
 			}
 		]
 	}
 }
```
#### 接下来，我们还需要引入 **autoprefixer** 使其生效：
##### 1.在项目根目录下创建一个 **postcss.config.js** 文件，配置如下：
>postcss.config.js
```js
module.exports = {
	plugins: [require('autoprefixer')] // 引用该插件即可了
}
```
##### 2.直接在 webpack.config.js 里配置
>webpack.config.js 片段
```js
//...省略其他配置
module:[
	rules:[
		{
			test:/\.less$/,
			use:['style-loader',
			'css-loader',
			{
				loader:'postcss-loader',
				options:{ // hN 经测试，添加此属性会报错，去掉 options 属性，直接调用 postcss-loader 即可
					plugins:[require('autoprefixer')]
				}
			},
			'less-loader'] //从右向左解析原则
		}
	]
]
```
这时候我们发现css通过style标签的方式添加到了html文件中，但是如果样式文件很多，全部添加到html 中，难免显得混乱。这时候我们想要把 css 拆分出来用外链的形式引入 css 文件。现在需要一个插件 mini-css-extract-plugin
### 拆分css `npm i -D mini-css-extract-plugin`
>webpack 4.0以前，我们通过 **extract-text-webpack-plugin** 插件，把css 样式从js文件中提取到单独的css文件中。webpack 4.0 以后，官方推荐使用 **mini-css-extract-plugin** 插件来打包 css 文件。

>配置文件 webpack.config.js 如下
```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
	//...省略其他配置
	module: {
		rules: [
			{
				test: /\.less$|.css$/,
				user: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'less-loader'
				]
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "[name].[hash].css",
			chunkFilename: "[id].css"
		})
	]
}
```
`npm run build` 之前引入到 main.js 中的css文件会合并+抽出（多个css会依次合并）为 /dist/main.[hash].css，并使用 **\<style\>** 标签插入到 index.html 中
### 拆分多个css <span style="color:red">(貌似 webpack5 不支持此插件)</span>
>上面我们用到的 **mini-css-extract-plugin** 会将所有的css样式合并为一个css文件，如果想拆分为一一对应的多个css文件，我们需要使用到 **extract-text-webpack-plugin**，我们需要安装 @next 版本的  **extract-text-webpack-plugin**。（ mini-css-extract-plugin 还不支持此功能）
```js
npm i -D extract-text-webpack-plugin@next
```
> webpack.config.js 片段
```js
 const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
 let indexLess = new ExtractTextWebpackPlugin('index.less');
 let indexCss = new ExtractTextWebpackPlugin('index.css');
 module.exports = {
	 module:{
		 rules:[
			 {
				 test:/\.css$/,
				 use: indexCss.extract({
					 use: ['css-loader']
				 })
			 },
			 {
				 test:/\.css$/,
				 use: ['css-loader','less-loader']
			 }
		 ]
	 },
	 plugins:[
		 indexLess,
		 indexCssS
	 ]
 }
```