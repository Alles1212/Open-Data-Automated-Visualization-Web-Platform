var step = document.getElementById("step"); // 步驟按鈕
var description = document.getElementById("description"); // 敘述框按鈕
var t = document.getElementById('t');
var divForDescripBoxBackDrop = document.getElementById('divForDescripBoxBackDrop'); // 敘述框
var descripBox = document.getElementById('descripBox'); // 敘述框
var clearBtn = document.getElementById('clearBtn'); // 清除按鈕(敘述框)
var editBtn = document.getElementById('editBtn'); // 編輯按鈕(敘述框)
var finishBtn = document.getElementById('finishBtn'); // 完成按鈕(敘述框)
var closeBTN = document.getElementById('closeBTN'); // 關閉按鈕(敘述框)
// var inputAuthor = document.getElementById('inputAuthor'); // 作者輸入盒(敘述框)
// var divForDesAuthor = document.getElementById('divForDesAuthor'); // 作者輸入完成div(敘述框)
var inputTheme = document.getElementById('inputTheme'); // 主題輸入盒(敘述框)
var divForDesTheme = document.getElementById('divForDesTheme'); // 主題輸入完成div(敘述框)
var textarea = document.getElementById('textarea'); // 文字區塊(敘述框)
var divForFinish = document.getElementById('divForFinish'); // 建立div顯示輸入的文字(敘述框)
var inputResource = document.getElementById('inputResource'); // 資料來源(敘述框)
var divForinputResource = document.getElementById('divForinputResource'); // 資料來源(敘述框)
var remitBtn = document.getElementById('remitBtn'); // 匯出按鈕
var stepBoxBackDropDiv = document.getElementById('stepBoxBackDropDiv'); // 步驟框背景區塊
var stepBox = document.getElementById('stepBox'); // 步驟方塊
var itemsDiv = document.getElementById('itemsDiv'); // 項目區塊(步驟框)
var contentForStep = document.getElementById('contentForStep'); // 內容區塊(步驟框)


step.addEventListener('click', showStep); // 點擊步驟框按鈕
description.addEventListener('click', showDescription); // 點擊敘述框按鈕


 // 顯示步驟框
function showStep(){
    stepBoxBackDropDiv.style.visibility = 'visible'; // 顯示步驟框
    itemsDiv.replaceChildren();
    initStepContent(); // 初始步驟畫面(地圖)
    
    var itemsName = ['地圖選擇','上傳方式','選擇欄位']; // 項目名稱
    for(var i = 0; i < itemsName.length; i++){
        var itemsNameDiv = document.createElement('div'); // 建立項目名稱區塊
        itemsNameDiv.className = 'itemsNameDiv';
        itemsNameDiv.textContent = itemsName[i]; // 設定文字
        itemsNameDiv.style.fontSize = 20 + 'px';
        itemsNameDiv.id = i;
        itemsDiv.appendChild(itemsNameDiv);

        itemsNameDiv.addEventListener('click', changeContent); // 更改步驟內容
    }


    var button = document.createElement('button'); // 建立關閉鈕
    button.id = 'closeStep';

    button.addEventListener('click', function(){  // 關閉步驟框
        stepBoxBackDropDiv.style.visibility = 'hidden'; // 隱藏步驟框背景
        suBoxForButtons.style.visibility = 'hidden'; // 隱藏按鈕懸浮框
    })

    itemsDiv.appendChild(button);
    stepBox.appendChild(itemsDiv);
    stepBox.appendChild(contentForStep);
    
    
    stepBoxBackDropDiv.appendChild(stepBox)
    document.body.appendChild(stepBoxBackDropDiv);

    button.addEventListener('mousemove',createButtonSuspendBox); // 滑鼠進入按鈕

    button.addEventListener('mouseout',function(){  // 滑鼠離開按鈕
        suBoxForButtons.style.visibility = 'hidden';
    })
}

// 初始步驟畫面(地圖)
function initStepContent(){
    contentForStep.replaceChildren();
    var mapImage = document.createElement('img'); // 建立地圖圖片
    mapImage.style.width = 300 + 'px';
    mapImage.style.height = 400 + 'px';
    mapImage.src = "./image/stepMap.png";

    var mapText = document.createElement('div'); // 建立地圖文字區塊
    mapText.style.width = 300 + 'px';
    mapText.style.height = 400 + 'px';
    mapText.style.display = 'flex';
    mapText.style.alignItems = 'center';
    mapText.style.textAlign = 'justify'; // 左右對齊

    var p = document.createElement('div'); // 建立地圖文字
    p.innerHTML = '單擊不同縣市區塊可以切換不同縣市地圖，\
                   雙擊同一鄉鎮區塊可以切換回台灣地圖';
    p.style.position = 'relative';
    p.style.fontSize = 20 + 'px';

    mapText.appendChild(p);
    contentForStep.appendChild(mapImage);
    contentForStep.appendChild(mapText);
}

