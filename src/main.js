import '../assets/style/index.css'
import '../assets/style/index.less'
//js中引入图片
import img01 from "../assets/images/inFromTheStorm.jpg";
let Img01 = new Image();
Img01.src = img01;
document.getElementById("img01").appendChild(Img01);
console.log('20211012 console')