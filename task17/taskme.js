window.onload=function(){
	initForm();
	initAqiChartData();
	renderChart();
}
//存储所有城市源数据
var aqiSourceData={
	"北京":randomBuildDate(220,160),
	"上海":randomBuildDate(210,145),
	"广州":randomBuildDate(170,130),
	"深圳":randomBuildDate(200,100)
}
//生存一个城市的随机数据
function randomBuildDate(seed,base){
	var alldate={};
	var dat=new Date("2016-06-01");
	var datStr="";
	for(var i=0;i<92;i++){
		datStr=getDateStr(dat);
		alldate[datStr]=Math.ceil(Math.random()*seed)+base; //减少差值
		dat.setDate(dat.getDate()+1);
	}
	return alldate;
}
//生成数据时使用的日期格式
function getDateStr(dat){
	var y=dat.getFullYear();
	var m=dat.getMonth()+1;
	m=m<10?'0'+m:m;
	var d=dat.getDate();
	d=d<10?'0'+d:d;
	return y+'-'+m+'-'+d;
}
var pageState={
		nowCity:"北京",
		nowTime:"day"
	}
//存储渲染图标需要的数据，具体城市，周期
var chartData={};
//生成需要的图标数据
function initAqiChartData(){
	var dataSource=aqiSourceData[pageState.nowCity];
	//计算周平均值
	function getWeekData(){
		var weekData={};
		var nowDay='';
		var i=0,
			sum=0,
			week=0;
		for(var day in dataSource){
			sum+=dataSource[day];
			i++;
			nowDay=new Date(day);
			if(nowDay.getDay()==0){
				week++;
				if(week>4){
					week=1;
				}
				console.log(week);
				weekData[(nowDay.getMonth()+1)+'第'+week+'周']=parseInt(sum/i);
				sum=0;
				i=0;
			}
		}
		return weekData;
	}
	//计算月平均值
	function getMonthData(){
		var monthData={};
		var sum=0,
			i=0;
		for(var day in dataSource){
			var date=new Date(day)
			var newYear=date.getFullYear();		//获取当前年份
			var nowMonth=date.getMonth();		//获取当前月份
			var newMonth=date.getMonth()+1;		//获取下一月份
			if(newMonth>11){
				newYear++;		//年份加一
				newMonth=0;
			}
			var nextMonthDay=new Date(newYear,newMonth,1);	//获取下个月的第一天
			var lastDay=new Date(nextMonthDay.getTime()-1000*60*60*24).getDate();	//获取当月的最后一天
			sum += dataSource[day]; //累加每天污染指数
			i++; //累加当月天数
			if(date.getDate()==lastDay){
				monthData[date.getFullYear()+'年第'+(nowMonth+1)+'月']=parseInt(sum/i);
				sum=0;
				i=0;
			}
		}
		return monthData;
	}
	switch (pageState.nowTime){
	case 'month':
		chartData=getMonthData();
		break;
	case 'week':
		chartData=getWeekData();
		break;
	case 'day':
		chartData=dataSource;
	}
}
//渲染图标函数
function renderChart(){
	var chartBox=document.getElementById('aqi-chart-wrap');
	var chart='';		//图表内容
	var width='';		//存不同周期的宽度
	if(pageState.nowTime=='day'){
		width='10px';
	}else if(pageState.nowTime=='week'){
		width='50px';
	}else{
		width='200px';
	}
	for(var day in chartData){
		var color='';
		var value=chartData[day];
		if(value<190){
			color='#75AAFB';
		}else if(value<300){
			color='#FB9B9B';
		}else{
			color='#F75C5C';
		}
		chart+='<div style="width:'+width+';height:'+value+'px;background-color:'+color+';"title="'+pageState.nowCity+'  '+day+'  污染指数'+value+'"></div>';
	}
	chartBox.innerHTML=chart;
}
//周期radio改变时调用函数
function nowTimeChange(radio){
	//判断是否改变了周期
	console.log(radio.value);
	if(radio.value==pageState.nowTime){
		return;
	}else{
		pageState.nowTime=radio.value;
	}
	//改变图标数据
	console.log(radio.value);
	initAqiChartData();
	//渲染图标
	renderChart();
}
function nowCityChange(select){
	//判断是否改变了城市
	if(select.value==pageState.nowCity){
		return;
	}else{
		pageState.nowCity=select.value;
	}
	initAqiChartData();
	renderChart();
}
//初始化表单，给控件加上事件
function initForm(){
	var timeItems=document.getElementsByTagName('input');
	var selectItems=document.getElementById('city-select');
	var cityOption='';
	for(var i=0;i<timeItems.length;i++){
		timeItems[i].addEventListener('change',function(){
			nowTimeChange(this);
		});
	}
	for(var city in aqiSourceData){
		cityOption+='<option value="'+city+'">'+city+'</option>';
	}
	selectItems.innerHTML=cityOption;
	pageState.nowCity=selectItems.value;
	selectItems.addEventListener('change',function(){
		nowCityChange(this);
	});
}

