// 更改步驟內容
function changeContent(e){
    contentForStep.replaceChildren();
    var curDiv = e.target; // 當前點擊的項目
    if(curDiv.id == 0){
        initStepContent(); // 初始步驟畫面(地圖);
        //curDiv.style.backgroundColor = 'red';
    }else if(curDiv.id == 1){
        allFileStep(); // 檔案上傳步驟
    }else if(curDiv.id == 2){

    }
}

// 檔案上傳步驟
function allFileStep(){
    contentForStep.replaceChildren();

    
}

var recordTheme = ""
var recordDescript = "";
var recordResource = "";
// 顯示敘述框
function showDescription(){
    // gatherBtnDiv.style.visibility = 'hidden'; // 顯示按鈕區塊
    // gatherBtn.style.visibility = 'visible'; // 顯示按鈕
    
    description.style.pointerEvents = 'none';  // 使敘述框按鈕失去功能
    divForDescripBoxBackDrop.style.visibility = 'visible'; // 顯示敘述框
    descripBox.style.visibility = 'visible'; // 顯示敘述框

    editBtn.style.pointerEvents = 'none'; // 編輯按鈕失去功能

    if(divForFinish.textContent != "" || divForFinish.textContent == "請輸入敘述"){ // 如果在完成後的畫面點擊關閉按鈕
        editBtn.style.pointerEvents = 'visible'; // 編輯按鈕恢復功能
        closeBTN.style.pointerEvents = 'visible'; // 關閉按鈕恢復功能
    }
    
     // 清除按鈕
    clearBtn.addEventListener('click',function(){
        // 清空文字區塊
        // inputAuthor.value = "";
        inputTheme.value = "";
        textarea.value = "";
        inputResource.value = "";

    });

     // 完成按鈕
    finishBtn.addEventListener('click',function(){
        clearBtn.style.pointerEvents = 'none'; // 清除按鈕失去功能
        finishBtn.style.pointerEvents = 'none'; // 完成按鈕失去功能
        editBtn.style.pointerEvents = 'visible'; // 完成按鈕恢復功能

        // 清掉原本的文字
        divForFinish.replaceChildren();
        divForinputResource.replaceChildren();
        // divForDesAuthor.replaceChildren();
        divForDesTheme.replaceChildren();

        // if(inputAuthor.value == ""){ // 如果沒輸入就完成
        //     divForDesAuthor.style.display = 'block'; // 顯示敘述完成框
        //     inputAuthor.style.display = 'none'; // 隱藏文字輸入框

        //     var span = document.createElement('span'); // 建立錯誤訊息
        //     span.textContent = '請輸入作者名稱';
        //     span.style.color = 'red';
        //     divForDesAuthor.appendChild(span);
        // }else{
        //     divForDesAuthor.style.display = 'block'; // 顯示敘述完成框
        //     inputAuthor.style.display = 'none'; // 隱藏文字輸入框

        //     var descripSpan = document.createElement('span'); // 將文字加到敘述完成框
        //     descripSpan.textContent = inputAuthor.value;
        //     divForDesAuthor.appendChild(descripSpan);
        // }

        if(inputTheme.value == ""){ // 如果沒輸入就完成
            divForDesTheme.style.display = 'block'; // 顯示敘述完成框
            inputTheme.style.display = 'none'; // 隱藏文字輸入框

            var span = document.createElement('span'); // 建立錯誤訊息
            span.textContent = '請輸入主題名稱';
            span.style.color = 'red';
            divForDesTheme.appendChild(span);
        }else{
            divForDesTheme.style.display = 'block'; // 顯示敘述完成框
            inputTheme.style.display = 'none'; // 隱藏文字輸入框

            var descripSpan = document.createElement('span'); // 將文字加到敘述完成框
            descripSpan.textContent = inputTheme.value;
            divForDesTheme.appendChild(descripSpan);

            recordTheme = descripSpan.textContent
        }

        if(textarea.value == ""){ // 如果沒輸入就完成
            divForFinish.style.display = 'block'; // 顯示敘述完成框
            textarea.style.display = 'none'; // 隱藏文字輸入框

            var span = document.createElement('span'); // 建立錯誤訊息
            span.textContent = '請輸入敘述';
            span.style.color = 'red';
            divForFinish.appendChild(span);
        }else{
            divForFinish.style.display = 'block'; // 顯示敘述完成框
            textarea.style.display = 'none'; // 隱藏文字輸入框

            var descripSpan = document.createElement('span'); // 將文字加到敘述完成框
            descripSpan.id = 'descripSpan';
            descripSpan.textContent = textarea.value;
            divForFinish.appendChild(descripSpan);

            recordDescript = descripSpan.textContent

        }

        if(inputResource.value == ""){ // 如果沒輸入就完成
            divForinputResource.style.display = 'block'; // 顯示資料來源完成框
            inputResource.style.display = 'none'; // 隱藏資料來源輸入框

            var span = document.createElement('span'); // 建立錯誤訊息
            span.textContent = '請輸入資料來源';
            span.style.color = 'red';
            divForinputResource.appendChild(span);
        }else{
            divForinputResource.style.display = 'block'; // 顯示資料來源完成框
            inputResource.style.display = 'none'; // 隱藏資料來源輸入框

            var descripSpan1 = document.createElement('span'); // 將文字加到資料來源完成框
            descripSpan1.id = 'descripSpan1';
            descripSpan1.textContent = inputResource.value;
            
            divForinputResource.appendChild(descripSpan1);
            divForinputResource.style.overflowY = 'auto' // 設定滾輪

            recordResource = descripSpan1.textContent
        }
    });

    // 編輯按鈕
    editBtn.addEventListener('click',function(){
        editBtn.style.pointerEvents = 'none'; // 編輯按鈕失去功能

        divForDesAuthor.style.display = 'none'; // 隱藏作者名稱完成框
        // inputAuthor.style.display = 'block'; // 顯示作者輸入框

        divForDesTheme.style.display = 'none'; // 隱藏主題名稱完成框
        inputTheme.style.display = 'block'; // 顯示主題輸入框

        divForFinish.style.display = 'none'; // 隱藏敘述完成框
        textarea.style.display = 'block'; // 顯示文字完成框

        divForinputResource.style.display = 'none'; // 隱藏資料來源完成框
        inputResource.style.display = 'block'; // 顯示資料來源輸入框

        clearBtn.style.pointerEvents = 'visible'; // 清除按鈕恢復功能
        finishBtn.style.pointerEvents = 'visible'; // 完成按鈕恢復功能
    });
    
    // 關閉按鈕
    closeBTN.addEventListener('click',function(){
        divForDescripBoxBackDrop.style.visibility = 'hidden'; // 隱藏敘述框
        descripBox.style.visibility = 'hidden'; // 關閉敘述框
        description.style.pointerEvents = 'visible';  // 使敘述框按鈕恢復功能
        suBoxForButtons.style.visibility = 'hidden'; // 隱藏按鈕懸浮框
    });

}



