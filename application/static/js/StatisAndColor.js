var rangeDiv = document.getElementById("rangeDiv"); // 範圍區塊(分辨顏色)

var showMax = document.getElementById("Max"); // 最大值之文字
var showmin = document.getElementById("min"); // 最小值之文字
var showAvg = document.getElementById("avg"); // 平均之文字
var showstD = document.getElementById("stD"); // 平均之文字
var showSum = document.getElementById("sum"); // 總和之文字
var showNum = document.getElementById("num"); // 個數之文字
var statBtn = document.getElementById("statBtn") // 摘要統計按鈕
var forGroupBtn = document.getElementById("forGroupBtn") // 分組單位按鈕
var groupInputDiv = document.getElementById("groupInputDiv") // 分組單位區塊

var colArray = []; // 空陣列，存數值
var townArray = []; // 空陣列，存鄉鎮
var average = 0; // 平均
var standard_deviation = 0; // 標準差

statBtn.addEventListener('mousemove',function(){ // 點擊摘要統計按鈕
    if(InputData.length != 0){
        stat.style.visibility = 'visible'; // 顯示統計區塊
    }
});

stat.addEventListener('mouseleave',function(){ // 滑鼠離開摘要統計區塊
    stat.style.visibility = 'hidden'; // 隱藏統計區塊
});

forGroupBtn.addEventListener('mousemove',function(){
    groupInputDiv.style.visibility = 'visible'; // 顯示分組單位區塊
})

groupInputDiv.addEventListener('mouseleave',function(){ // 滑鼠離開分組單位區塊
    groupInputDiv.style.visibility = 'hidden'; // 隱藏分組單位區塊
});

var maxValue = 0; // 最大數值
var minValue = 0; // 最小數值
// 摘要統計
function statistics(){
    var sum = 0; // 總和
    var maxTown = ""; // 最大數值之鄉鎮
    var minTown = ""; // 最小數值之鄉鎮
    var stD_sum = 0; // 總和,計算標準差用
    var num = 0; // 總數

    colArray = []; // 重製矩陣
    townArray = []; // 重製矩陣

    for(var i = 1; i < InputData.length; i++){ // 第一列為各欄位，不計入計算
        colArray.push(parseInt(InputData[i][posForColumnDiv])); // 將點選的欄位數值加到空陣列
        townArray.push(InputData[i][0]); // 將對應的鄉鎮加到空陣列
    }
    // 將所有要計算的數值先設為每一陣列第一個位置之值
    maxValue = colArray[0];
    minValue = colArray[0];
    maxTown = townArray[0];
    minTown = townArray[0];

    for(var i = 0; i < colArray.length; i++){
        if(maxValue < colArray[i]){ // 比大
            maxValue = colArray[i];
            maxTown = townArray[i];
        }
        if(minValue > colArray[i]){ // 比小
            minValue = colArray[i];
            minTown = townArray[i];
        }
        sum += colArray[i]; // 將陣列之值加總
    }

    average = sum / colArray.length; // 計算平均
    num = colArray.length; // 計算個數

    for(var i = 0; i < colArray.length; i++){
        stD_sum += Math.pow((colArray[i] - average),2)
    }
    standard_deviation = Math.sqrt((stD_sum/colArray.length)) // 計算標準差

    showMax.textContent = "最大值：" + maxTown + "：" + maxValue;
    showmin.textContent = "最小值：" + minTown + "：" + minValue;
    showAvg.textContent = "平均值：" + average.toFixed(2); // 限制在小數第二位
    showstD.textContent = "標準差：" + standard_deviation.toFixed(2); // 限制在小數第二位
    showSum.textContent = "總和： "  + sum;
    showNum.textContent = "個數： "  + num;
    
}

var selectForGroup = document.getElementById('selectForGroup'); // 下拉式清單
var unit = document.getElementById('unit'); // 單位輸入盒
var rangeArray = []; // 記錄所有範圍
var groupNum = 0; // 分幾組
var recordUnit = "";
// 進行分組
function Grouping(){
    rangeDiv.replaceChildren(); // 清除原本的所有元素
    rangeDiv.style.visibility = 'visible'; // 顯示範圍框
    
    for(var i = 1; i < 9; i++){
        var option = document.createElement('option'); // 建立選項
        option.style.position = 'absolute';
        option.id = i;
        option.textContent = i;
        option.style.textAlign = 'center'; // 置中
        selectForGroup.appendChild(option);
    }
    selectForGroup.value=8
    selectForGroup.addEventListener('change', function(d){
        rangeDiv.replaceChildren(); // 清除原本的所有元素
        groupNum = d.target.value; // 下拉式選單的值
        appearRange();
    })

    if(selectForGroup.length > 8){ // 分8組
        selectForGroup.length = 8; // 使option不重複出現
    }
}

