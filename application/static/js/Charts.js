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
    var allChartsContainer = document.getElementById('allChartsContainer'); // 放置圖表區塊
    var returnBtn = document.getElementById('returnBtn'); // 返回按鈕
    
	var piechartContainer = document.getElementById('piechartContainer');
    var chartContainer = document.getElementById('chartContainer');
    var pieholeContainer = document.getElementById('pieholeContainer');
    var linechartContainer = document.getElementById('linechartContainer');
    var areachartContainer = document.getElementById('areachartContainer');
    var barchartContainer = document.getElementById('barchartContainer');
    var histogramContainer = document.getElementById('histogramContainer');
    var scatterchartContainer = document.getElementById('scatterchartContainer');
    var stackchartContainer = document.getElementById('stackchartContainer');
    var bubblechartContainer = document.getElementById('bubblechartContainer');

	var selectColumnDiv = document.getElementById('selectColumnDiv') // 欄位選擇區塊
	var selectColumnBtn = document.getElementById('selectColumnBtn'); // 用於顯示欄位選擇區塊
	var selectColumnData = document.getElementById('selectColumnData'); // 選擇行區塊
	var selectTownData = document.getElementById('selectTownData'); // 選擇鄉鎮區塊
	var selfFileBackDrop = document.getElementById('selfFileBackDrop'); // 自製表單背景
	var selfFile = document.getElementById('selfFile'); // 自製表單
    var inputRowDiv = document.getElementById('inputRowDiv'); // 自製表單選擇列區塊
    var inputColDiv = document.getElementById('inputColDiv'); // 自製表單選擇欄區塊
	var submitButtonForselfFile = document.getElementById('submitButtonForselfFile'); // 自製表單上傳鈕
	var clearButtonForselfFile = document.getElementById('clearButtonForselfFile'); // 自製表單清除鈕
	var closeButtonForselfFile = document.getElementById('closeButtonForselfFile'); // 自製表單關閉鈕
    var addButton_Row = document.getElementById('addButton_Row'); // 自製表單新增列按鈕
    var addButton_Col = document.getElementById('addButton_Col'); // 自製表單新增欄按鈕
    var returnButtonForselfFile = document.getElementById('returnButtonForselfFile'); // 自製表單返回按鈕
    var minusAllBtn = document.getElementById('minusAllBtn'); // 自製表單刪除按鈕
    var closePreview = document.getElementById('closePreview'); // 關閉預覽框按鈕
    var selfFileDesBtn = document.getElementById('selfFileDesBtn'); // 自製表單說明按鈕
    
	submitButtonForselfFile.addEventListener('click',handleSelfFile); // 上傳鈕
	clearButtonForselfFile.addEventListener('click',clearSelfFile); // 清除鈕
	closeButtonForselfFile.addEventListener('click',closeSelfFile); // 清除鈕
    addButton_Row.addEventListener('click',addRowForSelfFile); // 新增列鈕
    addButton_Col.addEventListener('click',addColForSelfFile); // 新增欄鈕
    returnButtonForselfFile.addEventListener('click',returnMinus); // 返回鈕
    minusAllBtn.addEventListener('click',minusAll); // 刪除按鈕
    

    // 圖表返回鈕
    returnBtn.addEventListener('click',function(){
        townArea(0);
        changeBackGround(0);
        Outlying_islands.style.visibility = 'visible';

        sentFile.style.visibility = 'visible'; // 隱藏按鈕
        sentAPI.style.visibility = 'visible'; // 隱藏按鈕
        sentSelfFile.style.visibility = 'visible'; // 隱藏按鈕
        appearDiv.replaceChildren();
        allChartsContainer.replaceChildren();
        blankDiv.replaceChildren();
        
        var statSpan = stat.getElementsByTagName('span'); // 獲取所有摘要統計的span
        originColor(); // 還原顏色

        for(var i = 0; i < statSpan.length; i++){ // 清除摘要統計
            statSpan[i].replaceChildren();
        }

        colorBtn.style.visibility = 'hidden'; // 選擇顏色按鈕隱藏
        colorDiv.replaceChildren(); // 清除6顏色按鈕
        colorDiv.style.backgroundColor = 'transparent';

        document.getElementById('chooseMethod').style.visibility = 'visible'; // 顯示按鈕區塊
        returnBtn.style.visibility = 'hidden'; // 隱藏返回鈕
        sumFileBtn.style.visibility = 'hidden'; // 隱藏加總鈕
        avgFileBtn.style.visibility = 'hidden'; // 隱藏平均鈕
        statBtn.style.visibility = 'hidden'; // 隱藏摘要統計鈕
        blankDiv.style.visibility = 'hidden'; // 隱藏空白區塊
        fileNameDiv.style.visibility = 'hidden'; // 隱藏檔案名稱框
        columnNameDiv.style.visibility = 'hidden'; // 隱藏欄位名稱框
        forGroupBtn.style.visibility = 'hidden'; // 隱藏單位分組按鈕

        selectedColumnIndices = [];
        selectedRows = [];
        InputData = [];
        blankArray = [];
        skipAlreadyArr = []

        curNumForPaging = 1;
        curPos = 0;

        selectColumnData.replaceChildren();
        selectTownData.replaceChildren();

        //取消選擇圖的複選框
        var chartTypeCheckbox = document.querySelectorAll('#chartTypeSelect input[type="checkbox"]');
        chartTypeCheckbox.forEach(function (checkbox) {
            checkbox.checked = false;
        });

        var chartTypeCheckbox1 = document.querySelectorAll('.checkbox-container input[type="checkbox"]');
        chartTypeCheckbox1.forEach(function (checkbox) {
            checkbox.checked = false;
        });

        //清除選擇圖表類型數量
        selectedChartCount = 0;
        townArray = []; // 清空鄉鎮陣列
        updateChartTypeStyle();
    });

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
		// inputRow.value = ""; // 清除列數量
		// inputCol.value = ""; // 清除欄數量
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
        opendetailBox();

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
        addButton_Row.style.visibility = 'hidden'; // 隱藏新增列按鈕
        addButton_Col.style.visibility = 'hidden'; // 隱藏新增欄按鈕

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
        allChartsContainer.replaceChildren();
        allChartsContainer.style.backgroundColor = 'transparent'
        returnBtn.style.visibility = 'visible'; // 顯示返回鈕
        sumFileBtn.style.visibility = 'visible'; // 顯示加總鈕
        avgFileBtn.style.visibility = 'visible'; // 顯示平均鈕
        statBtn.style.visibility = 'visible'; // 顯示摘要統計鈕

        isSelfFile = true;
		e.preventDefault(); // 防止上傳鍵自動點擊
		selfFileBackDrop.style.display = 'none'; // 隱藏自製表單

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

        var FileName = CityName[currentMap]; //保存上傳的原始檔案名稱
        uploadedFileName = FileName.replace(/\.[^/.]+$/, '');//去除副檔名部分

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
        fileNameDiv.style.visibility = 'visible'; // 顯示檔案名稱區塊
        forGroupBtn.style.visibility = 'visible'; // 顯示分組單位按鈕
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
        sentFile.style.visibility = 'hidden'; // 隱藏按鈕
        sentAPI.style.visibility = 'hidden'; // 隱藏按鈕
        sentSelfFile.style.visibility = 'hidden'; // 隱藏按鈕
        returnBtn.style.visibility = 'visible'; // 隱藏返回鈕
		appearDiv.replaceChildren(); // 清除原本的所有元素

        var text = document.createElement('input'); // 生成文字輸入框
		text.type = 'text';
		text.id = 'textAPI';
		text.placeholder = '輸入API';
		text.setAttribute('value','');
		
		var submit = document.createElement('input'); // 生成上傳鈕
		submit.type = 'submit';
		submit.id = 'submitAPI';
		submit.value = "";

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
        suBoxForButtons.style.visibility = 'hidden'; // 懸浮框隱藏
        returnBtn.style.visibility = 'visible'; // 顯示返回鈕
        sumFileBtn.style.visibility = 'visible'; // 顯示加總鈕
        avgFileBtn.style.visibility = 'visible'; // 顯示平均鈕
        statBtn.style.visibility = 'visible'; // 顯示摘要統計鈕
        
        var textAPI = document.getElementById('textAPI').value;
        appearDiv.replaceChildren();
        
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

            var FileName = 'API檔案'; // 保存上傳的原始檔案名稱
            uploadedFileName = FileName.replace(/\.[^/.]+$/, ''); // 去除副檔名部分
			
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
        sentFile.style.visibility = 'hidden'; // 隱藏按鈕
        sentAPI.style.visibility = 'hidden'; // 隱藏按鈕
        sentSelfFile.style.visibility = 'hidden'; // 隱藏按鈕
        returnBtn.style.visibility = 'visible'; // 隱藏返回鈕
		appearDiv.replaceChildren(); // 清除原本的所有元素
		allChartsContainer.replaceChildren(); // 清除原本的所有元素

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
	
    var uploadedFileName = "";
    recordFileName = '';
	// 表單提交
	function handleFormSubmit(event){
        document.getElementById('chooseMethod').style.visibility = 'hidden'; // 隱藏按鈕區塊
        suBoxForButtons.style.visibility = 'hidden'; // 懸浮框隱藏
        returnBtn.style.visibility = 'visible'; // 顯示返回鈕
		csvForm.style.visibility = 'hidden'; // 隱藏檔案上傳區
        sumFileBtn.style.visibility = 'visible'; // 顯示加總鈕
        avgFileBtn.style.visibility = 'visible'; // 顯示平均鈕
        statBtn.style.visibility = 'visible'; // 顯示摘要統計鈕

		event.preventDefault(); // 停止事件的默認動作
		var fileName = csvFile.files[0]; // 獲取選擇的檔案
		var reader = new FileReader(); // 讀取檔案
		reader.onload = handleFileLoad;
		reader.readAsText(fileName); // 將文件讀取爲文本

        fileNameDiv.textContent = fileName['name']; // 顯示檔案名稱
        recordFileName = fileNameDiv.textContent;

        //標題的部分
        var FileNameforcharts = fileName.name;//保存上傳的原始檔案名稱
        uploadedFileName = FileNameforcharts.replace(/\.[^/.]+$/, '');//去除副檔名部分
    }

	// 讀取csv
	var InputData = []; // 用於儲存解析後的CSV數據
	function handleFileLoad(event) {
		var csvData = event.target.result;

		InputData = parseCSV(csvData); // 回傳所有資料陣列

        //renderMap(parseCSV(csvData));

		if(judgeBlankSpace(InputData)){
			skipBlank(InputData); // 刪掉空白較多的行
			showError(InputData); // 顯示空白區域
			return;
		}

		InputData = analyze(InputData); // 資料清洗(在 analyzeData.js)

        console.log(InputData)
		
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

    var selectedChartCount = 0; //選擇的圖表類型數量
    var maxSelectedChartCount = 4; //設置最大允許的圖表類型數量

    //選擇圖形，複選框的選中狀態變化時，將用handleChartTypeChange函式
    var chartTypeCheckbox = document.querySelectorAll('#chartTypeSelect input[type="checkbox"]');
    chartTypeCheckbox.forEach(function (checkbox) {
        checkbox.addEventListener('change', handleChartTypeChange);
    });
    //是否已選擇的圖表類型數量
    function handleChartTypeChange(event) {
        var checkbox = event.target;

        if (checkbox.checked) {
            //如果已經超過最大值，則取消選中該複選框
            if (selectedChartCount >= maxSelectedChartCount) {
                checkbox.checked = false;
                //否則，增加selectedChartCount的計數  
            } else {
                selectedChartCount++;
            }
            //如果複選框的選中狀態變為未選中，則selectedChartCount的計數減少
        } else {
            selectedChartCount--;
        }

        updateChartTypeStyle();
    }

    function updateChartTypeStyle() {
        var chartTypeCheckbox = document.querySelectorAll('#chartTypeSelect input[type="checkbox"]');

        chartTypeCheckbox.forEach(function (checkbox) {

            //已選擇的圖表數量還沒達到最大允許的數量
            if(checkbox.checked || (selectedChartCount < maxSelectedChartCount)) {
                //就是可用的，且文字顏色為黑色
                checkbox.disabled = false;
                checkbox.parentNode.style.color = 'aqua';
            }else{
                //否則不可用，且文字顏色為灰色
                checkbox.disabled = true;
                checkbox.parentNode.style.color = 'black';
            }
        });

    }

	// 欄位名稱複選區塊
	function renderColumnSelect(){
		//清空
        selectColumnData.innerHTML = '';

        var columnNames = InputData[0];//第一行為資料名稱

        // //創建一個全選
        // var selectAllCheckbox = document.createElement('input');
        // selectAllCheckbox.type = 'checkbox';
        // selectAllCheckbox.id = 'selectAllColumns';

        // //處理全選，更新所有複選框的狀態
        // selectAllCheckbox.addEventListener('change', function (event) {
        //     var isChecked = selectAllCheckbox.checked;
        //     var checkboxes = document.querySelectorAll('#selectColumnData input[type="checkbox"]');
        //     checkboxes.forEach(function (checkbox) {
        //         checkbox.checked = isChecked;
        //     });
        //     updateSelectedColumns();
        //     updateChartDisplay();
        // });
        // //創建全選
        // var selectAllLabel = document.createElement('label');
        // selectAllLabel.appendChild(selectAllCheckbox);
        // selectAllLabel.appendChild(document.createTextNode('全選'));
        // //將全選放在selectColumnData，全選就會顯示在最上面
        // selectColumnData.appendChild(selectAllLabel);
        //創建每一列複選框
        for (var i = 1; i < columnNames.length; i++) {
            //複選框
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = i;
            //添加多個事件監聽器，每個處理不同的事件
            checkbox.addEventListener('change', function (event) {
                handleCheckboxChange(event);
                handleCheckboxChange2(event);
                updateChartDisplay();

            });

            showPieChart.addEventListener('change', handleCheckboxChange);
            showPieholeChart.addEventListener('change', handleCheckboxChange);
            showColumnChart.addEventListener('change', handleCheckboxChange);
            showLineChart.addEventListener('change', handleCheckboxChange);
            showAreaChart.addEventListener('change', handleCheckboxChange);
            showBarChart.addEventListener('change', handleCheckboxChange);
            showScatterChart.addEventListener('change', handleCheckboxChange);
            showStackChart.addEventListener('change', handleCheckboxChange);
            showHistogramChart.addEventListener('change', handleCheckboxChange);
            showBubbleChart.addEventListener('change', handleCheckboxChange);

            //創建一個標籤，將複選框和資料名稱加到標籤中
            var label = document.createElement('label');
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(columnNames[i]));
            //所有的複選框和資料名稱都會顯示在selectColumnData裡
            selectColumnData.appendChild(label);
        }
    }

    //選取列的全選框
    function updateSelectedColumns() {
        //清空
        selectedColumnIndices = [];
        //選取所有具有input類型的checkbox
        var checkboxes = document.querySelectorAll('#selectColumnData input[type="checkbox"]');
        //檢查這些複選有沒有被選
        checkboxes.forEach(function (checkbox) {
            //如果有就放進selectedColumnIndices
            if (checkbox.checked) {
                selectedColumnIndices.push(parseInt(checkbox.value));
            }
        });
    }

	
	// 鄉鎮名稱複選區塊
    function renderRowSelect(){ 
        //清空
        selectTownData.innerHTML = ''
        selectTownData = document.getElementById('selectTownData'); // 獲取包含選擇元素的容器
        var rowData = InputData.map(function (row) {
            return row[0]; //提取二維數據的第一縱軸資料
        });

        //創建一個全選的核取方塊
        var selectAllCheckbox = document.createElement('input');
        selectAllCheckbox.type = 'checkbox';
        selectAllCheckbox.id = 'selectAllRows';

        //處理全選，更新所有複選框的狀態
        selectAllCheckbox.addEventListener('change', function (event) {
            var isChecked = selectAllCheckbox.checked;
            var checkboxes = document.querySelectorAll('#selectTownData input[type="checkbox"]');
            checkboxes.forEach(function (checkbox) {
                checkbox.checked = isChecked;
            });
            updateSelectedRows();
            updateChartDisplay();
        });

        //創建全選
        var selectAllLabel = document.createElement('label');
        selectAllLabel.appendChild(selectAllCheckbox);
        selectAllLabel.appendChild(document.createTextNode('全選'));
        //將全選放在selectTownData，全選就會顯示在最上面
        selectTownData.appendChild(selectAllLabel);

        //創建每一行複選框
        for (var i = 1; i < rowData.length; i++) {
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = rowData[i];
            checkbox.id = 'checkbox' + i;

            // 添加多個事件監聽器，每個處理不同的事件
            checkbox.addEventListener('change', function (event) {
                handleCheckboxChange2(event);
                updateSelectedRows();
                updateChartDisplay();
            });
            showPieChart.addEventListener('change', handleCheckboxChange2);
            showPieholeChart.addEventListener('change', handleCheckboxChange2);
            showColumnChart.addEventListener('change', handleCheckboxChange2);
            showLineChart.addEventListener('change', handleCheckboxChange2);
            showAreaChart.addEventListener('change', handleCheckboxChange2);
            showBarChart.addEventListener('change', handleCheckboxChange2);
            showScatterChart.addEventListener('change', handleCheckboxChange2);
            showStackChart.addEventListener('change', handleCheckboxChange2);
            showHistogramChart.addEventListener('change', handleCheckboxChange2);
            showBubbleChart.addEventListener('change', handleCheckboxChange2);

            //創建一個標籤，將複選框和資料名稱加到標籤中
            var label = document.createElement('label');
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(rowData[i]));
            //所有的複選框和資料名稱都會顯示在selectTownData裡
            selectTownData.appendChild(label);
        }
    }

    //選取行的全選框
    function updateSelectedRows() {
        //清空
        selectedRows = [];
        //選取所有具有input類型的checkbox
        var checkboxes = document.querySelectorAll('#selectTownData input[type="checkbox"]');
        //檢查這些複選有沒有被選
        checkboxes.forEach(function (checkbox) {
            //如果有就放進selectedRows
            if (checkbox.checked) {
                selectedRows.push(checkbox.value);
            }
        });
        console.log(selectedRows)
    }

	var selectedColumnIndices = []; // 記錄所選擇的欄位名稱複選框
	// 選擇欄位複選盒狀態改變
	function handleCheckboxChange(event) {
        //取得有沒有點選checkbox
        var checkbox = event.target;

        //檢查是否是圖表選框
        if (!(checkbox === document.getElementById('showColumnChart') ||
            checkbox === document.getElementById('showPieChart') ||
            checkbox === document.getElementById('showPieholeChart') ||
            checkbox === document.getElementById('showLineChart') ||
            checkbox === document.getElementById('showAreaChart') ||
            checkbox === document.getElementById('showBarChart') ||
            checkbox === document.getElementById('showScatterChart') ||
            checkbox === document.getElementById('showStackChart') ||
            checkbox === document.getElementById('showHistogramChart') ||
            checkbox === document.getElementById('showBubbleChart'))) {
            //如果是選擇圖形的複選框，則直接更新圖表的顯示狀態
            var columnIndex = parseInt(checkbox.value);
            //如果checkbox是被選中
            if (checkbox.checked) {
                //將資料名稱放到陣列中
                selectedColumnIndices.push(columnIndex);
            } else {
                //如果checkbox被取消
                //在陣列中找到相應的資料名稱，並將其從陣列中刪除
                var index = selectedColumnIndices.indexOf(columnIndex);
                if (index > -1) {
                    selectedColumnIndices.splice(index, 1);
                }
            }
        }
        console.log(selectedColumnIndices)
        //資料更新圖表的顯示
        updateChartDisplay();
    }

    var selectedRows = []; // 記錄所選擇的鄉鎮名稱複選框
    // 選擇鄉鎮複選盒狀態改變
    function handleCheckboxChange2(event) {
        //取得有沒有點選checkbox
        var checkbox = event.target;
        //讀取資料名稱
        var columnName = checkbox.value;

        //如果checkbox是被選中
        if (checkbox.checked) {
            //將資料名稱放到陣列中
            selectedRows.push(columnName);
        } else {
            //如果checkbox被取消
            //在陣列中找到相應的資料名稱，並將其從陣列中刪除
            var index = selectedRows.indexOf(columnName);
            if (index > -1) {
                selectedRows.splice(index, 1);
            }
        }
        //資料更新圖表的顯示
        console.log(selectedRows)
        updateChartDisplay();
    }

    var checkWhichCharts = []; // 存取被點擊的圖表
	// 顯示或隱藏各圖表
	function updateChartDisplay(){
        checkWhichCharts = []; // 重製陣列

		var showColumnChart = document.getElementById('showColumnChart').checked;
        var showPieChart = document.getElementById('showPieChart').checked;
        var showPieholeChart = document.getElementById('showPieholeChart').checked;
        var showLineChart = document.getElementById('showLineChart').checked;
        var showAreaChart = document.getElementById('showAreaChart').checked;
        var showBarChart = document.getElementById('showBarChart').checked;
        var showScatterChart = document.getElementById('showScatterChart').checked;
        var showStackChart = document.getElementById('showStackChart').checked;
        var showHistogramChart = document.getElementById('showHistogramChart').checked;
        var showBubbleChart = document.getElementById('showBubbleChart').checked;

        chartContainer.style.display = showColumnChart ? 'block' : 'none';
        piechartContainer.style.display = showPieChart ? 'block' : 'none';
        pieholeContainer.style.display = showPieholeChart ? 'block' : 'none';
        linechartContainer.style.display = showLineChart ? 'block' : 'none';
        areachartContainer.style.display = showAreaChart ? 'block' : 'none';
        barchartContainer.style.display = showBarChart ? 'block' : 'none';
        scatterchartContainer.style.display = showScatterChart ? 'block' : 'none';
        stackchartContainer.style.display = showStackChart ? 'block' : 'none';
        histogramContainer.style.display = showHistogramChart ? 'block' : 'none';
        bubblechartContainer.style.display = showBubbleChart ? 'block' : 'none';

        var chartdel = chartTypeSelect.getElementsByTagName('input');
        // 顯示對應的圖表
        if(showColumnChart){
            checkWhichCharts.push('chartContainer')
        }
        // else{
        //     for(var i = 0; i < chartdel.length; i++){
        //         var index = checkWhichCharts.indexOf(chartdel[i].value);
        //         if (index > -1) {
        //             checkWhichCharts.splice(index, 1);
        //         }
        //     }
        // }
        if(showPieChart){
            checkWhichCharts.push('piechartContainer')
        }
        // else{
        //     for(var i = 0; i < chartdel.length; i++){
        //         var index = checkWhichCharts.indexOf(chartdel[i].value);
        //         if (index > -1) {
        //             checkWhichCharts.splice(index, 1);
        //         }
        //     }
        // }
        if(showLineChart){
            checkWhichCharts.push('linechartContainer')
        }
        // else{
        //     for(var i = 0; i < chartdel.length; i++){
        //         var index = checkWhichCharts.indexOf(chartdel[i].value);
        //         if (index > -1) {
        //             checkWhichCharts.splice(index, 1);
        //         }
        //     }
        // }
        if(showAreaChart){
            checkWhichCharts.push('areachartContainer')
        }
        // else{
        //     for(var i = 0; i < chartdel.length; i++){
        //         var index = checkWhichCharts.indexOf(chartdel[i].value);
        //         if (index > -1) {
        //             checkWhichCharts.splice(index, 1);
        //         }
        //     }
        // }
        if(showBarChart){
            checkWhichCharts.push('barchartContainer')
        }
        // else{
        //     for(var i = 0; i < chartdel.length; i++){
        //         var index = checkWhichCharts.indexOf(chartdel[i].value);
        //         if (index > -1) {
        //             checkWhichCharts.splice(index, 1);
        //         }
        //     }
        // }
        if(showBubbleChart){
            checkWhichCharts.push('bubblechartContainer')
        }
        // else{
        //     for(var i = 0; i < chartdel.length; i++){
        //         var index = checkWhichCharts.indexOf(chartdel[i].value);
        //         if (index > -1) {
        //             checkWhichCharts.splice(index, 1);
        //         }
        //     }
        // }
        if(showStackChart){
            checkWhichCharts.push('stackchartContainer')
        }
        // else{
        //     for(var i = 0; i < chartdel.length; i++){
        //         var index = checkWhichCharts.indexOf(chartdel[i].value);
        //         if (index > -1) {
        //             checkWhichCharts.splice(index, 1);
        //         }
        //     }
        // }
        if(showPieholeChart){
            checkWhichCharts.push('pieholeContainer')
        }
        // else{
        //     for(var i = 0; i < chartdel.length; i++){
        //         var index = checkWhichCharts.indexOf(chartdel[i].value);
        //         if (index > -1) {
        //             checkWhichCharts.splice(index, 1);
        //         }
        //     }
        // }
        if(showScatterChart){
            checkWhichCharts.push('scatterchartContainer')
        }
        // else{
        //     for(var i = 0; i < chartdel.length; i++){
        //         var index = checkWhichCharts.indexOf(chartdel[i].value);
        //         if (index > -1) {
        //             checkWhichCharts.splice(index, 1);
        //         }
        //     }
        // }
        if(showHistogramChart){
            checkWhichCharts.push('histogramContainer')
        }
        // else{
        //     for(var i = 0; i < chartdel.length; i++){
        //         var index = checkWhichCharts.indexOf(chartdel[i].value);
        //         if (index > -1) {
        //             checkWhichCharts.splice(index, 1);
        //         }
        //     }
        // }

        chartPosition(); // 設定圖表位置

        if (showColumnChart) {
            renderChart();
        }
        if (showPieChart) {
            renderPieChart();
        }
        if (showPieholeChart) {
            renderPieholeChart();
        }
        if (showLineChart) {
            renderLineChart();
        }
        if (showAreaChart) {
            renderAreaChart();
        }
        if (showBarChart) {
            renderBarChart();
        }
        if (showScatterChart) {
            renderScatterChart();
        }
        if (showStackChart) {
            renderStackChart();
        }
        if (showHistogramChart) {
            renderHistogramChart();
        }
        if (showBubbleChart) {
            renderBubbleChart();
        }
        console.log(selectedRows)

    }

    // 顯示與隱藏懸浮框
    function showSuspendBoxForPreview(previewBtn){
        previewBtn.addEventListener('mousemove',createButtonSuspendBox); // 滑鼠進入按鈕

        previewBtn.addEventListener('mouseout',function(){  // 滑鼠離開按鈕
            suBoxForButtons.style.visibility = 'hidden';
        });
    }

    // 設定圖表位置
    function chartPosition(){
        console.log(checkWhichCharts)
        if(checkWhichCharts.length == 0){ // 一張圖都沒有
            allChartsContainer.replaceChildren();
        }
        else if(checkWhichCharts.length == 1){ // 一張圖
            allChartsContainer.replaceChildren();

            var previewBtn = document.createElement('button'); // 建立預覽按鈕
            previewBtn.className = 'previewBtn';
            previewBtn.id = 'previewBtn_' + checkWhichCharts[0];
            
            var oneChart = document.createElement('div'); // 建立新區塊(放一張圖)
            oneChart.id = checkWhichCharts[0];
            oneChart.className = 'oneChart';

            allChartsContainer.appendChild(previewBtn);
            allChartsContainer.appendChild(oneChart);

            previewBtn.addEventListener('click',showPreviewBox); // 顯示預覽框
            showSuspendBoxForPreview(previewBtn); // 顯示按鈕懸浮框
            
        }else if(checkWhichCharts.length == 2){ // 兩張圖
            allChartsContainer.replaceChildren();

            var twoChart = document.createElement('div'); // 建立新區塊(放兩張圖)
            twoChart.className = 'twoChart';

            for(var i = 0; i < 2; i++){
                var previewBtn = document.createElement('button'); // 建立預覽按鈕
                previewBtn.className = 'previewBtn_two';

                if(i == 0){ // 賦予id
                    previewBtn.id = 'previewBtn_' + checkWhichCharts[0];
                }else{
                    previewBtn.id = 'previewBtn_' + checkWhichCharts[1];
                }
                twoChart.appendChild(previewBtn);
                previewBtn.addEventListener('click',showPreviewBox); // 顯示預覽框
                showSuspendBoxForPreview(previewBtn); // 顯示按鈕懸浮框
            }

            var firstChart = document.createElement('div'); // 放第一張圖
            firstChart.className = 'two_firstChart';
            firstChart.id = checkWhichCharts[0];

            var secondChart = document.createElement('div'); // 放第二張圖
            secondChart.className = 'two_secondChart';
            secondChart.id = checkWhichCharts[1];
            
            twoChart.insertBefore(firstChart, twoChart.childNodes[1])
            twoChart.insertBefore(secondChart, twoChart.childNodes[3])
            allChartsContainer.appendChild(twoChart);
        }else if(checkWhichCharts.length == 3){ // 三張圖
            allChartsContainer.replaceChildren();

            var threeChart = document.createElement('div'); // 建立新區塊(放三張圖)
            threeChart.className = 'threeChart';

            var btnDiv = document.createElement('div'); // 建立新區塊(放按鈕)
            btnDiv.style.height = 30 + 'px';
            btnDiv.style.width = 640 + 'px';

            for(var i = 0; i < 3; i++){
                var previewBtn = document.createElement('button'); // 建立預覽按鈕
                previewBtn.className = 'previewBtn_three';

                if(i == 0){ // 賦予id
                    previewBtn.id = 'previewBtn_' + checkWhichCharts[0];
                    threeChart.appendChild(previewBtn);
                }else if(i == 1){
                    previewBtn.id = 'previewBtn_' + checkWhichCharts[1];
                    previewBtn.className = 'three_secBtn';
                    btnDiv.appendChild(previewBtn);
                }else{
                    previewBtn.id = 'previewBtn_' + checkWhichCharts[2];
                    previewBtn.className = 'three_thiBtn';
                    btnDiv.appendChild(previewBtn);
                }
                
                previewBtn.addEventListener('click',showPreviewBox); // 顯示預覽框
                showSuspendBoxForPreview(previewBtn); // 顯示按鈕懸浮框
            }
            threeChart.appendChild(btnDiv);

            var upDiv = document.createElement('div'); // 上面區塊
            upDiv.className = 'three_upDiv';

            var downDiv = document.createElement('div'); // 下面區塊
            downDiv.className = 'three_downDiv';

            var firstChart = document.createElement('div'); // 放第一張圖
            firstChart.className = 'three_firstChart';
            firstChart.id = checkWhichCharts[0];

            var secondChart = document.createElement('div'); // 放第一張圖
            secondChart.className = 'three_secondChart';
            secondChart.id = checkWhichCharts[1];

            var thirdChart = document.createElement('div'); // 放第一張圖
            thirdChart.className = 'three_thirdChart';
            thirdChart.id = checkWhichCharts[2];

            upDiv.appendChild(firstChart);
            downDiv.appendChild(secondChart);
            downDiv.appendChild(thirdChart);
            threeChart.insertBefore(upDiv, threeChart.childNodes[1]);
            threeChart.insertBefore(downDiv, threeChart.childNodes[3]);
            allChartsContainer.appendChild(threeChart);
        }else if(checkWhichCharts.length == 4){ // 四張圖
            allChartsContainer.replaceChildren();

            var fourChart = document.createElement('div'); // 建立新區塊(放四張圖)
            fourChart.className = 'fourChart';

            for(var i = 0; i < 2; i++){
                var btnDiv = document.createElement('div'); // 建立新區塊(放按鈕)
                btnDiv.style.height = 30 + 'px';
                btnDiv.style.width = 640 + 'px';
                for(var j = 0; j < 4; j++){
                    var previewBtn = document.createElement('button'); // 建立預覽按鈕
                    previewBtn.className = 'previewBtn_four';
    
                    if(i == 0 & j == 0){ // 賦予id
                        previewBtn.id = 'previewBtn_' + checkWhichCharts[0];
                        previewBtn.className = 'four_firBtn';
                        btnDiv.appendChild(previewBtn);
                    }else if(i == 0 & j == 1){
                        previewBtn.id = 'previewBtn_' + checkWhichCharts[1];
                        previewBtn.className = 'four_secBtn';
                        btnDiv.appendChild(previewBtn);
                    }else if(i == 1 & j == 2){
                        previewBtn.id = 'previewBtn_' + checkWhichCharts[2];
                        previewBtn.className = 'four_thiBtn';
                        btnDiv.appendChild(previewBtn);
                    }else if(i == 1 & j == 3){
                        previewBtn.id = 'previewBtn_' + checkWhichCharts[3];
                        previewBtn.className = 'four_fouBtn';
                        btnDiv.appendChild(previewBtn);
                    }
                    
                    previewBtn.addEventListener('click',showPreviewBox); // 顯示預覽框
                    showSuspendBoxForPreview(previewBtn); // 顯示按鈕懸浮框
                }
                fourChart.appendChild(btnDiv)
            }

            var upDiv = document.createElement('div'); // 上面區塊
            upDiv.className = 'four_upDiv';

            var downDiv = document.createElement('div'); // 下面區塊
            downDiv.className = 'four_downDiv';

            var firstChart = document.createElement('div'); // 放第一張圖
            firstChart.className = 'four_firstChart';
            firstChart.id = checkWhichCharts[0];

            var secondChart = document.createElement('div'); // 放第一張圖
            secondChart.className = 'four_secondChart';
            secondChart.id = checkWhichCharts[1];

            var thirdChart = document.createElement('div'); // 放第一張圖
            thirdChart.className = 'four_thirdChart';
            thirdChart.id = checkWhichCharts[2];

            var fourthChart = document.createElement('div'); // 放第一張圖
            fourthChart.className = 'four_fourthChart';
            fourthChart.id = checkWhichCharts[3];


            upDiv.appendChild(firstChart);
            upDiv.appendChild(secondChart);
            downDiv.appendChild(thirdChart);
            downDiv.appendChild(fourthChart);
            fourChart.insertBefore(upDiv, fourChart.childNodes[1]);
            fourChart.insertBefore(downDiv, fourChart.childNodes[3]);
            allChartsContainer.appendChild(fourChart);
        }
    }

    var previewBool = false; // 畔對是否點擊預覽按鈕
    var previewBoxBackDrop = document.getElementById('previewBoxBackDrop'); // 預覽背景
    var previewBox = document.getElementById('previewBox'); // 預覽框
    // 顯示預覽框
    function showPreviewBox(e){
        previewBoxBackDrop.style.visibility = 'visible'; // 顯示預覽背景
        previewBox.replaceChildren(); // 清除預覽框
        previewBool = true; // 確定點擊預覽按鈕

        if(e.target.id == 'previewBtn_' + 'chartContainer'){ // 點擊柱狀圖的預覽
            renderChart();
        }else if(e.target.id == 'previewBtn_' + 'piechartContainer'){ // 點擊圓餅圖的預覽
            renderPieChart();
        }else if(e.target.id == 'previewBtn_' + 'linechartContainer'){ // 點擊折線圖的預覽
            renderLineChart();
        }else if(e.target.id == 'previewBtn_' + 'areachartContainer'){ // 點擊區域圖的預覽
            renderAreaChart();
        }else if(e.target.id == 'previewBtn_' + 'barchartContainer'){ // 點擊長條圖的預覽
            renderBarChart();
        }else if(e.target.id == 'previewBtn_' + 'bubblechartContainer'){ // 點擊組合圖的預覽
            renderBubbleChart();
        }else if(e.target.id == 'previewBtn_' + 'stackchartContainer'){ // 點擊推疊梯狀圖的預覽
            renderStackChart();
        }else if(e.target.id == 'previewBtn_' + 'pieholeContainer'){ // 點擊推疊梯狀圖的預覽
            renderPieholeChart();
        }else if(e.target.id == 'previewBtn_' + 'histogramContainer'){ // 點擊推疊梯狀圖的預覽
            renderHistogramChart();
        }else if(e.target.id == 'previewBtn_' + 'scatterchartContainer'){ // 點擊散佈圖的預覽
            renderScatterChart();
        }
        
    }

    // 關閉預覽框
    closePreview.addEventListener('click',function(){
        previewBoxBackDrop.style.visibility = 'hidden';
    })

    //google chart圓餅圖
    function renderPieChart() {
        //清空
        piechartContainer.innerHTML = '';

        //google charts圖表庫
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(drawPieChart);


        function drawPieChart() {
            //新的Google圖表資料表
            var data = new google.visualization.DataTable();
            //添加資料表的列
            data.addColumn('string', 'Name');

            //加新的數字列，其中number表示該列數據的類型，InputData[0][columnIndex]是列的標題
            for (var i = 0; i < selectedColumnIndices.length; i++) {
                var columnIndex = selectedColumnIndices[i];
                data.addColumn('number', InputData[0][columnIndex]);
            }

            //跳過資料標題
            for (var i = 1; i < InputData.length; i++) {
                //清除可能存在的雙引號
                var row = InputData[i];
                var rowData = [row[0].replace(/"/g, '')];
                //是否包含在已選擇的行中
                if (selectedRows.indexOf(rowData[0]) !== -1) {
                    //對每個已選擇的列，從原始資料中獲取對應的數值
                    for (var j = 0; j < selectedColumnIndices.length; j++) {
                        var columnIndex = selectedColumnIndices[j];
                        //數值轉換為浮點數，加到rowData陣列中，以建立圓餅圖的資料行
                        rowData.push(parseFloat(row[columnIndex]));
                    }
                    //陣列添加到Google圖表的資料表中
                    data.addRow(rowData);
                }
            }

            var options = {

                title: uploadedFileName, //標題文字
                is3D: true,
                width: '100%',
                height: '100%',
                legend: 'right',
                chartArea: { width: '80%', height: '80%'},
                series: {
                    0: { color: '#CA8EC2' }//設定顏色為 #FFDAB9
                },
            };

            var chart = new google.visualization.PieChart(document.getElementById('piechartContainer'));
            chart.draw(data, options);

            if(previewBool == true){
                var chart = new google.visualization.PieChart(document.getElementById('previewBox'));
                chart.draw(data, options);
                previewBool = false; // 還原
            }
        }
    }

    //google chart圓環圖
    function renderPieholeChart() {
        pieholeContainer.innerHTML = '';

        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
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
                pieHole: 0.5,
                pieSliceTextStyle: {
                    color: 'black',
                },

                title: uploadedFileName, //標題文字
                // is3D: true,
                width: '100%',
                height: '100%',
                legend: 'right',
                chartArea: { width: '80%', height: '80%' },
                series: {
                    0: { color: '#CA8EC2' }//設定顏色為 #FFDAB9
                },
            };
            
            var chartb = new google.visualization.PieChart(document.getElementById('pieholeContainer'));
            chartb.draw(data, options);

            if(previewBool == true){
                var chart = new google.visualization.PieChart(document.getElementById('previewBox'));
                chart.draw(data, options);
                previewBool = false; // 還原
            }
        }
    }




    //google charts柱狀圖
    function renderChart() {
        chartContainer.innerHTML = '';
        //加載 Google Charts 套件的函式
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            var data = new google.visualization.DataTable();

            data.addColumn('string', 'Name');


            //獲取資料名稱
            console.log(selectedColumnIndices);
            for (var i = 0; i < selectedColumnIndices.length; i++) {
                var columnIndex = selectedColumnIndices[i];
                data.addColumn('number', InputData[0][columnIndex]);
                // 將數值作為 annotation 顯示
                data.addColumn({ type: 'number', role: 'annotation' });
            }



            for (var i = 1; i < InputData.length; i++) {
                var row = InputData[i];
                var rowData = [row[0].replace(/"/g, '')];

                // 檢查 rowData 內容
                console.log(rowData);

                if (selectedRows.indexOf(rowData[0]) !== -1) {
                    for (var j = 0; j < selectedColumnIndices.length; j++) {
                        var columnIndex = selectedColumnIndices[j];
                        //將結果添加到rowData
                        var value = parseFloat(row[columnIndex]);
                        rowData.push(value);
                        rowData.push(value); // 複製一份數值作為 annotation

                    }
                    data.addRow(rowData);
                }
            }


            var options = {
                title: uploadedFileName, //標題文字
                animation: {//載入動畫
                    startup: true,
                    duration: 1000,
                    easing: 'out',
                },
                hAxis: {
                    title: '市、縣(鄉鎮區)',
                    textStyle: {
                        fontSize: 10,
                        color: '#053061',
                        bold: true,
                        italic: false
                    },
                    titleTextStyle: {
                        fontSize: 10,
                        color: '#053061',
                        bold: true,
                        italic: false
                    }
                },
                vAxis: {
                    title: '類別',
                    textStyle: {
                        fontSize: 10,
                        color: '#67001f',
                        bold: false,
                        italic: false
                    },
                    titleTextStyle: {
                        fontSize: 10,
                        color: '#67001f',
                        bold: true,
                        italic: false
                    }

                },
                series: {
                    0: { color: '#CA8EC2' }//設定顏色為 #FFDAB9
                },

                height: '100%',
                weigh: '100%',
                bar: { groupWidth: '50%' },
                legend: { position: 'top' },
                chartArea: { width: '85%', height: '65%' },//調整圖表區域大小
            };


            var chart = new google.visualization.ColumnChart(document.getElementById('chartContainer'));
            chart.draw(data, options);

            if(previewBool == true){
                var chart = new google.visualization.ColumnChart(document.getElementById('previewBox'));
                chart.draw(data, options);
                previewBool = false; // 還原
            }
        }
    }

//google charts 散佈圖
function renderScatterChart() {
    scatterchartContainer.innerHTML = '';

    // 加載 Google Charts corechart 套件
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(drawVisualization);

    function drawVisualization() {
        // 創建 DataTable
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Name');

        for (var i = 0; i < selectedColumnIndices.length; i++) {
            var columnIndex = selectedColumnIndices[i];
            data.addColumn('number', InputData[0][columnIndex]);
            // 將數值作為 annotation 顯示
            data.addColumn({ type: 'number', role: 'annotation' });
        }


        for (var i = 1; i < InputData.length; i++) {
            var row = InputData[i];
            var rowData = [row[0].replace(/"/g, '')];

            if (selectedRows.indexOf(rowData[0]) !== -1) {
                for (var j = 0; j < selectedColumnIndices.length; j++) {
                    var columnIndex = selectedColumnIndices[j];
                    var value = parseFloat(row[columnIndex]);
                    rowData.push(value);
                    rowData.push(value); // 複製一份數值作為 annotation

                }
                data.addRow(rowData);

            }
        }


        var options = {
            title: uploadedFileName, //標題文字
            animation: {
                startup: true,
                duration: 1000,
                easing: 'out',
            },
            hAxis: {
                title: '市、縣(鄉鎮區)',
                textStyle: {
                    fontSize: 10,
                    color: '#053061',
                    bold: true,
                    italic: false,
                },
                titleTextStyle: {
                    fontSize: 10,
                    color: '#053061',
                    bold: true,
                    italic: false,
                },
            },
            vAxis: {
                title: '類別',
                textStyle: {
                    fontSize: 10,
                    color: '#67001f',
                    bold: false,
                    italic: false,
                },
                titleTextStyle: {
                    fontSize: 10,
                    color: '#67001f',
                    bold: true,
                    italic: false,
                },
            },
            series: {
                0: { color: '#CA8EC2' }//設定顏色為 #FFDAB9

            },
            pointShape: { type: 'star', sides: 5, dent: 0.7 },
            width: '100%',
            height: '100%',
            legend: { position: 'top' },
            chartArea: { width: '85%', height: '65%' }, // 調整圖表區域大小
            crosshair: { trigger: 'both', orientation: 'both' }, // 啟用Crosshair
        };

        var chart = new google.visualization.ScatterChart(document.getElementById('scatterchartContainer'));
        chart.draw(data, options);

        if(previewBool == true){
            var chart = new google.visualization.ScatterChart(document.getElementById('previewBox'));
            chart.draw(data, options);
            previewBool = false; // 還原
        }
    }
}



    //google charts 長條圖
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
                // 將數值作為 annotation 顯示
                data.addColumn({ type: 'number', role: 'annotation' });
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
                        //將結果添加到rowData
                        var value = parseFloat(row[columnIndex]);
                        rowData.push(value);
                        rowData.push(value); // 複製一份數值作為 annotation
                    }
                    //barData.push(rowData);
                    data.addRow(rowData);
                }
            }

            //data.addRows(barData);

            var options = {
                title: uploadedFileName, //標題文字
                animation: {
                    startup: true,
                    duration: 1000,
                    easing: 'out',
                },
                vAxis: {

                    title: '市、縣(鄉鎮區)',
                    textStyle: {
                        fontSize: 10,
                        color: '#053061',
                        bold: true,
                        italic: false
                    },
                    titleTextStyle: {
                        fontSize: 10,
                        color: '#053061',
                        bold: true,
                        italic: false
                    }
                },
                hAxis: {

                    title: '類別',
                    textStyle: {
                        fontSize: 10,
                        color: '#67001f',
                        bold: false,
                        italic: false
                    },
                    titleTextStyle: {
                        fontSize: 10,
                        color: '#67001f',
                        bold: true,
                        italic: false
                    }

                },
                series: {
                    0: { color: '#CA8EC2' }//設定顏色為 #FFDAB9
                },
                width: '100%',
                height: '100%',
                legend: { position: 'right' },
                chartArea: { width: '65%', height: '75%' },//調整圖表區域大小
                bars: 'vertical', //顯示垂直柱狀圖
            };

            var chart = new google.visualization.BarChart(document.getElementById('barchartContainer'));
            chart.draw(data, options);

            if(previewBool == true){
                var chart = new google.visualization.BarChart(document.getElementById('previewBox'));
                chart.draw(data, options);
                previewBool = false; // 還原
            }
        }
    }



    //google charts折線圖
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
                // 將數值作為 annotation 顯示
                data.addColumn({ type: 'number', role: 'annotation' });
            }

            for (var i = 1; i < InputData.length; i++) {
                var row = InputData[i];
                var rowData = [row[0].replace(/"/g, '')];

                if (selectedRows.indexOf(rowData[0]) !== -1) {
                    for (var j = 0; j < selectedColumnIndices.length; j++) {
                        var columnIndex = selectedColumnIndices[j];
                        //將結果添加到rowData
                        var value = parseFloat(row[columnIndex]);
                        rowData.push(value);
                        rowData.push(value); // 複製一份數值作為 annotation
                    }
                    data.addRow(rowData);
                }
            }

            var options = {
                title: uploadedFileName, //標題文字
                animation: {
                    startup: true,
                    duration: 1000,
                    easing: 'out',
                },
                hAxis: {

                    title: '市、縣(鄉鎮區)',
                    textStyle: {
                        fontSize: 10,
                        color: '#053061',
                        bold: true,
                        italic: false
                    },
                    titleTextStyle: {
                        fontSize: 10,
                        color: '#053061',
                        bold: true,
                        italic: false
                    }
                },
                vAxis: {

                    title: '類別',
                    textStyle: {
                        fontSize: 10,
                        color: '#67001f',
                        bold: false,
                        italic: false
                    },
                    titleTextStyle: {
                        fontSize: 10,
                        color: '#67001f',
                        bold: true,
                        italic: false
                    }

                },
                series: {
                    0: { color: '#CA8EC2' }//設定顏色為 #FFDAB9
                },
                width: '100%',
                height: '100%',
                legend: { position: 'top' },
                chartArea: { width: '85%', height: '65%' },//調整圖表區域大小
                // curveType: 'function',
                crosshair: { trigger: 'both', orientation: 'both' }, // 啟用Crosshair

            };

            var chart = new google.visualization.LineChart(document.getElementById('linechartContainer'));
            chart.draw(data, options);

            if(previewBool == true){
                var chart = new google.visualization.LineChart(document.getElementById('previewBox'));
                chart.draw(data, options);
                previewBool = false; // 還原
            }
        }
    }

    //google charts區域圖
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
                // 將數值作為 annotation 顯示
                data.addColumn({ type: 'number', role: 'annotation' });
            }

            //var areaData = [];

            for (var i = 1; i < InputData.length; i++) {
                var row = InputData[i];
                var rowData = [row[0].replace(/"/g, '')];

                if (selectedRows.indexOf(rowData[0]) !== -1) {
                    for (var j = 0; j < selectedColumnIndices.length; j++) {
                        var columnIndex = selectedColumnIndices[j];
                        //將結果添加到rowData
                        var value = parseFloat(row[columnIndex]);
                        rowData.push(value);
                        rowData.push(value); // 複製一份數值作為 annotation
                    }
                    //areaData.push(rowData);
                    data.addRow(rowData);
                }
            }

            //data.addRows(areaData);

            var options = {
                title: uploadedFileName, //標題文字
                animation: {
                    startup: true,
                    duration: 1000,
                    easing: 'out',
                },
                hAxis: {

                    title: '市、縣(鄉鎮區)',
                    textStyle: {
                        fontSize: 10,
                        color: '#053061',
                        bold: true,
                        italic: false
                    },
                    titleTextStyle: {
                        fontSize: 10,
                        color: '#053061',
                        bold: true,
                        italic: false
                    }
                },
                vAxis: {

                    title: '類別',
                    textStyle: {
                        fontSize: 10,
                        color: '#67001f',
                        bold: false,
                        italic: false
                    },
                    titleTextStyle: {
                        fontSize: 10,
                        color: '#67001f',
                        bold: true,
                        italic: false
                    }

                },
                series: {
                    0: { color: '#CA8EC2' }//設定顏色為 #FFDAB9
                },
                width: '100%',
                height: '100%',
                legend: { position: 'top' },
                chartArea: { width: '85%', height: '65%' },//調整圖表區域大小
                // isStacked: true, // 設定為堆疊區域圖
                crosshair: { trigger: 'both', orientation: 'both' }, // 啟用Crosshair
            };

            var chart = new google.visualization.AreaChart(document.getElementById('areachartContainer'));
            chart.draw(data, options);

            if(previewBool == true){
                var chart = new google.visualization.AreaChart(document.getElementById('previewBox'));
                chart.draw(data, options);
                previewBool = false; // 還原
            }
        }
    }







    //google charts 堆疊階梯狀圖
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
                // 將數值作為 annotation 顯示
                data.addColumn({ type: 'number', role: 'annotation' });
            }

            // 為堆疊階梯狀圖獲取數據
            for (var i = 1; i < InputData.length; i++) {
                var row = InputData[i];
                var rowData = [row[0].replace(/"/g, '')];

                if (selectedRows.indexOf(rowData[0]) !== -1) {
                    for (var j = 0; j < selectedColumnIndices.length; j++) {
                        var columnIndex = selectedColumnIndices[j];
                        //將結果添加到rowData
                        var value = parseFloat(row[columnIndex]);
                        rowData.push(value);
                        rowData.push(value); // 複製一份數值作為 annotation
                    }

                    data.addRow(rowData); // 使用addRow將一行數據添加到data中
                }
            }

            var options = {
                title: uploadedFileName, //標題文字
                animation: {
                    startup: true,
                    duration: 1000,
                    easing: 'out',
                },
                hAxis: {
                    title: '市、縣(鄉鎮區)',
                    textStyle: {
                        fontSize: 10,
                        color: '#053061',
                        bold: true,
                        italic: false
                    },
                    titleTextStyle: {
                        fontSize: 10,
                        color: '#053061',
                        bold: true,
                        italic: false
                    }
                },
                vAxis: {
                    title: '類別',
                    textStyle: {
                        fontSize: 10,
                        color: '#67001f',
                        bold: false,
                        italic: false
                    },
                    titleTextStyle: {
                        fontSize: 10,
                        color: '#67001f',
                        bold: true,
                        italic: false
                    }

                },
                series: {
                    0: { color: '#CA8EC2' }//設定顏色為 #FFDAB9
                },
                width: '100%',
                height: '100%',
                legend: { position: 'top' },
                chartArea: { width: '85%', height: '65%' },//調整圖表區域大小
                curveType: 'function',

            };

            var chart = new google.visualization.SteppedAreaChart(document.getElementById('stackchartContainer'));
            chart.draw(data, options);

            if(previewBool == true){
                var chart = new google.visualization.SteppedAreaChart(document.getElementById('previewBox'));
                chart.draw(data, options);
                previewBool = false; // 還原
            }
        }
    }

    //google charts 直方圖
    function renderHistogramChart() {
        histogramContainer.innerHTML = '';

        // 加載Google Charts corechart套件
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(drawStackChart);

        function drawStackChart() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Name');

            for (var i = 0; i < selectedColumnIndices.length; i++) {
                var columnIndex = selectedColumnIndices[i];
                data.addColumn('number', InputData[0][columnIndex]);
                // // 將數值作為 annotation 顯示
                // data.addColumn({ type: 'number', role: 'annotation' });
            }

            //獲取數據
            for (var i = 1; i < InputData.length; i++) {
                var row = InputData[i];
                var rowData = [row[0].replace(/"/g, '')];

                if (selectedRows.indexOf(rowData[0]) !== -1) {
                    for (var j = 0; j < selectedColumnIndices.length; j++) {
                        var columnIndex = selectedColumnIndices[j];
                        //將結果添加到rowData
                        var value = parseFloat(row[columnIndex]);
                        rowData.push(value);
                        // rowData.push(value); // 複製一份數值作為 annotation
                    }

                    data.addRow(rowData); // 使用addRow將一行數據添加到data中
                }
            }

            var options = {
                title: uploadedFileName, //標題文字
                animation: {
                    startup: true,
                    duration: 1000,
                    easing: 'out',
                },
                hAxis: {
                    title: '市、縣(鄉鎮區)',
                    textStyle: {
                        fontSize: 10,
                        color: '#053061',
                        bold: true,
                        italic: false
                    },
                    titleTextStyle: {
                        fontSize: 10,
                        color: '#053061',
                        bold: true,
                        italic: false
                    }
                },
                vAxis: {
                    title: '類別',
                    textStyle: {
                        fontSize: 10,
                        color: '#67001f',
                        bold: false,
                        italic: false
                    },
                    titleTextStyle: {
                        fontSize: 10,
                        color: '#67001f',
                        bold: true,
                        italic: false
                    }

                },
                series: {
                    0: { color: '#CA8EC2' }//設定顏色為 #FFDAB9
                },
                width: '100%',
                height: '100%',
                legend: { position: 'top' },
                chartArea: { width: '85%', height: '65%' },//調整圖表區域大小


            };

            var chart = new google.visualization.Histogram(document.getElementById('histogramContainer'));
            chart.draw(data, options);

            if(previewBool == true){
                var chart = new google.visualization.Histogram(document.getElementById('previewBox'));
                chart.draw(data, options);
                previewBool = false; // 還原
            }
        }
    }


    //google charts 泡泡圖
    function renderBubbleChart() {
        bubblechartContainer.innerHTML = '';

        // 加載Google Charts corechart套件
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(drawStackChart);

        function drawStackChart() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Name');

            for (var i = 0; i < selectedColumnIndices.length; i++) {
                var columnIndex = selectedColumnIndices[i];
                data.addColumn('number', InputData[0][columnIndex]);
                // 將數值作為 annotation 顯示
                data.addColumn({ type: 'number', role: 'annotation' });
            }

            // 獲取數據
            for (var i = 1; i < InputData.length; i++) {
                var row = InputData[i];
                var rowData = [row[0].replace(/"/g, '')];

                if (selectedRows.indexOf(rowData[0]) !== -1) {
                    for (var j = 0; j < selectedColumnIndices.length; j++) {
                        var columnIndex = selectedColumnIndices[j];
                        //將結果添加到rowData
                        var value = parseFloat(row[columnIndex]);
                        rowData.push(value);
                        rowData.push(value); // 複製一份數值作為 annotation
                    }

                    data.addRow(rowData); // 使用addRow將一行數據添加到data中
                }
            }

            var options = {
                title: uploadedFileName, //標題文字
                animation: {
                    startup: true,
                    duration: 1000,
                    easing: 'out',
                },
                hAxis: {
                    title: '數值',
                    textStyle: {
                        fontSize: 10,
                        color: '#053061',
                        bold: true,
                        italic: false
                    },
                    titleTextStyle: {
                        fontSize: 10,
                        color: '#053061',
                        bold: true,
                        italic: false
                    }
                },
                vAxis: {
                    title: '類別',
                    textStyle: {
                        fontSize: 10,
                        color: '#67001f',
                        bold: false,
                        italic: false
                    },
                    titleTextStyle: {
                        fontSize: 10,
                        color: '#67001f',
                        bold: true,
                        italic: false
                    }

                },
                series: {
                    0: { color: '#CA8EC2' }//設定顏色為 #FFDAB9
                },
                width: '100%',
                height: '100%',
                legend: { position: 'right' },
                chartArea: { width: '85%', height: '65%' },//調整圖表區域大小


            };

            var chart = new google.visualization.BubbleChart(document.getElementById('bubblechartContainer'));
            chart.draw(data, options);

            if(previewBool == true){
                var chart = new google.visualization.BubbleChart(document.getElementById('previewBox'));
                chart.draw(data, options);
                previewBool = false; // 還原
            }
        }
    }