remitBtn.addEventListener('click',remitScreen);

// 存檔
function remitScreen(){

    var divForRemit = document.createElement('div'); // 資料區塊
    divForRemit.id = 'divForRemit';


    var spanForMap = document.createElement('span');
    spanForMap.textContent = CityName[currentMap]; // 縣市名稱
    spanForMap.style.position = 'relative';
    spanForMap.style.fontSize = 40 + 'px';

    var spanForChart = document.createElement('span');
    spanForChart.textContent = columnNameArray[0]; // 欄位資料
    spanForChart.style.position = 'relative';
    spanForChart.style.fontSize = 40 + 'px';
    spanForChart.style.left = 200 + 'px'

    divForRemit.appendChild(spanForMap);
    divForRemit.appendChild(spanForChart);
    document.body.appendChild(divForRemit);

    
    var htmlCode = '<style>' + '.TaiwanMap{fill: #ccddff;stroke: #333333;stroke-width: 10;}' + '</style>' + 
                    document.getElementById('default').innerHTML;

    var newHtml = document.implementation.createHTMLDocument("newHtml");
    newHtml.documentElement.innerHTML = (htmlCode); 

    console.log(newHtml)

    var iframe = document.createElement('iframe');
    var blob = new Blob([htmlCode], {
        'type': 'text/html'
    });
    iframe.src = URL.createObjectURL(blob);
    iframe.style.width = 100 + '%';
    iframe.style.height = 800 + 'px';
    iframe.click()

    document.body.appendChild(iframe)
    

    var JsonData = {
                        "theme": recordTheme, // 目前作品名稱
                        "descript": recordDescript, // 目前敘述
                        "resource": recordResource, // 目前資料來源
                        "svgMap": currentMap, // 目前縣市地圖
                        "backGround": recordBackGround, // 目前選擇的背景(跟地圖一樣)
                        "inputData": InputData, // 目前上傳的檔案(二維陣列)
                        "rangeGroup": groupNum, // 目前選擇的顏色分組數
                        "mapColor": currentColorID, // 目前選擇的顏色
                        "columnName": posForColumnDiv, // 目前選擇的欄位名稱(切換地圖)
                        "selectColumn": selectedColumnIndices, // 目前被點擊的選擇欄位複選盒(陣列)
                        "selectTown": selectedRows, // 目前被點擊的選擇鄉鎮複選盒(陣列)
                        
                   }

    console.log(JsonData);
    
}


