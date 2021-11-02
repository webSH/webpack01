import '../assets/style/index.css'
import '../assets/style/index.less'
//js 代码，向 html 中插入图片
import img01 from "../assets/images/inFromTheStorm.jpg";
let Img01 = new Image();
Img01.src = img01;
document.getElementById("img01").appendChild(Img01);
console.log('20211102  console')

//一个 es6 语法
/* webpack的打包是基于模块来打包的，也就是说经过打包的文件代码是被打包到一个函数里，此时所有定义的变量或者方法已变成局部的。有了独立的作用域，定义变量，声明函数都不会污染全局作用域
方法：提升作用域： */
window.aF = function (){
	console.log('aF')
	let str = document.getElementsByName("str")[0].value,
		prefix = document.getElementsByName("prefix")[0].value;
	let addPrefix = (s,f) => (f||'默认前缀') + '_' + s;
	console.log(addPrefix(str, prefix))
	document.getElementById("aFResult").innerHTML = addPrefix(str, prefix);
}

// aF()