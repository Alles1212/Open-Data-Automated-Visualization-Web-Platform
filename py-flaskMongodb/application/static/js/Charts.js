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
    var chartsDiv = document.getElementById('chartsDiv'); // 圖表區塊
    var returnBtn = document.getElementById('returnBtn'); // 返回按鈕
    
	var chartContainer = document.getElementById('chartContainer'); // 用於顯示長條圖
	var piechartContainer=document.getElementById('piechartContainer'); // 用於顯示圓餅圖
	var linechartContainer = document.getElementById('linechartContainer');
    var areachartContainer = document.getElementById('areachartContainer');
    var barchartContainer = document.getElementById('barchartContainer');
    var combochartContainer = document.getElementById('combochartContainer');
    var stackchartContainer = document.getElementById('stackchartContainer');

	var selectColumnDiv = document.getElementById('selectColumnDiv') // 欄位選擇區塊
	var selectColumnBtn = document.getElementById('selectColumnBtn'); // 用於顯示欄位選擇區塊
	var selectColumnData = document.getElementById('selectColumnData'); // 選擇行區塊
	var selectTownData = document.getElementById('selectTownData'); // 選擇鄉鎮區塊
	var selfFileBackDrop = document.getElementById('selfFileBackDrop'); // 自製表單背景
	var selfFile = document.getElementById('selfFile'); // 自製表單
	var inputRow = document.getElementById('inputRow'); // 自製表單選擇列
	var inputCol = document.getElementById('inputCol'); // 自製表單選擇欄
    var inputRowDiv = document.getElementById('inputRowDiv'); // 自製表單選擇列區塊
    var inputColDiv = document.getElementById('inputColDiv'); // 自製表單選擇欄區塊
	var submitButtonForselfFile = document.getElementById('submitButtonForselfFile'); // 自製表單上傳鈕
	var OKButtonForselfFile = document.getElementById('OKButtonForselfFile'); // 自製表單確認鈕
	var clearButtonForselfFile = document.getElementById('clearButtonForselfFile'); // 自製表單清除鈕
	var closeButtonForselfFile = document.getElementById('closeButtonForselfFile'); // 自製表單關閉鈕
    var addButton_Row = document.getElementById('addButton_Row'); // 自製表單新增列按鈕
    var addButton_Col = document.getElementById('addButton_Col'); // 自製表單新增欄按鈕
    // var minusButton_Row = document.getElementById('minusButton_Row'); // 自製表單刪除列按鈕
    // var minusButton_Col = document.getElementById('minusButton_Col'); // 自製表單刪除欄按鈕
    var returnButtonForselfFile = document.getElementById('returnButtonForselfFile'); // 自製表單返回按鈕
    var minusAllBtn = document.getElementById('minusAllBtn'); // 自製表單刪除按鈕

	OKButtonForselfFile.addEventListener('click',SelfFile_Appear); // 確定鈕
	submitButtonForselfFile.addEventListener('click',handleSelfFile); // 上傳鈕
	clearButtonForselfFile.addEventListener('click',clearSelfFile); // 清除鈕
	closeButtonForselfFile.addEventListener('click',closeSelfFile); // 清除鈕
    addButton_Row.addEventListener('click',addRowForSelfFile); // 新增列鈕
    addButton_Col.addEventListener('click',addColForSelfFile); // 新增欄鈕
    returnButtonForselfFile.addEventListener('click',returnMinus); // 返回鈕
    minusAllBtn.addEventListener('click',minusAll); // 刪除按鈕

    // 圖表返回鈕
    returnBtn.addEventListener('click',function(){
        document.getElementById('chooseMethod').style.visibility = 'visible'; // 顯示按鈕區塊
        returnBtn.style.visibility = 'hidden'; // 隱藏返回鈕

    })

     // 返回刪除鈕
    function returnMinus(){
        returnButtonForselfFile.style.visibility = 'hidden';  // 隱藏返回按鈕
        minusAllBtn.style.visibility = 'visible'; // 顯示刪除鈕

        addButton_Row.style.visibility = 'visible'; // 顯示新增列按鈕
        addButton_Col.style.visibility = 'visible'; // 顯示新增欄按鈕

        var table = selfFile.getElementsByTagName('table')[0];
        var trLen = selfFile.getElementsByTagName('tr');

        // 第一列元素有刪除鈕
        if(table.firstChild.childNodes[2].childNodes[0].id == 'minusBtnForCol' + 1){
            table.removeChild(table.firstChild); // 刪掉
            for(var i = 0; i < trLen.length; i++){ // 刪除所有列按鈕
                trLen[i].removeChild(trLen[i].firstChild);
            }
        }

        var table = selfFile.getElementsByTagName('table');
        var tableTr = table[0].getElementsByTagName('tr');
        redefineID(tableTr); // 賦予id

    }
	
	// 清除自製表單所有欄位的值
	function clearSelfFile(){
		inputRow.value = ""; // 清除列數量
		inputCol.value = ""; // 清除欄數量
		var inputValue = selfFile.getElementsByTagName('input'); // 獲取所有input值
		for(var i = 0; i < inputValue.length; i++){
			inputValue[i].value = "";
		}

		var select = selfFile.getElementsByTagName('select'); // 下拉式清單
		for(var i = 0; i < select.length; i++){
			select[i].value = 1;
		}
		
	}
	function closeSelfFile(){
		selfFileBackDrop.style.display = 'none'; // 隱藏自製表單背景
        document.getElementById('chooseMethod').style.visibility = 'visible'; // 顯示按鈕區塊

	}
	

    var recordRowNum = 0;
    var recordColNum = 0;
	// 自製表單上傳
	function SelfFile_Appear(){
        document.getElementById('chooseMethod').style.visibility = 'hidden'; // 隱藏按鈕區塊
		selfFile.replaceChildren(); // 清除原本的元素
		appearDiv.replaceChildren();
		selfFileBackDrop.style.display = 'block'; // 顯示自製表單背景
        returnButtonForselfFile.style.visibility = 'hidden';  // 隱藏返回按鈕

		// var rowNum = parseInt(inputRow.value); // 輸入列
		// var colNum = parseInt(inputCol.value); // 輸入欄

        var rowNum = allMap[currentMap].length + 1; // 列數量(各鄉鎮數)
        var colNum = 5; // 預設欄數量

        inputRowDiv.textContent = '列數：' + rowNum;
        inputColDiv.textContent = '欄數：' + colNum;

		var table = document.createElement('table'); // 建立表格
		for(var i = 0; i < rowNum; i++){
			var tr = document.createElement('tr'); // 建立列
			var select = document.createElement('select'); // 建立下拉式清單
			
			for(var j = 0; j < colNum; j++){
				var td = document.createElement('td'); // 建立欄
				
				td.style.width = 150 + 'px';
				td.style.height = 50 + 'px';
	
				var inputText = document.createElement('input'); // 建立文字輸入盒
				inputText.style.textAlign = 'center';
				inputText.type = 'text';
				inputText.style.width = td.style.width;
				inputText.style.height = td.style.height;
				inputText.style.fontSize = 22 + 'px';

				td.insertBefore(inputText,td.childNodes[0]); // 輸入盒加入每一欄位

				if(i == 0){ // 第一列
                    inputText.style.fontWeight = 'bold'; // 字體加粗
					inputText.placeholder = '欄位名稱：'; // 提示字

                    
                    if(j == 0){ // 第一格
                        inputText.value = '鄉鎮欄位';
                    }
				}else if(j == 0){ // 第一欄
					td.removeChild(inputText); // 清除文字輸入盒，避免與下拉式清單重複
					
					for(var w = 0; w < allMap[currentMap].length; w++){
						var option = document.createElement('option'); // 建立選單資料
						option.textContent = allMap[currentMap][w]['id']; // 各鄉鎮
						option.style.textAlign = 'center';
						
						select.appendChild(option);
					}
					
					select.style.fontSize = 20 + 'px';
					select.style.height = 55 + 'px';
					select.style.width = 155 + 'px';

					td.appendChild(select);

                    
				}
                td.style.position = 'relative';
                td.style.left = 10 + 'px';
                td.style.top = 10 + 'px';

				tr.appendChild(td);
			}
			table.appendChild(tr);
		}
        selfFile.appendChild(table);
        
        var selectTown = selfFile.getElementsByTagName('select'); // 抓取下拉式選單
        for(var i = 0; i < selectTown.length; i++){ // 更改下拉式清單的值為各鄉鎮
            selectTown[i].value = allMap[currentMap][i]['id'];
        }

        // table.style.display = 'flex';
        // table.style.flexDirection = 'column'
        // table.style.alignItems = 'start';
        // table.style.justifySelf = 'center';

		recordRowNum = rowNum; // 記錄列數
        recordColNum = colNum; // 記錄欄數

        var tableTr = table.getElementsByTagName('tr'); // 所有tr(列)
        redefineID(tableTr); // 賦予id
        
	}
    
    // 新增列
    function addRowForSelfFile(){
        recordRowNum += 1; // 列數加一
        inputRowDiv.textContent = '列數：' + recordRowNum; // 顯示文字

        var table = selfFile.getElementsByTagName('table');
        var tr = document.createElement('tr');
        var select = document.createElement('select'); // 建立下拉式清單
        for(var i = 0; i < recordColNum; i++){
            var td = document.createElement('td');
            td.style.width = 150 + 'px';
            td.style.height = 50 + 'px';

            var inputText = document.createElement('input'); // 建立文字輸入盒
            inputText.style.textAlign = 'center';
            inputText.type = 'text';
            inputText.style.width = td.style.width;
            inputText.style.height = td.style.height;
            inputText.style.fontSize = 22 + 'px';

            td.insertBefore(inputText,td.childNodes[0]); // 輸入盒加入每一欄位

            if(i == 0){ // 第一欄
                td.removeChild(inputText); // 清除文字輸入盒，避免與下拉式清單重複
                
                for(var w = 0; w < allMap[currentMap].length; w++){
                    var option = document.createElement('option'); // 建立選單資料
                    option.textContent = allMap[currentMap][w]['id'];
                    option.style.textAlign = 'center';
                    
                    select.appendChild(option);
                }
                
                select.style.fontSize = 20 + 'px';
                select.style.height = 55 + 'px';
                select.style.width = 155 + 'px';

                td.appendChild(select)
            }

            td.style.position = 'relative';
            td.style.left = 10 + 'px';
            td.style.top = 10 + 'px';

            tr.appendChild(td);
        }

        table[0].insertBefore(tr,table[0].childNodes[1]); // 加到第一列
        
        var tableTr = table[0].getElementsByTagName('tr');

        redefineID(tableTr); // 賦予id
    }

    // 賦予id
    function redefineID(tableTr){
        console.log(tableTr)
        if(isMinusRow == true){
            for(var i = 0; i < tableTr.length; i++){
                for(var j = 0; j < recordColNum; j++){
                    if(j != recordColNum-1){
                        tableTr[i].childNodes[j+1].id = String(i) + String(j);
                    }else{
                        tableTr[i].childNodes[j].id = String(i) + String(j-1);
                    }
                    
                }
            }
            isMinusRow = false; // 重製
        }else if(isMinusCol == true){
            for(var i = 0; i < tableTr.length; i++){
                for(var j = 0; j < recordColNum; j++){
                    console.log(recordColNum)
                    if(i != tableTr.length-1){
                        tableTr[i+1].childNodes[j].id = String(i) + String(j-1);
                    }else{
                        tableTr[i].childNodes[j].id = String(i-1) + String(j);
                    }
                    
                }
                console.log(tableTr[i].childNodes[0])
                tableTr[i].childNodes[0].id = 'minusBtnForRow' + i;
            }
            isMinusCol = false; // 重製
        }else{
            for(var i = 0; i < tableTr.length; i++){
                for(var j = 0; j < recordColNum; j++){
                    tableTr[i].childNodes[j].id = String(i) + String(j);
                }
            }
        }
    }

    // 新增欄
    function addColForSelfFile(){
        var table = selfFile.getElementsByTagName('table');
        var alltr = selfFile.getElementsByTagName('tr'); // 建立列
        console.log(alltr);
        for(var i = 0; i < recordRowNum; i++){
            for(var j = 0; j < 1; j++){
                var td = document.createElement('td'); // 建立欄

                td.style.width = 150 + 'px';
                td.style.height = 50 + 'px';
    
                var inputText = document.createElement('input'); // 建立文字輸入盒
                inputText.style.textAlign = 'center';
                inputText.type = 'text';
                inputText.style.width = td.style.width;
                inputText.style.height = td.style.height;
                inputText.style.fontSize = 22 + 'px';
    
                if(i == 0){ // 第一列
                    inputText.style.fontWeight = 'bold'; // 字體加粗
                    inputText.placeholder = '欄位名稱：'; // 提示字
                }
    
                td.insertBefore(inputText,td.childNodes[0]); // 輸入盒加入每一欄位

                td.style.position = 'relative';
                td.style.left = 10 + 'px';
                td.style.top = 10 + 'px';
            }
            
            alltr[i].insertBefore(td,alltr[i].childNodes[1]); // 加入每一列
        }

        recordColNum += 1; // 欄數加一
        inputColDiv.textContent = '欄數：' + recordColNum; // 顯示文字

        var tableTr = table[0].getElementsByTagName('tr');
        redefineID(tableTr); // 賦予id
    }

    var isMinusRow = false; // 判斷點擊刪除列按鈕
    var isMinusCol = false; // 判斷點擊刪除欄按鈕
    // 顯示所有刪除按鈕
    function minusAll(){
        minusAllBtn.style.visibility = 'hidden'; // 隱藏刪除鈕
        returnButtonForselfFile.style.visibility = 'visible'; // 顯示返回鈕

        var table = selfFile.getElementsByTagName('table')[0]; // 表格
        var allTr = selfFile.getElementsByTagName('tr'); // 所有列
        var firsTr = document.createElement('tr'); // 建立第一列
        var currentRowNum = 0; // 記錄目前列數
        var currentColNum = 0; // 記錄目前欄數

        // 建立逐欄按鈕
        for(var i = 0; i < allTr[0].children.length; i++){
            var td = document.createElement('td'); // 建立欄位
            var minusBtnForCol = document.createElement('button'); // 建立刪除欄按鈕(逐欄)
            minusBtnForCol.className = 'minusBtnForCol';
            minusBtnForCol.id = 'minusBtnForCol' + i;

            td.appendChild(minusBtnForCol);
            firsTr.appendChild(td);

            if(i == 0){ // 第一欄(鄉鎮欄位)不顯示按鈕
                minusBtnForCol.style.visibility = 'hidden';
            }

            // 逐欄刪減
            minusBtnForCol.addEventListener('click',function(e){
                var btnID = e.target.id; // 目前點擊的id
                for(var k = 0; k < allTr.length; k++){
                    for(var j = allTr[0].children.length-1; j >= 0; j--){
                        if(btnID == 'minusBtnForCol' + j){ // 刪掉該欄
                            allTr[k].removeChild(allTr[k].childNodes[j+1]);
                        }
                    }
                }

                var reTr = selfFile.getElementsByTagName('tr')[0]; // 第一列

                for(var k = 1; k < reTr.children.length; k++){
                    reTr.childNodes[k].childNodes[0].id = 'minusBtnForCol' + (k-1); // 重新定義按鈕id
                    currentColNum = reTr.children.length-1; // 減一扣掉按鈕欄
                }

                recordColNum = currentColNum; // 記錄正確列數
                inputColDiv.textContent = '欄數：' + recordColNum; // 顯示文字

                isMinusCol = true; // 確定點擊
                var tableTr = table.getElementsByTagName('tr');
                redefineID(tableTr); // 賦予id
            })
        }
        table.insertBefore(firsTr,table.childNodes[0]);


        // 建立逐列按鈕
        for(var i = 0; i < allTr.length; i++){
            var minusBtnForRow = document.createElement('button'); // 建立刪除列按鈕(逐列)
            minusBtnForRow.className = 'minusBtnForRow';
            minusBtnForRow.id = 'minusBtnForRow' + i;
            allTr[i].insertBefore(minusBtnForRow, allTr[i].childNodes[0]); // 加到每列最前面

            // 第一列(欄位刪除鈕)，第二列(欄位名稱)不顯示按鈕
            if(i == 0 || i == 1){
                minusBtnForRow.style.visibility = 'hidden';
            }

            // 逐列刪減
            minusBtnForRow.addEventListener('click',function(e){
                var btnID = e.target.id; // 目前點擊的id
                for(var j = allTr.length-1; j >= 0; j--){
                    if(btnID == 'minusBtnForRow' + j){ // 刪掉該列
                        table.removeChild(table.childNodes[j])
                    }
                }
                
                var reTr = selfFile.getElementsByTagName('tr');
                for(var k = 0; k < reTr.length; k++){
                    reTr[k].firstChild.id = 'minusBtnForRow' + k; // 重新定義按鈕id
                    currentRowNum = reTr.length-1; // 減一扣掉按鈕那欄
                }

                recordRowNum = currentRowNum; // 記錄正確列數
                inputRowDiv.textContent = '列數：' + recordRowNum; // 顯示文字

                isMinusRow = true; // 確定點擊
                var tableTr = table.getElementsByTagName('tr');
                redefineID(tableTr); // 賦予id
            })
        }
    }

    var isSelfFile = false; // 判斷是否由自製表單送出的InputData
	// 處理自製表單
	function handleSelfFile(e){
        chartsDiv.replaceChildren();
        chartsDiv.style.backgroundColor = 'transparent'
        returnBtn.style.visibility = 'visible'; // 顯示返回鈕
        isSelfFile = true;
		e.preventDefault(); // 防止上傳鍵自動點擊
		selfFileBackDrop.style.display = 'none'; // 隱藏自製表單
		var inputValue = selfFile.getElementsByTagName('input'); // 獲取所有input值

		var rowNum = recordRowNum; // 輸入列
		var colNum = recordColNum; // 輸入欄

		InputData = []; // 重製輸入的陣列

		for(var j = 0; j < rowNum; j++){
			var rowData = [];
			for(var k = 0; k < colNum; k++){
				var row = document.getElementById(String(j) + String(k)).childNodes[0].value;
                console.log(row)
				rowData.push(row);
			}
			InputData.push(rowData);
		}
        console.log(InputData)

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
		//rangeDiv.style.visibility = 'hidden';  // 將範圍框隱藏
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
        document.getElementById('chooseMethod').style.visibility = 'hidden'; // 隱藏按鈕區塊
        appearDiv.replaceChildren();
        suBoxForButtons.style.visibility = 'hidden'; // 懸浮框隱藏
        returnBtn.style.visibility = 'visible'; // 顯示返回鈕
        
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
		});
	}

    var form = document.getElementById('csvForm') // 出現不同上傳模式的區塊		
	// 檔案上傳
    function File_Appear(){
		//rangeDiv.style.visibility = 'hidden'; // 先將範圍框隱藏
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
        document.getElementById('chooseMethod').style.visibility = 'hidden'; // 隱藏按鈕區塊
        suBoxForButtons.style.visibility = 'hidden'; // 懸浮框隱藏
        returnBtn.style.visibility = 'visible'; // 顯示返回鈕
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
			showLineChart.addEventListener('change', handleCheckboxChange);
            showAreaChart.addEventListener('change', handleCheckboxChange);
            showBarChart.addEventListener('change', handleCheckboxChange);
            showComboChart.addEventListener('change', handleCheckboxChange);
            showStackChart.addEventListener('change', handleCheckboxChange);
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
                //handleCheckboxChange(event); // 選擇欄位複選盒狀態改變
				handleCheckboxChange2(event); // 選擇鄉鎮複選盒狀態改變
				updateChartDisplay();
            });
            
            var label = document.createElement('label'); // 創建label
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(rowData[i]));
    
            selectTownData.appendChild(label);

			// showColumnChart.addEventListener('change', handleCheckboxChange2);
            // showPieChart.addEventListener('change', handleCheckboxChange2);

			
        }
		
    }

	var selectedColumnIndices = []; // 記錄所選擇的欄位名稱複選框
	// 選擇欄位複選盒狀態改變
	function handleCheckboxChange(event) {
		var checkbox = event.target;
		var columnIndex = checkbox.value; // 當前欄位
		
		// 不為選擇圖表的複選框
		if(!(checkbox === document.getElementById('showColumnChart') ||
			 checkbox === document.getElementById('showPieChart') ||
			 checkbox === document.getElementById('showLineChart') ||
			 checkbox === document.getElementById('showAreaChart') ||
			 checkbox === document.getElementById('showBarChart') ||
			 checkbox === document.getElementById('showComboChart') ||
			 checkbox === document.getElementById('showStackChart')
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
        var showLineChart = document.getElementById('showLineChart').checked; // 折線圖複選盒打勾
        var showAreaChart = document.getElementById('showAreaChart').checked; // 區域圖複選盒打勾
        var showBarChart = document.getElementById('showBarChart').checked; // 柱狀圖複選盒打勾
		var showComboChart = document.getElementById('showComboChart').checked; // 組合圖複選盒打勾
        var showStackChart = document.getElementById('showStackChart').checked; // 堆疊階梯狀圖複選盒打勾


        chartContainer.style.display = showColumnChart ? 'block' : 'none';
        piechartContainer.style.display = showPieChart ? 'block' : 'none';
        linechartContainer.style.display = showLineChart ? 'block' : 'none';
        areachartContainer.style.display = showAreaChart ? 'block' : 'none';
        barchartContainer.style.display = showBarChart ? 'block' : 'none';
        combochartContainer.style.display = showComboChart ? 'block' : 'none';
        stackchartContainer.style.display = showStackChart ? 'block' : 'none';

        // 顯示對應的圖表
        if(showColumnChart){
            renderChart();
        }
        if(showPieChart){
            renderPieChart();
        }
        if(showLineChart){
            renderLineChart();
        }
        if(showAreaChart){
            renderAreaChart();
        }
        if(showBarChart){
            renderBarChart();
        }
        if(showComboChart){
            renderComboChart();
        }
        if(showStackChart){
            renderStackChart();
        }

    }

	// google charts柱狀圖
	function renderChart(){
		chartContainer.innerHTML = '';
		//加載 Google Charts 套件的函式
		google.charts.load('current', { packages: ['corechart'] });
		google.charts.setOnLoadCallback(drawChart);

		function drawChart(){
			var data = new google.visualization.DataTable();
			data.addColumn('string', 'Name');
			//獲取資料名稱
			console.log(selectedColumnIndices);
			for(var i = 0; i < selectedColumnIndices.length; i++) {
				var columnIndex = selectedColumnIndices[i];
				data.addColumn('number', InputData[0][columnIndex]);
			}

			for(var i = 1; i < InputData.length; i++){
				var row = InputData[i];
				var rowData = [row[0].replace(/"/g, '')];

				// 檢查 rowData 內容
				console.log(rowData);

				if(selectedRows.indexOf(rowData[0]) !== -1) {
					for(var j = 0; j < selectedColumnIndices.length; j++) {
						var columnIndex = selectedColumnIndices[j];
						//將結果添加到rowData
						rowData.push(parseFloat(row[columnIndex]));
					}
					data.addRow(rowData);
				}
			}

			var options = {
				animation: {//載入動畫
					startup: true,
					duration: 1000,
					easing: 'out',
				},
				series: {
					0: { color: '#FFDAB9' } // 設定長條顏色為 #FFDAB9
				},
				width: '100%',
				height: '100%',
				bar: { groupWidth: '80%' },
				legend: { position: 'none' },
				chartArea: { width: '80%', height: '80%' },//調整圖表區域大小
			};

			var chart = new google.visualization.ColumnChart(chartContainer);
			chart.draw(data, options);
		}
	}

	// google charts圓餅圖
	function renderPieChart() {
        piechartContainer.innerHTML = '';

        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(drawPieChart);

        function drawPieChart() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Name');

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
                        rowData.push(parseFloat(row[columnIndex]));
                    }
                    data.addRow(rowData);
                }
            }

            var options = {
                animation: {
                    startup: true,
                    duration: 1000,
                    easing: 'out',
                },
                width: '100%',
                height: '100%',
                legend: 'right',
                chartArea: { width: '80%', height: '80%' },
            };

            var chart = new google.visualization.PieChart(piechartContainer);
            chart.draw(data, options);
        }
    }

	// google charts長條圖
	function renderLineChart() {
        linechartContainer.innerHTML = '';
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(drawLineChart);

        function drawLineChart() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Name');

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
                        rowData.push(parseFloat(row[columnIndex]));
                    }
                    data.addRow(rowData);
                }
            }

            var options = {
                animation: {
                    startup: true,
                    duration: 1000,
                    easing: 'out',
                },
                width: '100%',
                height: '100%',
                legend: 'right',
                chartArea: {
                    width: '80%',
                    height: '80%',
                },
                curveType: 'function',
                hAxis: {
                    textStyle: {
                        fontSize: 7,
                    },
                },
                vAxis: {
                    textStyle: {
                        fontSize: 12,
                    },
                },
            };

            var chart = new google.visualization.LineChart(linechartContainer);
            chart.draw(data, options);
        }
    }

	// google charts區域圖
	function renderAreaChart() {
        areachartContainer.innerHTML = '';
        //var areachartContainer = document.getElementById('areachartContainer');


        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(drawAreaChart);

        function drawAreaChart() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Name');
            for (var i = 0; i < selectedColumnIndices.length; i++) {
                var columnIndex = selectedColumnIndices[i];
                data.addColumn('number', InputData[0][columnIndex]);
            }

            //var areaData = [];

            for (var i = 1; i < InputData.length; i++) {
                var row = InputData[i];
                var rowData = [row[0].replace(/"/g, '')];

                if (selectedRows.indexOf(rowData[0]) !== -1) {
                    for (var j = 0; j < selectedColumnIndices.length; j++) {
                        var columnIndex = selectedColumnIndices[j];
                        rowData.push(parseFloat(row[columnIndex]));
                    }
                    //areaData.push(rowData);
                    data.addRow(rowData);
                }
            }

            //data.addRows(areaData);

            var options = {
                animation: {
                    startup: true,
                    duration: 1000,
                    easing: 'out',
                },
                width: '100%',
                height: '100%',
                legend: 'right',
                chartArea: {
                    width: '80%',
                    height: '80%',
                },
                isStacked: true, // 設定為堆疊區域圖
                hAxis: {
                    textStyle: {
                        fontSize: 7
                    }
                },
                vAxis: {
                    textStyle: {
                        fontSize: 12
                    }
                }
            };

            var chart = new google.visualization.AreaChart(areachartContainer);
            chart.draw(data, options);
        }
    }

	// google charts長條圖
	function renderBarChart() {
        barchartContainer.innerHTML = '';
        //var barchartContainer = document.getElementById('barchartContainer');


        //Google Charts的BarChart套件
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(drawBarChart);

        function drawBarChart() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Name');
            for (var i = 0; i < selectedColumnIndices.length; i++) {
                var columnIndex = selectedColumnIndices[i];
                data.addColumn('number', InputData[0][columnIndex]);
            }

            //var barData = [];

            //獲取柱狀圖的數據
            for (var i = 1; i < InputData.length; i++) {
                var row = InputData[i];
                var rowData = [row[0].replace(/"/g, '')];
                // 檢查 rowData 內容
                console.log(rowData);

                if (selectedRows.indexOf(rowData[0]) !== -1) {
                    for (var j = 0; j < selectedColumnIndices.length; j++) {
                        var columnIndex = selectedColumnIndices[j];
                        rowData.push(parseFloat(row[columnIndex]));
                    }
                    //barData.push(rowData);
                    data.addRow(rowData);
                }
            }

            //data.addRows(barData);

            var options = {
                animation: {
                    startup: true,
                    duration: 1000,
                    easing: 'out',
                },
                width: '100%',
                height: '100%',
                legend: 'right',
                chartArea: {
                    width: '80%', //設定圖表區域寬度為整個圖表寬度的80%
                    height: '80%', //設定圖表區域高度為整個圖表高度的80%
                },
                bars: 'vertical', //顯示垂直柱狀圖
                hAxis: {
                    textStyle: {
                        fontSize: 7 //設定橫軸文字大小
                    }
                },
                vAxis: {
                    textStyle: {
                        fontSize: 12 //設定縱軸文字大小
                    }
                }
            };

            var chart = new google.visualization.BarChart(barchartContainer);
            chart.draw(data, options);
        }
    }

	// google charts組合圖
	function renderComboChart() {
        combochartContainer.innerHTML = '';
    
        // 加載 Google Charts corechart 套件
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(drawVisualization);
    
        function drawVisualization() {
            // 創建 DataTable
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Name');
    
            if (selectedColumnIndices.length > 0) {
                // 確保至少選擇了一列
                for (var i = 0; i < selectedColumnIndices.length; i++) {
                    var columnIndex = selectedColumnIndices[i];
                    data.addColumn('number', InputData[0][columnIndex]);
                }
    
                // 為 ComboChart 獲取數據
                var comboData = [];
    
                for (var i = 1; i < InputData.length; i++) {
                    var row = InputData[i];
                    var rowData = [row[0].replace(/"/g, '')];
    
                    if (selectedRows.indexOf(rowData[0]) !== -1) {
                        for (var j = 0; j < selectedColumnIndices.length; j++) {
                            var columnIndex = selectedColumnIndices[j];
                            rowData.push(parseFloat(row[columnIndex]));
                        }
                        comboData.push(rowData);
                    }
                }
    
                // 將數據添加到 DataTable
                data.addRows(comboData);
            }
    
            var options = {
                animation: {
                    startup: true,
                    duration: 1000,
                    easing: 'out',
                },
                width: '100%',
                height: '100%',
                legend: 'right',
                chartArea: {
                    width: '80%',
                    height: '80%',
                },
                curveType: 'function',
                hAxis: {
                    textStyle: {
                        fontSize: 7
                    }
                },
                vAxis: {
                    textStyle: {
                        fontSize: 12
                    }
                },
                
                seriesType: 'bars',
                series: { 5: { type: 'line' } }
            };
    
            var chart = new google.visualization.ComboChart(combochartContainer);
            chart.draw(data, options);
        }
    }

	// google charts堆疊階梯狀圖
	function renderStackChart() {
        stackchartContainer.innerHTML = '';

        // 加載Google Charts corechart套件
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(drawStackChart);

        function drawStackChart() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Name');

            for (var i = 0; i < selectedColumnIndices.length; i++) {
                var columnIndex = selectedColumnIndices[i];
                data.addColumn('number', InputData[0][columnIndex]);
            }

            // 為堆疊階梯狀圖獲取數據
            for (var i = 1; i < InputData.length; i++) {
                var row = InputData[i];
                var rowData = [row[0].replace(/"/g, '')];

                if (selectedRows.indexOf(rowData[0]) !== -1) {
                    for (var j = 0; j < selectedColumnIndices.length; j++) {
                        var columnIndex = selectedColumnIndices[j];
                        rowData.push(parseFloat(row[columnIndex]));
                    }

                    data.addRow(rowData); // 使用addRow將一行數據添加到data中
                }
            }

            var options = {
                animation: {
                    startup: true,
                    duration: 1000,
                    easing: 'out',
                },
                width: '100%',
                height: '100%',
                legend: 'right',
                chartArea: {
                    width: '80%',
                    height: '80%',
                },
                curveType: 'function',
                hAxis: {
                    textStyle: {
                        fontSize: 7,
                    },
                },
                vAxis: {
                    textStyle: {
                        fontSize: 12,
                    },
                }

            };

            var chart = new google.visualization.SteppedAreaChart(stackchartContainer);
            chart.draw(data, options);
        }
    }