var suBoxForButtons = document.getElementById('suBoxForButtons'); // 按鈕懸浮框
var allButton = document.body.getElementsByTagName("button"); // 所有按鈕

for(var i = 0; i < allButton.length;i++){
    allButton[i].addEventListener('mousemove',createButtonSuspendBox); // 滑鼠進入按鈕

    allButton[i].addEventListener('mouseout',function(){  // 滑鼠離開按鈕
        suBoxForButtons.style.visibility = 'hidden';
    });
}
function createButtonSuspendBox(d){
    suBoxForButtons.style.visibility = 'visible';
    suBoxForButtons.style.position = 'relative';
    suBoxForButtons.style.left = d.pageX - 10 + 'px';
    suBoxForButtons.style.top = d.pageY - 60 + 'px';

    if(d.target.id == 'sentFile'){ // 檔案區
        suBoxForButtons.textContent = '上傳檔案';
    }else if(d.target.id == 'sentAPI'){
        suBoxForButtons.textContent = '上傳API';
    }else if(d.target.id == 'sentSelfFile'){
        suBoxForButtons.textContent = '自製表單';
    }else if(d.target.id == 'downloadAll'){
        suBoxForButtons.textContent = '下載'; // 最上面區
    }else if(d.target.id == 'remitBtn'){
        suBoxForButtons.textContent = '存檔';
    }else if(d.target.id == 'step'){
        suBoxForButtons.textContent = '步驟';
    }else if(d.target.id == 'description'){
        suBoxForButtons.textContent = '基本資料';
    }else if(d.target.id == 'statBtn'){
        suBoxForButtons.textContent = '摘要統計';
    }else if(d.target.id == 'clearBtn'){
        suBoxForButtons.textContent = '清除'; // 敘述框區
        suBoxForButtons.style.zIndex = 2;
    }else if(d.target.id == 'editBtn'){
        suBoxForButtons.textContent = '編輯';
        suBoxForButtons.style.zIndex = 2;
    }else if(d.target.id == 'finishBtn'){
        suBoxForButtons.textContent = '完成';
        suBoxForButtons.style.zIndex = 2;
    }else if(d.target.id == 'closeBTN' || 
             d.target.id == 'statClose' ||
             d.target.id == 'closeStep'){
        suBoxForButtons.textContent = '關閉';
        suBoxForButtons.style.zIndex = 2;
    }else if(d.target.id == 'OKButtonForselfFile'){ // 自製表單區
        suBoxForButtons.textContent = '確定';
        suBoxForButtons.style.zIndex = 2;
    }else if(d.target.id == 'submitButtonForselfFile' ||
             d.target.id == 'submit' ||
             d.target.id == 'submitAPI'){
        suBoxForButtons.textContent = '上傳';
        suBoxForButtons.style.zIndex = 2;
    }else if(d.target.id == 'clearButtonForselfFile'){
        suBoxForButtons.textContent = '清除欄位';
        suBoxForButtons.style.zIndex = 2;
    }else if(d.target.id == 'closeButtonForselfFile'){
        suBoxForButtons.textContent = '關閉表格';
        suBoxForButtons.style.zIndex = 2;
    }else if(d.target.id == 'divForCsvFile'){
        suBoxForButtons.textContent = '選擇CSV';
        suBoxForButtons.style.zIndex = 2;
    }else if(d.target.id == 'divForCsvFile'){
        suBoxForButtons.textContent = '選擇CSV';
        suBoxForButtons.style.zIndex = 2;
    }else if(d.target.id == 'downloadXLSX'){
        suBoxForButtons.textContent = '下載XLSX';
        suBoxForButtons.style.zIndex = 2;
    }else if(d.target.id == 'downloadJPG'){
        suBoxForButtons.textContent = '下載JPG';
        suBoxForButtons.style.zIndex = 2;
    }
    

    if(d.target.id == 'colorBtn' || 
       d.target.id == 'changeBtnForLeft' ||
       d.target.id == 'changeBtnForRight'){ // 顏色選擇鈕跟左右鈕不用出現懸浮框
        suBoxForButtons.style.visibility = 'hidden';
    }
}