// 生成範圍框
function appearRange(){
    rangeDiv.replaceChildren(); // 清除原本的所有元素
    rangeArray.length = 0; // 清空

    var interval = (maxValue-minValue) / groupNum; // 區間
    var recordMin = minValue; // 將最小值記錄
    var inputColorPos = 0; // 在輸入的顏色陣列中的位置

    for(var i = 0; i < groupNum; i++){
        rangeArray.push(parseFloat(minValue + interval).toFixed(0)); // 將所有區間加到陣列
        minValue += interval; // 更新最小值
    }
    
    minValue = recordMin; // 還原

    for(var i = rangeArray.length-1; i >= 0; i--){ // 根據區間數量建立span
        var span = document.createElement('span');

        span.textContent = rangeArray[i-1] + " ~ " + rangeArray[i]; // 顯示文字

        if(i == 0){ // 最後一組
            span.textContent = minValue + " ~ " + rangeArray[i]; // 最後一組顯示最小值
        }
        span.style.backgroundColor = currentColorDiv[inputColorPos] // 設定背景顏色

        rangeDiv.appendChild(span);

        inputColorPos += 1; // 下一個位置
    }
    console.log(rangeDiv.getElementsByTagName('span'))
    console.log(unit.value)
    var unitPos = rangeDiv.getElementsByTagName('span'); // 單位文字該放的上一個位置
    for(var i = unitPos.length-1; i >= 0; i--){
        var unitSpan = document.createElement('span'); // 建立新文字
        unitSpan.textContent = "  (" + unit.value + ")";
        unitSpan.style.fontSize = 17 + 'px';

        if(unit.value == ""){
            unitSpan.textContent = "（單位）";
        }
        unitPos[i].appendChild(unitSpan)
        //rangeDiv.insertBefore(unitSpan, rangeDiv.childNodes[i])
    }
    
    townArea(currentMap);
}

// 單位輸入盒按enter後，改變單位
unit.addEventListener('keydown', function(event){ // 按enter鍵
    if(event.key === 'Enter'){
        for(var i = 0; i < rangeDiv.getElementsByTagName('span').length; i++){
            if(i % 2 != 0){ // 奇數span才要改單位
                rangeDiv.getElementsByTagName('span')[i].textContent = "  (" + unit.value + ")";
                recordUnit = unit.value;
            }
        }
    }
});

var redDiv = ['#800000','#A80000','#D10000','#FF0000','#FF5959','#FFA1A1','#FFBFBF','#FFDEDE','#FFF2F2'] // 紅色
var orangeDiv = ['#805300','#A86E00','#D18800','#FFA600','#FFC559','#FFDEA1','#FFE8BF','#FFF3DE','#FFFAF2'] // 橙色
var yellowDiv = ['#808000','#A8A800','#D1D100','#FFFF00','#FFFF59','#FFFFA1','#FFFFBF','#FFFFDE','#FFFFF2'] // 黃色
var greenDiv = ['#008000','#00A800','#00D100','#00FF00','#59FF59','#A1FFA1','#BFFFBF','#DEFFDE','#F2FFF2'] // 綠色
var blueDiv = ['#008080','#00A8A8','#00D1D1','#00FFFF','#59FFFF','#A1FFFF','#BFFFFF','#DEFFFF','#F2FFFF'] // 藍色
var purpleDiv = ['#4A0080','#6100A8','#7900D1','#9300FF','#B959FF','#D7A1FF','#E4BFFF','#F1DEFF','#FAF2FF'] // 紫色
var allColor = [redDiv,orangeDiv,yellowDiv,greenDiv,blueDiv,purpleDiv] // 顏色陣列
var currentColorDiv = allColor[0] // 初始顏色

// 生成顏色
function renderColor(attr,svg_Polygon,i){
    var townID = allMap[attr][i]['id']; // 該鄉鎮id
    
    svg_Polygon.style.fill = currentColorDiv[8]; // 無資料之地區顏色
    
    for(var j = 0; j < townArray.length; j++){
        if(townArray[j] == townID){ // 對應的鄉鎮
            var currentValue = parseInt(colArray[j]); // 當前數值
            
            for(var k = groupNum-1; k >= 0; k--){
                if(k == 0){ // 最小值
                    if(currentValue <= rangeArray[0] & currentValue >= minValue){
                        svg_Polygon.style.fill = currentColorDiv[groupNum-1];
                    }
                }else{ // 其他數值
                    if(currentValue <= rangeArray[k] & currentValue >= rangeArray[k-1]){
                        svg_Polygon.style.fill = currentColorDiv[groupNum-(k+1)];
                    }
                }
            }
        }
    }
    
}
colorBtn.addEventListener('mousemove',chooseColor); // 顯示六個顏色按鈕

