
window.onload = (function() {
	var snetFile = document.getElementById('snetFile') // 傳送檔案按鈕
	var sentAPI = document.getElementById('sentAPI') // 傳送API按鈕

    snetFile.addEventListener('click',File_Appear); // 選擇檔案上傳
	sentAPI.addEventListener('click',API_Appear); // 選擇API上傳
})();
	// var townData = document.getElementById("townData"); // 鄉鎮資料
	// var dataText = ""; // 空字串,存鄉鎮資料用


	var appearDiv = document.getElementById('appearDiv') // 出現不同上傳模式的區塊
	var appearSelect = document.getElementById('appearSelect') // 出現欄位下拉式區塊的區塊
	var chartContainer = document.getElementById('chartContainer'); // 用於顯示圖表

	// 找出對應的鄉鎮資料
	// function findData(JSON_List,currentId){
	// 	var currentId_length = currentId.slice(0,-1).length; // 只取鄉鎮名，不取鄉鎮市區(最後一個字)
	// 	var found = ""; // 找到的鄉鎮資料

	// 	for(var i = 0; i < JSON_List.length; i++){ // JSON_List.length: 9
	// 		for(var j = 0; j < Object.values(JSON_List[0]).length; j++){ // Object.values(JSON_List[0]).length: 10
	// 			//if(typeof(Object.values(JSON_List[i])[j]) == "string"){
	// 			if(currentId.slice(0,-1) == Object.values(JSON_List[i])[j].slice(0,currentId_length)){
	// 			found = (JSON_List[i]); // 找到的資料
	// 			return found;
	// 			}
	// 		}
	// 	}
	// }
    
    // 選擇上傳模式


	// API上傳
	function API_Appear(){
		rangeDiv.style.visibility = 'hidden';
		appearDiv.replaceChildren(); // 清除原本的所有元素
		chartContainer.replaceChildren();
		appearSelect.replaceChildren();

        var text = document.createElement('input'); // 生成文字輸入框
		text.type = 'text';
		text.id = 'textAPI';
		text.placeholder = '輸入API';
		text.setAttribute('value','');
		
		var submit = document.createElement('input'); // 生成上傳鈕
		submit.type = 'submit';
		submit.value = '上傳';
		submit.style.position = 'relative';
		submit.style.left = '5px';

		appearDiv.appendChild(text);
		appearDiv.appendChild(submit);

		var test = document.createElement('p');
		test.id = 'test';
		appearDiv.appendChild(test);

		submit.addEventListener('click', handleAPI); // 上傳後
	}

	//https://data.nantou.gov.tw/dataset/7ff9b37b-4067-45d8-aefb-6166e226190d/resource/c4126b32-a305-41d7-baa4-81d2516a511c/download/11203171446.csv
    // 讀取csv，並顯示鄉鎮資料csvForm
	 function handleAPI(){
		var textAPI = document.getElementById('textAPI').value;
		InputData = []; // 要傳出去製作圖表的陣列
		d3.csv(textAPI).then((data) => {
			var JSON_List = []; // 空陣列,存資料用
			colData = [] // 空陣列,存欄位名稱

			for(var i = 0; i < data.length; i++){ // 將csv資料丟進陣列(JSON形式)
				JSON_List.push(data[i]); // JSON型式
			}
			
			for(var i in JSON_List[0]){ // 取得欄位名稱
				colData.push(i)
			}
			
			for(var i = 0; i < JSON_List.length; i++){
				var newArray = []; // 建立空陣列,存value值
				for(var j in JSON_List[i]){
					newArray.push(JSON_List[i][j].toString());
				}
				InputData.push(newArray);
			}
			InputData.splice(0,0,colData); // 在第一個位置加入欄位名稱陣列
			InputData = analyze(InputData); // 資料清洗(在 analyzeData.js)
			renderColumnSelect();
			renderChart();
			
			// dataText = JSON.stringify(findData(JSON_List,currentId)); // 將object改成string
			// dataText = dataText.replace(/{/g,"").replace(/}/g,"").replace(/"/g,"").replace(/,/g,"、");
			// townData.textContent = dataText; // 輸出
		});
	}
    
	// 檔案上傳
    function File_Appear(){
		
		rangeDiv.style.visibility = 'hidden';
		appearDiv.replaceChildren(); // 清除原本的所有元素
		chartContainer.replaceChildren(); // 清除原本的所有元素
        var form = document.createElement('form'); // 生成表單(存檔案)
		form.id = 'csvForm';

		var csvFile = document.createElement('input'); // 生成檔案上傳鈕
		csvFile.id = 'csvFile';
		csvFile.type = 'file';
		csvFile.accept = '.csv';

		var submit = document.createElement('input'); // 生成上傳鈕
		submit.type = 'submit';
		submit.value = '上傳';

		form.appendChild(csvFile);
		form.appendChild(submit);
		appearDiv.appendChild(form);

		csvForm.addEventListener('submit', handleFormSubmit); // 上傳後
	}


	// 表單提交
	function handleFormSubmit(event) {
		event.preventDefault(); // 停止事件的默認動作
		var fileName = csvFile.files[0]; // 獲取選擇的檔案
		var reader = new FileReader(); // 讀取檔案
		reader.onload = handleFileLoad;
		reader.readAsText(fileName); // 將文件讀取爲文本
	}

	// 讀取csv
	var InputData = []; // 用於儲存解析後的CSV數據
	function handleFileLoad(event) {
		var csvData = event.target.result;
		InputData = parseCSV(csvData); // 回傳所有資料陣列
		InputData = analyze(InputData); // 資料清洗(在 analyzeData.js)

		appearSelect.replaceChildren(); // 欄位下拉式選單清除原本的所有元素
		renderColumnSelect();
		renderChart();
	}

	// 分析csv裡面的資料，並且去除雙引號""
	function parseCSV(csvData) {
		var lines = csvData.split('\n'); // 每行分組
		var data = [];
		for (var i = 0; i < lines.length; i++) {
			var line = lines[i].trim(); // 删除字符串的頭尾空白符號
			if (line !== '') { // 欄位資料不為空
				var values = line.split(','); // 每列中分組
				var rowData = [];
				for (var j = 0; j < values.length; j++) {
					var cellData = values[j].replace(/"/g, '');
					rowData.push(cellData); // 將每列元素加入陣列儲存
				}
				data.push(rowData);
			}
		}
		return data;
	}

	// 生成下拉式選單(選欄位)
	function renderColumnSelect(){
		var label = document.createElement('label');
		label.for = 'columnSelect';
		label.textContent = '選擇欄位：';
		label.style.fontSize = '14px';

		var select = document.createElement('select');
		select.id = 'columnSelect';

		appearSelect.appendChild(label);
		appearSelect.appendChild(select);

		appearSelect.style.position = 'relative';
        appearSelect.style.top = '10px';

		var columnNames = InputData[0]; // 欄位名稱
		for (var i = 0; i < columnNames.length; i++) {
			var option = document.createElement('option');
			option.value = i;
			option.text = columnNames[i];
			columnSelect.appendChild(option); // 將節點元素當成最後一個子元素加到父元素
		}
		columnSelect.addEventListener('change', handleColumnSelectChange); // 點下下拉選單裡面的值，去做改變
	}

	// 下拉選單值改變事件
	var selectedColumnIndex = 0; // 選擇的列索引
	function handleColumnSelectChange(){
		selectedColumnIndex = parseInt(columnSelect.value); // 將輸入的字串轉成整數
		renderChart();
		
	}

	//google charts長條圖
	function renderChart(){
		chartContainer.replaceChildren(); // 清除原本的所有元素
		//加載 Google Charts 套件的函式
		google.charts.load('current', { packages: ['corechart'] });
		google.charts.setOnLoadCallback(drawChart);

		function drawChart() {
			var data = new google.visualization.DataTable();
			data.addColumn('string', 'Name');
			data.addColumn('number', 'Value');
			

			for (var i = 1; i < InputData.length; i++){  // i由1開始，不算第一列(欄位名稱)
				var row = InputData[i];
				data.addRow([row[0].replace(/'/g, ''), parseFloat(row[selectedColumnIndex])]); // 將輸入的字串轉成浮點數
			}
			var options = {
				width: '100%',
				height: '100%',
				//colors:['red'],
				bar: { groupWidth: '80%'},
				legend: { position: 'none' },
				chartArea: { width: '80%', height: '80%'}, // 調整圖表區域大小
				
			};

			var chart = new google.visualization.ColumnChart(chartContainer);
			chart.draw(data, options);
		}
		statistics(); // 摘要統計(在 Statis&Color.js)
	}

    

