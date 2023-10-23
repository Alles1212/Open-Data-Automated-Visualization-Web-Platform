window.onload = (function() {
	var sentFile = document.getElementById('sentFile') // 傳送檔案按鈕
	var sentAPI = document.getElementById('sentAPI') // 傳送API按鈕
	var sentSelfFile = document.getElementById('sentSelfFile') // 自製表格傳送鈕

    sentFile.addEventListener('click',File_Appear); // 選擇檔案上傳
	sentAPI.addEventListener('click',API_Appear); // 選擇API上傳
	sentSelfFile.addEventListener('click',SelfFile_Appear); // 自製表格上傳

	//sentFile.addEventListener('mouseover', createButtonSuspendBox)
})();
	var appearDiv = document.getElementById('appearDiv') // 出現不同上傳模式的區塊
	var chartContainer = document.getElementById('chartContainer'); // 用於顯示長條圖
	var piechartContainer=document.getElementById('piechartContainer'); // 用於顯示圓餅圖
	var selectColumnDiv = document.getElementById('selectColumnDiv') // 欄位選擇區塊
	var selectColumnBtn = document.getElementById('selectColumnBtn'); // 用於顯示欄位選擇區塊
	var selectColumnData = document.getElementById('selectColumnData'); // 選擇行區塊
	var selectTownData = document.getElementById('selectTownData'); // 選擇鄉鎮區塊
	var selfFileBackDrop = document.getElementById('selfFileBackDrop'); // 自製表單背景
	var selfFile = document.getElementById('selfFile'); // 自製表單
	var inputRow = document.getElementById('inputRow'); // 自製表單選擇列
	var inputCol = document.getElementById('inputCol'); // 自製表單選擇欄
	var submitButtonForselfFile = document.getElementById('submitButtonForselfFile'); // 自製表單上傳鈕
	var OKButtonForselfFile = document.getElementById('OKButtonForselfFile'); // 自製表單確認鈕
	var clearButtonForselfFile = document.getElementById('clearButtonForselfFile'); // 自製表單清除鈕
	var closeButtonForselfFile = document.getElementById('closeButtonForselfFile'); // 自製表單關閉鈕

	OKButtonForselfFile.addEventListener('click',SelfFile_Appear); // 確定鈕
	submitButtonForselfFile.addEventListener('click',handleSelfFile); // 上傳鈕
	clearButtonForselfFile.addEventListener('click',clearSelfFile); // 清除鈕
	closeButtonForselfFile.addEventListener('click',closeSelfFile); // 清除鈕
	
	// 清除自製表單所有欄位的值
	function clearSelfFile(){
		inputRow.value = ""; // 清除列數量
		inputCol.value = ""; // 清除欄數量
		var inputValue = selfFile.getElementsByTagName('input'); // 獲取所有input值
		for(var i = 0; i < inputValue.length; i++){
			inputValue[i].value = "";
		}

		var select = selfFile.getElementsByTagName('select');
		for(var i = 0; i < select.length; i++){
			select[i].value = 1;
		}
		
	}
	function closeSelfFile(){
		selfFileBackDrop.style.display = 'none'; // 隱藏自製表單背景
	}
	
	// 自製表單上傳
	function SelfFile_Appear(){
		selfFile.replaceChildren(); // 清除原本的元素
		appearDiv.replaceChildren();
		selfFileBackDrop.style.display = 'block'; // 顯示自製表單背景

		var rowNum = parseInt(inputRow.value); // 輸入列
		var colNum = parseInt(inputCol.value); // 輸入欄

		var table = document.createElement('table'); // 建立表格
		var th = document.createElement('th');
		for(var i = 0; i < rowNum; i++){
			var tr = document.createElement('tr');
			var select = document.createElement('select'); // 建立下拉式清單
			
			for(var j = 0; j < colNum; j++){
				var td = document.createElement('td');
				
				td.style.width = 150 + 'px';
				td.style.height = 50 + 'px';
	
				var inputText = document.createElement('input');
				inputText.style.textAlign = 'center';
				inputText.type = 'text';
				inputText.style.width = td.style.width;
				inputText.style.height = td.style.height;
				inputText.style.fontSize = 22 + 'px';
				inputText.id = String(i) + String(j);

				td.insertBefore(inputText,td.childNodes[0]);

				if(i == 0){
					inputText.placeholder = '欄位名稱：'; // 提示字
				}else if(j == 0){
					td.removeChild(inputText); // 清除文字輸入盒，避免與下拉式清單重複
					
					for(var w = 0; w < allMap[currentMap].length; w++){
						var option = document.createElement('option');
						option.textContent = allMap[currentMap][w]['id'];
						option.style.textAlign = 'center';
						
						select.appendChild(option);
					}
					
					select.style.fontSize = 20 + 'px';
					select.style.height = 55 + 'px';
					select.style.width = 155 + 'px';
					select.id = String(i) + String(j);

					td.appendChild(select)
				}
				
				
				tr.appendChild(td);
			}
			table.appendChild(tr);
		}

		selfFile.appendChild(table);
		
	}

	// 處理自製表單
	function handleSelfFile(e){
		e.preventDefault(); // 防止上傳鍵自動點擊
		selfFileBackDrop.style.display = 'none'; // 隱藏自製表單
		var inputValue = selfFile.getElementsByTagName('input'); // 獲取所有input值

		var rowNum = parseInt(inputRow.value); // 輸入列
		var colNum = parseInt(inputCol.value); // 輸入欄

		InputData = []; // 重製輸入的陣列

		for(var j = 0; j < rowNum; j++){
			var rowData = [];
			for(var k = 0; k < colNum; k++){
				var row = document.getElementById(String(j) + String(k)).value;
				rowData.push(row);
			}
			InputData.push(rowData);
		}

		if(judgeBlankSpace(InputData)){ // 判斷空白格
			showError(InputData); // 顯示空白個所在位置
			return;
		}

		InputData = analyze(InputData); // 資料清洗(在 analyzeData.js)
		
		
		if(InputData.length == 0){ // 資料有空白(originArray)，不處理
			return;
		}else{ // 資料無空白，顯示圖表區
			buttonVisible(); // 顯示各式按鈕
			
			renderColumnSelect(); // 生成欄位下拉式清單
			renderRowSelect();

			renderColumnText(); // 生成欄位名稱區塊(地圖變換用)
			Grouping(); // 分組
			
		}
	}

	function buttonVisible(){
		columnNameDiv.style.visibility = 'visible'; // 顯示欄位選擇區塊
		changeBtnForRight.style.visibility = 'visible'; // 顯示更換地圖按鈕
		changeBtnForLeft.style.visibility = 'visible'; // 顯示更換地圖按鈕
		colorBtn.style.visibility = 'visible'; // 顯示按鈕
		selectColumnDiv.style.visibility = 'visible'; // 顯示選擇欄位區塊
	}
	
	selectColumnBtn.addEventListener('mousemove',function(){
		selectColumnDiv.style.visibility = 'visible'; // 顯示欄位選擇區塊
		selectColumnBtn.style.visibility = 'hidden'; // 隱藏選擇欄位按鈕
	})

	selectColumnDiv.addEventListener('mouseleave',function(){
		selectColumnDiv.style.visibility = 'hidden'; // 隱藏欄位選擇區塊
		selectColumnBtn.style.visibility = 'visible'; // 顯示選擇欄位按鈕
	})

	// API上傳
	function API_Appear(){
		rangeDiv.style.visibility = 'hidden';  // 先將範圍框隱藏
		appearDiv.replaceChildren(); // 清除原本的所有元素
		chartContainer.replaceChildren();


        var text = document.createElement('input'); // 生成文字輸入框
		text.type = 'text';
		text.id = 'textAPI';
		text.placeholder = '輸入API';
		text.setAttribute('value','');
		
		var submit = document.createElement('input'); // 生成上傳鈕
		submit.type = 'submit';
		submit.id = 'submitAPI';
		submit.value = '';

		appearDiv.appendChild(text);
		appearDiv.appendChild(submit);

		var test = document.createElement('p');
		test.id = 'test';
		appearDiv.appendChild(test);

		submit.addEventListener('click', handleAPI); // 上傳後

		submit.addEventListener('mousemove',createButtonSuspendBox); // 滑鼠進入按鈕

		submit.addEventListener('mouseout',function(){  // 滑鼠離開按鈕
    		suBoxForButtons.style.visibility = 'hidden';
		})
	}

	//https://data.nantou.gov.tw/dataset/7ff9b37b-4067-45d8-aefb-6166e226190d/resource/c4126b32-a305-41d7-baa4-81d2516a511c/download/11203171446.csv
    // 讀取API,做資料清洗並生成圖表
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
			
			if(judgeBlankSpace(InputData)){
				showError(InputData); // 顯示空白區域
				return;
			}
			InputData = analyze(InputData); // 資料清洗(在 analyzeData.js)
			
			if(InputData.length == 0){ // 資料有空白(originArray)，不處理
				return;
			}else{ // 資料無空白，顯示圖表區
	
				buttonVisible(); // 顯示各式按鈕
				renderColumnSelect(); // 生成欄位下拉式清單
				renderRowSelect();
				renderColumnText(); // 生成欄位名稱區塊(地圖變換用)
				Grouping(); // 分組
				
			}
		});
	}

    var form = document.getElementById('csvForm') // 出現不同上傳模式的區塊		
	// 檔案上傳
    function File_Appear(){
		rangeDiv.style.visibility = 'hidden'; // 先將範圍框隱藏
		appearDiv.replaceChildren(); // 清除原本的所有元素
		chartContainer.replaceChildren(); // 清除原本的所有元素


        var form = document.createElement('form'); // 生成表單(存檔案)
		form.id = 'csvForm';
		

		var div = document.createElement('div');
		div.id = 'divForCsvFile';

		var csvFile = document.createElement('input'); // 生成檔案上傳鈕
		csvFile.id = 'csvFile';
		csvFile.type = 'file';
		csvFile.accept = '.csv';
		csvFile.style.visibility = 'hidden';

		div.addEventListener("click",function(){
			csvFile.click();
		})

		
		var submit = document.createElement('input'); // 生成上傳鈕
		submit.id = 'submit';
		submit.type = 'submit';
		submit.value = "";

		submit.addEventListener('mousemove',createButtonSuspendBox); // 滑鼠進入按鈕

		submit.addEventListener('mouseout',function(){  // 滑鼠離開按鈕
    		suBoxForButtons.style.visibility = 'hidden';
		})
	
		div.appendChild(csvFile)
		form.appendChild(div);
		form.appendChild(submit);
		appearDiv.appendChild(form);
		
		csvForm.addEventListener('submit', handleFormSubmit); // 上傳後

		divForCsvFile.addEventListener('mousemove',createButtonSuspendBox); // 滑鼠進入按鈕

		divForCsvFile.addEventListener('mouseout',function(){  // 滑鼠離開按鈕
    		suBoxForButtons.style.visibility = 'hidden';
		})

	}
	
	// 表單提交
	function handleFormSubmit(event){
		csvForm.style.visibility = 'hidden'; // 隱藏檔案上傳區

		
		event.preventDefault(); // 停止事件的默認動作
		var fileName = csvFile.files[0]; // 獲取選擇的檔案
		var reader = new FileReader(); // 讀取檔案
		reader.onload = handleFileLoad;
		reader.readAsText(fileName); // 將文件讀取爲文本


		showFileName(fileName);
	}

	// 顯示檔案名稱
	function showFileName(fileName){
		var span = document.createElement('span');
		span.textContent = '檔案名稱：' + fileName['name'];
		span.style.position = 'relative';
		span.style.top = -60 + 'px';
		span.style.fontSize = 18 + 'px';
		span.style.backgroundColor = '#CCCCFF';
		appearDiv.appendChild(span);
	}

	// 讀取csv
	var InputData = []; // 用於儲存解析後的CSV數據
	function handleFileLoad(event) {
		var csvData = event.target.result;

		InputData = parseCSV(csvData); // 回傳所有資料陣列

		if(judgeBlankSpace(InputData)){
			skipBlank(InputData); // 刪掉空白較多的行
			showError(InputData); // 顯示空白區域
			return;
		}

		InputData = analyze(InputData); // 資料清洗(在 analyzeData.js)
		
		if(InputData.length == 0){ // 資料有空白(originArray)，不處理
			return;
		}else{ // 資料無空白，顯示圖表區

			buttonVisible(); // 顯示各式按鈕

			renderColumnSelect(); // 生成欄位下拉式清單
			renderRowSelect();
			renderColumnText(); // 生成欄位名稱區塊(地圖變換用)
			Grouping(); // 分組
		}
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

	// 欄位名稱複選區塊
	function renderColumnSelect(){
		selectColumnData.replaceChildren(); // 清除原本的元素
		var columnNames = InputData[0]; // 欄位名稱
		for(var i = 0; i < columnNames.length; i++){
			var checkbox = document.createElement('input'); // 建立複選盒
			checkbox.type = 'checkbox';
			checkbox.value = i;

			checkbox.addEventListener('change', function(event){ // 點擊複選盒後
                handleCheckboxChange(event); // 選擇欄位複選盒狀態改變
                handleCheckboxChange2(event); // 選擇鄉鎮複選盒狀態改變
            });

			var label = document.createElement('label'); // 建立label
			label.appendChild(checkbox);
			label.appendChild(document.createTextNode(columnNames[i])); // 顯示欄位名稱文字

			selectColumnData.appendChild(label);

			showColumnChart.addEventListener('change', handleCheckboxChange);
			showPieChart.addEventListener('change', handleCheckboxChange);
		}
	}

	
	
	// 鄉鎮名稱複選區塊
    function renderRowSelect(){ 
        selectTownData.replaceChildren(); // 清除原本的元素
        var rowData = InputData.map(function(row) {
            return row[0]; // 鄉鎮名稱
        });

        for(var i = 1; i < rowData.length; i++){ // 因為會記錄到欄位名稱，所以位置從1開始
            var checkbox = document.createElement('input'); // 建立複選框
            checkbox.type = 'checkbox';
            checkbox.value = rowData[i];
            //checkbox.id = 'checkbox' + i;
    
            checkbox.addEventListener('change', function(event){ // 點擊複選盒後
                handleCheckboxChange(event); // 選擇欄位複選盒狀態改變
				handleCheckboxChange2(event); // 選擇鄉鎮複選盒狀態改變
            });
            
            var label = document.createElement('label'); // 創建label
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(rowData[i]));
    
            selectTownData.appendChild(label);

			showColumnChart.addEventListener('change', handleCheckboxChange2);
            showPieChart.addEventListener('change', handleCheckboxChange2);

			
        }
		
    }

	var selectedColumnIndices = []; // 記錄所選擇的欄位名稱複選框
	// 選擇欄位複選盒狀態改變
	function handleCheckboxChange(event) {
		var checkbox = event.target;
		var columnIndex = checkbox.value; // 當前欄位
		
		// 不為選擇圖表的複選框
		if(!(checkbox === document.getElementById('showColumnChart') || checkbox === document.getElementById('showPieChart')
			// || checkbox === document.getElementById('showLineChart')|| checkbox === document.getElementById('showAreaChart')||
			// checkbox === document.getElementById('showBarChart')
			)){

			if(checkbox.checked){ // 被點擊且為打勾狀態
				selectedColumnIndices.push(columnIndex); // 加入到陣列
				
			}else{ // 被點擊且不為打勾狀態(點擊第二次)
				var index = selectedColumnIndices.indexOf(columnIndex);
				if(index != -1) {
					selectedColumnIndices.splice(index, 1); // 從陣列刪掉該index
				}
			}

		}
		updateChartDisplay();
	}

    var selectedRows = []; // 記錄所選擇的鄉鎮名稱複選框
    // 選擇鄉鎮複選盒狀態改變
    function handleCheckboxChange2(event) {
        var checkbox = event.target;
        var columnName = checkbox.value;
        
        if(checkbox.checked){ // 被點擊且為打勾狀態
            selectedRows.push(columnName); // 加入到陣列
        }else{ // 被點擊且不為打勾狀態(點擊第二次)
            var index = selectedRows.indexOf(columnName);
            if (index != -1) {
                selectedRows.splice(index, 1); // 從陣列刪掉該index
            }
        }

        updateChartDisplay();
    }

	// 顯示或隱藏各圖表
	function updateChartDisplay() {
		var showColumnChart = document.getElementById('showColumnChart').checked; // 長條圖複選盒打勾
        var showPieChart = document.getElementById('showPieChart').checked; // 圓餅圖複選盒打勾
        // var showLineChart = document.getElementById('showLineChart').checked;
        // var showAreaChart = document.getElementById('showAreaChart').checked;
        // var showBarChart = document.getElementById('showBarChart').checked;

        chartContainer.style.display = showColumnChart ? 'block' : 'none';
        piechartContainer.style.display = showPieChart ? 'block' : 'none';
        // linechartContainer.style.display = showLineChart ? 'block' : 'none';
        // areachartContainer.style.display = showAreaChart ? 'block' : 'none';
        // barchartContainer.style.display= showBarChart ? 'block' : 'none';

        // 顯示對應的圖表
        if (showColumnChart) {
            renderChart();
        }
        if (showPieChart) {
            renderPieChart();
        }
        // if (showLineChart) {
        //     renderLineChart();
        // }
        // if (showAreaChart) {
        //     renderAreaChart();
        // }
        // if (showBarChart) {
        //     renderBarChart();
        // }
    }

	// google charts長條圖
	function renderChart(){
		chartContainer.replaceChildren(); // 清除原本的所有元素
		// 加載 Google Charts 套件的函式
		google.charts.load('current', { packages: ['corechart'] });
		google.charts.setOnLoadCallback(drawChart);

		function drawChart() {
			var data = new google.visualization.DataTable();
            data.addColumn('string', 'Name');
            //獲取資料名稱
            for (var i = 0; i < selectedColumnIndices.length; i++) {
                var columnIndex = selectedColumnIndices[i];
                data.addColumn('number', InputData[0][columnIndex]);
            }
			
			
			for (var i = 1; i < InputData.length; i++) {
                var row = InputData[i];
                var rowData = [row[0].replace(/"/g, '')];
                
                if (selectedRows.indexOf(rowData[0]) !== -1) {
                    for (var j = 0; j < selectedColumnIndices.length; j++) {
                        var columnIndex = selectedColumnIndices[j];
                        //將結果添加到rowData
                        rowData.push(parseFloat(row[columnIndex]));
                    }
                    data.addRow(rowData);
                }
            }

			var options = {
				animation:{ // 載入動畫
					startup: true,
					duration: 1000,
					easing: 'out',
                },
				series: {
                    0: { color: '#FFDAB9' }//設定長條顏色為 #FFDAB9
                },
				width: '100%',
				height: '100%',
				bar: { groupWidth: '80%'},
				legend: { position: 'none' },
				chartArea: { width: '80%', height: '80%'}, // 調整圖表區域大小
				
			};

			var chart = new google.visualization.ColumnChart(chartContainer);
			chart.draw(data, options);
		}
		
	}

	function renderPieChart() {
        piechartContainer.replaceChildren();
        //使用Google Charts的PieChart函式來繪製圓餅圖
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(drawPieChart);

        function drawPieChart() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Name');
            for (var i = 0; i < selectedColumnIndices.length; i++) {
                var columnIndex = selectedColumnIndices[i];
                data.addColumn('number', InputData[0][columnIndex]);
            }

            var pieData = [];

            //獲取圓餅圖的數據
            for (var i = 1; i < InputData.length; i++) {
                var row = InputData[i];
                var rowData = [row[0].replace(/"/g, '')];
                for (var j = 0; j < selectedColumnIndices.length; j++) {
                    var columnIndex = selectedColumnIndices[j];
                    rowData.push(parseFloat(row[columnIndex]));
                }
                pieData.push(rowData);
            }

            data.addRows(pieData);

            var options = {
                animation: {
                    startup: true,
                    duration: 1000,
                    easing: 'out',
                },
                width: '100%',
                height: '100%',
                legend: 'right', // 將圖例放在右側
                chartArea: { width: '80%', height: '80%' },
            };

            var chart = new google.visualization.PieChart(piechartContainer);
            chart.draw(data, options);
        }
    }
    

