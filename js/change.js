
//获取确定样式
function getStyle(obj,attr){
		 	return getComputedStyle(obj,false)[attr];	
}
function getByClass(clsName,parent){
	var oParent=parent?parent:document;
	var	eles=[],
		elements=oParent.getElementsByTagName('*');
	for(var i=0;i<elements.length;i++){
		if(elements[i].className==clsName){
			eles.push(elements[i])	;
		}
	}
	return eles;
}
//运动函数
function startMove(obj,json,fn){
	clearInterval(obj.timer);
	obj.timer=setInterval(function(){
		var flag=true;	//用来判断是否所有attr都到达目标值
		for(var attr in json){
			var icur=0;
			
			//求当前样式,透明要区分开来
			if(attr=='opacity'){
				icur=Math.round(parseFloat(getStyle(obj,attr)));
				
			}else{
				icur=parseInt(getStyle(obj,attr));
			}
			
			//算速度
			var speed=(json[attr]-icur)/5;
			speed=speed>0?Math.ceil(speed):Math.floor(speed);
			
			//判断是否达目标
			if(icur!=json[attr]){
				flag=false;	
			}
			//开始改变
			if(attr=='opacity'){
				obj.style.filter='alpha(opacity'+(icur+speed)+')';
				obj.style.opacity=(icur+speed)/100;
			}else{
				obj.style[attr]=icur+speed+'px'
			}
			
		}
		//所有属性循环，看是否都完成目标，再清除定时器
		if(flag){
			clearInterval(obj.timer);
			if(fn){
				fn();	
			}
		}
	},15);
}
//判断滚动函数

function checkScrollSlide(){
	var scrollTop=document.body.scrollTop ||document.documentElement.scrollTop;
	return scrollTop>50?true:false;
}