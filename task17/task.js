window.onload=function(){
	/* 数据格式演示
	var aqiSourceData = {
	  "北京": {
		"2016-01-01": 10,
		"2016-01-02": 10,
		"2016-01-03": 10,
		"2016-01-04": 10
	  }
	};
	*/
	
	// 以下两个函数用于随机模拟生成测试数据
	function getDateStr(dat) {
	  var y = dat.getFullYear();
	  var m = dat.getMonth() + 1;
	  m = m < 10 ? '0' + m : m;
	  var d = dat.getDate();
	  d = d < 10 ? '0' + d : d;
	  return y + '-' + m + '-' + d;
	}
	
	function randomBuildData(seed) {
	  var returnData = {};
	  var dat = new Date("2016-11-01");
	  var datStr = '';
	  for (var i = 1; i < 92; i++) {
		datStr = getDateStr(dat);
		returnData[datStr] = Math.ceil(Math.random() * seed);
		dat.setDate(dat.getDate() + 1);
	  }
	  return returnData;
	}
	
	var aqiSourceData = {
	  "北京": randomBuildData(510),
	  "上海": randomBuildData(300),
	  "广州": randomBuildData(280),
	  "深圳": randomBuildData(180),
	  "成都": randomBuildData(300),
	  "西安": randomBuildData(500),
	  "福州": randomBuildData(190),
	  "厦门": randomBuildData(120),
	  "沈阳": randomBuildData(480)
	};
	
	// 用于渲染图表的数据
	var chartData = {};
	//渲染图标数据格式例子
	/*
		cahrtData={
			"2016年第1周":353,
			"2016年第1月":342,
			"2016-03-22":234
		}
		
	*/
	
	// 记录当前页面的表单选项
	var pageState = {
	  nowSelectCity: -1,
	  nowGraTime: "day"
	}
	
	/**
	 * 渲染图表
	 */
	function renderChart() {
		var chartBox=document.getElementById('aqi-chart-wrap');
		var chart='';
		var width='';
		for(var chartDate in chartData){
			var color="";
			if(chartData[chartDate]<150){
				color="#009966";	
			}else if(chartData[chartDate]<250){
				color="#ff8844";
			}else{
				color="#dd1100";
			}
			if(pageState.nowGraTime=="day"){
				width="10px";
			}else if(pageState.nowGraTime=="week"){
				width="50px";
			}else{
				width="150px";	
			}
			chart+='<div style="Height:'+chartData[chartDate]+'px;width:'+width+';background-color:'+color+';"title="'+pageState.nowSelectCity+'    '+chartDate+'  污染指数'+chartData[chartDate]+'"></div>';
		}
		chartBox.innerHTML=chart;
	}
	
	/**
	 * 日、周、月的radio事件点击时的处理函数
	 */
	function graTimeChange(radio) {
	  // 确定是否选项发生了变化 
		if(radio.value==pageState.nowGraTime){
			return;
		}else{
			pageState.nowGraTime=radio.value;
		}
		console.log(pageState.nowGraTime);
	  // 设置对应数据
		initAqiChartData();
	  // 调用图表渲染函数
		renderChart();
	}
	
	/**
	 * select发生变化时的处理函数
	 */
	function citySelectChange(select) {
	  // 确定是否选项发生了变化 
		if(select.value==pageState.nowSelectCity){
			return
		}else{
			pageState.nowSelectCity=select.value;
		}
	  // 设置对应数据
		initAqiChartData();
	  // 调用图表渲染函数
	  renderChart();
	}
	
	/**
	 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
	 */
	function initGraTimeForm() {
		var graTime=document.getElementsByTagName("input");
		var gralength=graTime.length;
		for(var i=0;i<graTime.length;i++){
			graTime[i].addEventListener('change',function(){
				graTimeChange(this);
			});
		}
	}
	
	/**
	 * 初始化城市Select下拉选择框中的选项
	 */
	function initCitySelector() {
	  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
		var selectItems=document.getElementById("city-select");
		var cityOptions='';
		for(var city in aqiSourceData){
			cityOptions+='<option value="'+city+'">'+city+'</option>';
		}
		selectItems.innerHTML=cityOptions;
	  // 给select设置事件，当选项发生变化时调用函数citySelectChange
		pageState.nowSelectCity = selectItems.value;
		selectItems.addEventListener('change', function () {
			citySelectChange(this);
		});
	}
	
	/**
	 * 初始化图表需要的数据格式
	 */
	function initAqiChartData() {
	  // 将原始的源数据处理成图表需要的数据格式
	  var dataSource = aqiSourceData[pageState.nowSelectCity];
	  function getWeekData() {
			var weekData = {};
			var sum = 0,
				i = 0,
				week = 0;
			for (var day in dataSource) {
				sum += dataSource[day];
				i++;
				if (new Date(day).getDay() == 0) {
					week++;
					weekData['2016年第' + week + '周'] = parseInt(sum / i);
					i = 0;
					sum = 0;
				}
			}
			return weekData;
		}
	
		function getMonthData() {
			var monthData = {},
				sum = 0,
				i = 0,
				month = 1;
			for (var day in dataSource) {
				var date = new Date(day); //获取当前日期
				var newYear = date.getFullYear(); //获取当前年份
				var newMonth = date.getMonth() + 1; //获取下一月份
				if (newMonth > 11) { //如果下一月份超过今年
					newMonth = 0; //月份设置为1月
					newYear++; //年份加到下一年
				}
				var nextMonth = new Date(newYear, newMonth, 1); //新建下月的第一天
				var lastDay = new Date(nextMonth.getTime() - 1000 * 60 * 60 * 24).getDate(); //下月第一天减掉一天获取到当月最后一天
				sum += dataSource[day]; //累加污染指数
				i++; //累加当月天数
				if (date.getDate() == lastDay) { //当月天数等于当月最后一天时
					monthData[date.getFullYear() + '第' + month + '月'] = parseInt(sum / i); //给monthData对象添加当月的平均值
					sum = 0; //清空污染指数
					i = 0; //清空当月天数
					month++; //月份记录值加1
				}
			}
			return monthData;
		}
	
		switch (pageState.nowGraTime) {
		case 'day':
			chartData = dataSource;
			break;
		case 'week':
			chartData = getWeekData();
			break;
		case 'month':
			chartData = getMonthData();
		} 
	  // 处理好的数据存到 chartData 中
	  
	}
	
	/**
	 * 初始化函数
	 */
	function init() {
	  initGraTimeForm()
	  initCitySelector();
	  initAqiChartData();
	  renderChart();
	}
	
	init();
}