columnNameDiv.style.backgroundColor = currentColorDiv[5];
fileNameDiv.style.backgroundColor = currentColorDiv[5];
sumFileBtn.style.backgroundColor = currentColorDiv[7];
avgFileBtn.style.backgroundColor = currentColorDiv[7];
groupInputDiv.style.backgroundColor = currentColorDiv[6];
stat.style.backgroundColor = currentColorDiv[8];
suBox.style.backgroundColor = currentColorDiv[8];

// 生成選擇顏色按鈕
var btnColorArray = ['#FF0000','#FFA600','#FFFF00','#00FF00','#00FFFF','#9300FF']
var colorDiv = document.getElementById('colorDiv');
function chooseColor(){
    colorDiv.replaceChildren();
    colorDiv.style.visibility = 'visible'; // 顯示按鈕區塊

    for(var i = 0; i < btnColorArray.length; i++){
        var btn = document.createElement('button');
        btn.style.position = 'relative';
        btn.style.width = 20 + 'px';
        btn.style.height = 20 + 'px';
        btn.style.left = 5 + 'px';
        btn.style.background = btnColorArray[i];
        btn.style.cursor = 'pointer';
        btn.id = i;
        
        if(i == 3){
            var br = document.createElement('br'); // 第四個按鈕換行
            colorDiv.appendChild(br)
        }
        colorDiv.appendChild(btn);

        //var btnId = document.getElementById(i); // 六個顏色按鈕
        btn.addEventListener('click',changeColor); // 點擊六個按鈕
        
    }

    colorDiv.addEventListener('mouseleave',function(){ // 滑鼠離開按鈕區塊
        colorDiv.style.visibility = 'hidden'; // 隱藏按鈕區塊
    })
}

var currentColorID = 0; // 記錄地圖顏色
// 改變顏色
function changeColor(e){
    currentColorID = e.target.id // 當前被點到的顏色塊
    currentColorDiv = allColor[currentColorID]; // 不同色系(紅、藍、綠)
    colorDiv.style.visibility = 'hidden'; // 隱藏顏色選擇區塊
    
    columnNameDiv.style.backgroundColor = currentColorDiv[5];
    fileNameDiv.style.backgroundColor = currentColorDiv[5];
    sumFileBtn.style.backgroundColor = currentColorDiv[7];
    avgFileBtn.style.backgroundColor = currentColorDiv[7];
    groupInputDiv.style.backgroundColor = currentColorDiv[6];
    stat.style.backgroundColor = currentColorDiv[8];
    suBox.style.backgroundColor = currentColorDiv[8];
    townNameDiv.getElementsByTagName('span')[0].style.backgroundColor = currentColorDiv[8];
    townArea(currentMap); // 同時改變地圖顏色
    appearRange(); // 同時改變範圍框顏色
    
}

function limitCityColor(){
    var allMapKeys = Object.keys(allMap); // 記錄數值
    var allMapValues = Object.values(allMap); // 記錄鄉鎮
    var realMap; // 記錄當前點選的地圖

    for(var k = 1; k < InputData.length; k++){
        for(var i = 0; i < allMapValues.length; i++){
            for(var j = 0; j < allMapValues[i].length; j++){
                if(allMapValues[i][j]['id'] == InputData[k][0]){ // 判斷為某縣市
                    realMap = allMapKeys[i];
                }
            }
        }
    }

    if(currentMap != realMap){ 
        originColor(); // 還原成背景顏色
    }
    
}

// 原始背景顏色
function originColor(){
    var svgDiv = document.getElementById('svgDiv');
    var svgPolygon = svgDiv.getElementsByTagName('polygon'); // 抓取每個polygon資料

    for(var i = 0; i < svgPolygon.length; i++){
        svgPolygon[i].style.fill = '#d0d0d0'; // 重製顏色
    }
    statBtn.style.visibility = 'hidden';
    colorBtn.style.visibility = 'hidden'; // 隱藏選擇顏色按鈕
    rangeDiv.style.visibility= 'hidden'; // 隱藏顏色範圍框
}













