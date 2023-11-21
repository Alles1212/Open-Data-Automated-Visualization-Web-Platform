var stat = document.getElementById('stat');
var sumFileBtn = document.getElementById('sumFileBtn'); // 檔案加總鈕
var avgFileBtn = document.getElementById('avgFileBtn'); // 檔案平均鈕
var blankDiv = document.getElementById('blankDiv'); // 空白區域
sumFileBtn.addEventListener('click',sumFile)
avgFileBtn.addEventListener('click',avgFile)


// 資料分析
function analyze(InputData){
    var firstCol = InputData[0]; // 記錄欄位名稱
    var tArray = []; // 存轉置後的矩陣

    
    InputData = dealMarks(InputData); // 處理特殊符號
    InputData = clearAccumulate(InputData); // 處理檔案累加問題
    
    // 進行矩陣轉置
    for(var i = 0; i < InputData[0].length; i++){
        var rowArray = [];
        for(var j = 1; j < InputData.length; j++){
            rowArray.push(InputData[j][i]);
        }
        tArray.push(rowArray)
    }

    if(isSelfFile == true){ // 從自製表單來的就不進入總和判斷
        tArray = tArray;
    }else{
        tArray = delTotal(tArray); // 刪除統計量
    }

    var originArray = []; // 將清洗好的陣列還原

    if(judgeBlankSpace(InputData)){
        allChartsContainer.replaceChildren(); // 清空原本的元素
        showError(InputData); // 顯示空白的位置
    }else{
        tArray = judgeFile(tArray,firstCol); // 判斷屬於哪種類型的檔案
        for(var i = 0; i < tArray[0].length; i++){
            var rowArray = [];
            for(var j = 0; j < tArray.length; j++){
                rowArray.push(tArray[j][i]);
            }
            originArray.push(rowArray)
        }
        originArray.unshift(firstCol); // 加入欄位名稱(單位、A1件數)
    }
    return originArray;
}

// 處理檔案累加問題，不計入上一個檔案，只保留當前上傳之檔案
var lenArray = []; // 記錄第一個檔案資料的長度
function clearAccumulate(InputData){
    lenArray.push(InputData.length)
    var lastLen = 0; // 記錄前一個檔案的長度
    var curLen = 0; // 記錄當前檔案的長度
    var realLen = 0; // 檔案正確的長度
    var pos = 0; // 新檔案在舊檔案的位置 
    var newData = []; // 刪除後的新檔案
    
    if(lenArray.length > 1){ // 傳送兩個檔案以上
        lastLen = lenArray[lenArray.length-2];
        curLen = lenArray[lenArray.length-1];
        realLen = curLen - lastLen; // 當前減去上一個

        pos = InputData.length - realLen;
        for(var i = pos; i < InputData.length; i++){
            newData.push(InputData[i]);
        }
    }else{ // 只有一個檔案
        newData = InputData;
    }
    return newData;
}

// 刪除特殊符號
var data = []; // 存取修改後的陣列
function dealMarks(InputData){
    for(var i = 0; i < InputData.length; i++){
        var rowData = []; // 存取每一列
        for(var j = 0; j < InputData[0].length; j++){
            rowData.push(InputData[i][j].replace(/\!|\@|\#|\$|\^|\&|\%|\*|\(|\)|\+|\=|\-|\[|\]|\{|\}|\:|\<|\>|\?|\'|\,|\./g,"")); // 刪除特殊符號
        }
        data.push(rowData);
    }
    return data;
}

// 刪除統計值
function delTotal(tArray){
    var lastpos = tArray[0].length - 1; // 每一列最後一個位置
    var lastCount = 0; // 計算最後一列總計量出現的次數
    var firstCount = 0; // 計算第一列總計量出現的次數
    for(var i = 1; i < tArray.length; i++){
        var lastsum = 0; // 計算總和(最後一列為總和值)
        for(var j = 0; j < tArray[0].length; j++){
            if(j != lastpos){ // 將其他位置的值加總
                lastsum += parseInt(tArray[i][j]);
                if(lastsum == tArray[i][lastpos]){ // 最後一列為總計值
                    lastCount += 1; // 找到加一
                }

            }
        }

        var firstsum = 0; // 計算總和(第一列為總和值)
        for(var k = 1; k < tArray[0].length; k++){
            firstsum += parseInt(tArray[i][k]); // 將其他位置的值加總
            if(firstsum == tArray[i][0]){ // 第一列為總計值
                firstCount += 1;
            }
        }
    }

    if(lastCount == tArray.length - 1){ // 減一代表不算第一列 (第一列為欄位名稱)
        for(var i = 0; i < tArray.length; i++){
            tArray[i].pop(); // 刪掉總計值
        }
    }

    if(firstCount == tArray.length - 1){ // 減一代表不算第一列 (第一列為欄位名稱)
        for(var i = 0; i < tArray.length; i++){
            tArray[i].shift(); // 刪掉總計值
        }
    }
    return tArray;
}

// 判斷檔案類型
function judgeFile(tArray,firstCol){
    var sumArray = []; // 記錄每一列的總和
    var countNaN = 0; // 計算出現 NAN 的數量
    for(var i = 0; i < tArray.length; i++){
        var sum = 0; // 紀錄每一列總和
        for(var j = 0; j < tArray[0].length; j++){
            sum += parseInt(tArray[i][j]); // 將每一列相加
        }
        sumArray.push(sum); // 總和加入陣列
    }

    for(var i = 0; i < sumArray.length; i++){
        if(isNaN(sumArray[i])){ // 判斷是否為NaN
            countNaN += 1; // 找到數量加一
        }
    }

    if(countNaN >= 2){ // 大於等於兩列是NaN,確認是文字檔
        tArray = recombineStr(tArray,firstCol); // 重組檔案
        return tArray;
    }
    else{ // 數值檔
        tArray = dealValueFile(tArray);
        return tArray;
    }
}

// 將文字檔重組
function recombineStr(tArray,firstCol){
    var countArray = []; // 記錄每一列找到的鄉鎮欄位數量
    var strArray = []; // 記錄找到的鄉鎮列

    for(var i = 0; i < firstCol.length; i++){
        firstCol[i] += '（筆數）'; // 文字檔在標題欄位加入「筆數」
    }

    for(var i = 0; i < tArray.length; i++){
        var count = 0;
        for(var j = 0; j < tArray[0].length; j++){
            for(var k = 0; k < allMap[currentMap].length; k++){
                var currentID = allMap[currentMap][k]['id'].slice(0,-1); // 去掉最後一個字(鄉、鎮、市、區)
                if(tArray[i][j].indexOf(currentID) != -1){ // 判斷到鄉鎮(非正確鄉鎮，例:南屯、南，需繼續篩選)
                    count += 1; // 找到加一
                }
            }
        }
        countArray.push(count); // 加入陣列儲存
    }

    for(var w = 0; w < countArray.length; w++){ // 找出出現鄉鎮名稱的列
        if(countArray[w] >= tArray[0].length){
            strArray.push(w); // 找到就加入陣列
        }
    }
    skipCityName(tArray,strArray,firstCol); // 刪掉欄位中的縣市名

    var countTownForStr = countRepeat(tArray); // 計算重複的鄉鎮
    var newData = []; // 製作新陣列
    for(var i = 0; i < tArray.length; i++){
        var rowData = []; // 存列資料
        for(var j = 0; j < Object.keys(countTownForStr).length; j++){
            if(i == 0){
                rowData.push(Object.keys(countTownForStr)[j]); // 第一列加入鄉鎮名
            }else{
                rowData.push(Object.values(countTownForStr)[j]); // 其他列加入出現次數
            }
        }
        newData.push(rowData);
    }
    return newData;
}

 // 刪掉欄位中的縣市名
function skipCityName(tArray,strArray,firstCol){ // 刪掉欄位中的縣市名
    var countArray = []; // 記錄鄉鎮行是否出現縣市
    var posArray = []; // 記錄縣市行位置
    for(var i = 0; i < strArray.length; i++){
        var count = 0; // 記錄縣市出現次數
        for(var j = 0; j < tArray[strArray[i]].length; j++){
            if(tArray[strArray[i]][j] == CityName[currentMap]){
                count += 1; // 找到加一
            }
        }
        countArray.push(count); // 丟到陣列
    }

    for(var i = 0; i < countArray.length; i++){
        if(countArray[i] >= tArray[0].length){
            posArray.push(strArray[i]); // 記錄縣市行正確位置
        }
    }

    for(var i = posArray.length-1; i >= 0; i--){
        tArray.splice(posArray[i],1); // 刪除縣市行
        firstCol.splice(posArray[i],1); // 刪除縣市行欄位名稱
    }

    var correctCountArray = []; // 正確的記錄有出現鄉鎮名稱的陣列
    var correctStrArray = []; // 正確的記錄鄉鎮行
    for(var i = 0; i < tArray.length; i++){
        var count = 0;
        for(var j = 0; j < tArray[0].length; j++){
            for(var k = 0; k < allMap[currentMap].length; k++){
                var currentID = allMap[currentMap][k]['id'].slice(0,-1); // 去掉最後一個字(鄉、鎮、市、區)
                if(tArray[i][j].indexOf(currentID) != -1){ // 判斷到鄉鎮(非正確鄉鎮，例:南屯、南，需繼續篩選)
                    count += 1; // 找到加一
                }
            }
        }
        correctCountArray.push(count); // 加入陣列儲存
    }

    for(var w = 0; w < correctCountArray.length; w++){ // 找出出現鄉鎮名稱的列
        if(correctCountArray[w] >= tArray[0].length){
            correctStrArray.push(w); // 找到就加入陣列
        }
    }

    changeRow(tArray,correctStrArray)
}


// 交換欄位並改變鄉鎮名稱
function changeRow(tArray,correctStrArray){
    for(var i = 0; i < tArray.length; i++){
        for(var j = 0; j < tArray[0].length; j++){
            if(tArray[i][j].indexOf(CityName[currentMap]) != -1){
                tArray[i][j] = tArray[i][j].replace(CityName[currentMap],"")
            }
        }
    }
    var data = tArray[0]; // 存取第一列
    tArray[0] = tArray[correctStrArray[0]]; // 將鄉鎮欄位擺到第一列
    tArray[correctStrArray[0]] = data; // 將原始第一列擺到原鄉鎮列

    var col = InputData[0][0]; // 存取第一欄位名稱
    InputData[0][0] = InputData[0][correctStrArray[0]];
    InputData[0][correctStrArray[0]] = col; // 將原始第一列擺到原鄉鎮列
    changeTownName(tArray); // 更改鄉鎮名稱
}


// 更改鄉鎮名稱
function changeTownName(tArray){
    var arrForPos = []; // 存位置
    var arrForStr = []; // 存鄉鎮
    console.log(tArray)
    if(currentMap == 0){
        for(var i = 0; i < tArray[0].length; i++){
            for(var j = 0; j < allMap[currentMap].length; j++){
                var currentID = allMap[currentMap][j]['id']; // 去掉最後一個字(鄉、鎮、市、區)
                if(tArray[0][i].indexOf(currentID) != -1){
                    arrForPos.push(i); // 加入該位置到陣列
                    arrForStr.push(currentID); // 加入該鄉鎮到陣列
                }
            }
        }
    }else{
        for(var i = 0; i < tArray[0].length; i++){
            for(var j = 0; j < allMap[currentMap].length; j++){
                var currentID = allMap[currentMap][j]['id'].slice(0,-1); // 去掉最後一個字(鄉、鎮、市、區)
                if(tArray[0][i].indexOf(currentID) != -1){
                    arrForPos.push(i); // 加入該位置到陣列
                    arrForStr.push(currentID); // 加入該鄉鎮到陣列
                }
            }
        }
    }

    for(var i = 1; i < arrForPos.length; i++){
        if(arrForPos[i] == arrForPos[i-1]){ // 判斷重複的位置
            arrForPos.splice(i,1); // 刪掉重複的數字
            arrForStr.splice(i,1); // 刪掉重複的位置
            i -= 1; // 因為刪掉元素，所以要返回一個位置
        }
    }

    delExtraTown(arrForPos,tArray); // 刪除不符合的鄉鎮

    for(var i = 0; i < arrForStr.length; i++){
        for(var j = 0; j < allMap[currentMap].length; j++){
            var currentID = allMap[currentMap][j]['id'].slice(0,-1); // 去掉最後一個字(鄉、鎮、市、區)
            if(arrForStr[i] == currentID){ // 找到正確的鄉鎮
                tArray[0][i] = allMap[currentMap][j]['id']; // 改變資料只剩鄉鎮名
            }
        }
    }
    console.log(tArray)
}

 // 刪除不符合的鄉鎮(例:中興分局)
function delExtraTown(arrForPos,tArray){
    var arr = []; // 紀錄不符合的位置
    for(var i = 0; i < tArray[0].length; i++){
        if(arrForPos.includes(i) == false){
            arr.push(i)  // 找到
        }
    }

    for(var i = tArray.length-1; i >= 0 ; i--){
        for(var j = arr.length-1; j >= 0; j--){
            tArray[i].splice(arr[j],1); // 刪除不符合的值
        }
    }
}


 // 計算重複的鄉鎮名稱
function countRepeat(tArray){
    var countTown = tArray[0].reduce((obj, item) => { // 計算出現次數
        if(item in obj){
            obj[item]++; // obj中的values
        }else{
            obj[item] = 1; // obj中的values
        }
        return obj;
    },{})
    return countTown; // type: obj
}


var dealingArray = []; // 多餘的資料已處理
// 處理數值檔
function dealValueFile(tArray){
    var strArray = []; // 記錄找到的鄉鎮列
    var countArray = []; // 記錄每一列找到的鄉鎮欄位數量

    for(var i = 0; i < tArray.length; i++){
        var count = 0;
        for(var j = 0; j < tArray[0].length; j++){
            for(var k = 0; k < allMap[currentMap].length; k++){
                var currentID = allMap[currentMap][k]['id'].slice(0,-1); // 去掉最後一個字(鄉、鎮、市、區)
                if(tArray[i][j].indexOf(currentID) != -1){ // 判斷到鄉鎮(非正確鄉鎮，例:南屯、南，需繼續篩選)
                    count += 1; // 找到加一
                }
            }
        }
        countArray.push(count); // 加入陣列儲存
    }


    for(var w = 0; w < countArray.length; w++){ // 找出出現鄉鎮名稱的列
        if(countArray[w] != 0){
            strArray.push(w); // 找到就加入陣列
        }
    }

    changeRow(tArray,strArray); // 交換欄位並改變鄉鎮名稱

    dealingArray = tArray; // 記錄陣列

    var countForValue = countRepeat(tArray); // 計算重複的鄉鎮資料
    var objectKeys = Object.keys(countForValue); // 矩陣,記錄鄉鎮名
    var sumArray = []; // 記錄各鄉鎮之各欄位總和

    for(var k = 0; k < objectKeys.length; k++){
        for(var i = 1; i < tArray.length; i++){
            var sum = 0; // 計入該鄉鎮的總和
            for(var j = 0; j < tArray[0].length; j++){
                if(tArray[0][j] == objectKeys[k]){ // 找到一樣的縣市
                    sum += parseInt(tArray[i][j]); // 加起來
                }
            }
            sumArray.push(sum)
        }
    }

    var newArray = []; // 新矩陣
    var len = tArray.length - 1; // 一組有len個資料
    newArray.push(objectKeys); // 先加入鄉鎮
    for(var i = 0; i < tArray.length; i++){
        var rowArray = []; // 存取列資料
            for(var k = 0; k < sumArray.length; k++){
                if(k % len == i){ // 分組
                    rowArray.push(sumArray[k])
                }
            }
        newArray.push(rowArray);
    }
    newArray.pop(); // 多建立一行要刪掉
    return newArray;
}

// 判斷空白格
function judgeBlankSpace(InputData){
    for(var i = 0; i < InputData.length; i++){
        for(var j = 0; j < InputData[0].length; j++){
            if(InputData[i][j] == ""){
                return true;
            }
        }
    }
    return false;
}

var skipAlreadyArr = []; // 記錄被刪掉的空白行

// 刪掉空白較多的行
function skipBlank(InputData){
    var arr = []; // 記錄空白格所在的行位置
    for(var i = 0; i < InputData.length; i++){
        for(var j = 0; j < InputData[0].length; j++){
            if(InputData[i][j] == ""){ // 找到空白
                arr.push(j);
            }
        }
    }
    console.log(arr)
    var total_count = arr.reduce((obj,item)=>{ // 計算重複次數
        if(item in obj) {
          obj[item]++;
        }else {
          obj[item] = 1;
        }
        return obj;
    },{})
    console.log(total_count);

    var objectLength = Object.keys(total_count).length; // 總長度
    console.log(typeof(Object.values(total_count)[0]))

    for(var i = objectLength-1; i >= 0; i--){
        for(var j = 0; j < InputData.length; j++){
            if(Object.values(total_count)[i] > 10){ // 同一行超過10個欄位為空白
                InputData[j].splice(Object.keys(total_count)[i],1);
                skipAlreadyArr.push(Object.keys(total_count)[i]); // 有刪除的空白行
                
            }
        }
        
    }

    skipAlreadyArr = Array.from(new Set(skipAlreadyArr)); // 刪除重複的值
    console.log(skipAlreadyArr)

}

var blankArray = []; // 記錄所有空白欄位
// 顯示有空白的欄位位置
function showError(InputData){
    blankDiv.style.visibility = 'visible';
    for(var i = 0; i < InputData.length; i++){
        for(var j = 0; j < InputData[0].length; j++){
            if(InputData[i][j] == ""){ // 找到空白
                var oneBlankArr = []; // 記錄單一空白欄位
                oneBlankArr.push(i); // 列欄位
                oneBlankArr.push(j); // 行欄位
                blankArray.push(oneBlankArr);
            }
        }
    }
    console.log(blankArray)
    // 找出正確的空白欄位位置
    for(var i = blankArray.length-1; i >= 0; i--){
        for(var j = 0; j < skipAlreadyArr.length; j++){
            if((blankArray[i][1]) >= parseInt(skipAlreadyArr[j])){
                blankArray[i][1] += 1;
            }
        }
    }

    console.log(blankArray)
    paging(); // 顯示錯誤訊息並分頁

    console.log(blankArray)

}

var curNumForPaging = 1; // 第幾頁
var curPos = 0; // 目前欄位位置(在blankArray中)
// 顯示錯誤訊息並分頁
function paging(){
    blankDiv.replaceChildren();
    var firSpan = document.createElement('span'); // 標頭
    var secSpan = document.createElement('span'); // 空白位置
    var upPos = document.createElement('span'); // 上一個欄位
    var downPos = document.createElement('span'); // 下一個欄位

    firSpan.textContent = '檔案中有空白欄位，無法讀取';
    secSpan.textContent = '空白位置：';
    upPos.textContent = '上一個欄位資料為：';
    downPos.textContent = '下一個欄位資料為：';

    firSpan.style.fontSize = 22 + 'px';
    firSpan.style.fontWeight = 'bold';
    secSpan.style.color = 'red';

    blankDiv.appendChild(firSpan);
    blankDiv.appendChild(secSpan);
    blankDiv.appendChild(upPos);
    blankDiv.appendChild(downPos);

    var divForPaging = document.createElement('div'); // 顯示頁數與按鈕區塊
    divForPaging.id = 'divForPaging';

    var fraction = document.createElement('div'); // 頁數區塊
    fraction.id = 'fraction';

    var rightBtnForFraction = document.createElement('button'); // 換頁按鈕(下一頁)
    rightBtnForFraction.id = 'rightBtnForFraction';

    var leftBtnForFraction = document.createElement('button'); // 換頁按鈕(上一頁)
    leftBtnForFraction.id = 'leftBtnForFraction';

    fraction.textContent = curNumForPaging + "/" + blankArray.length;
    //console.log(blankArray[0][0])

    var blankSpan = document.createElement('span'); // 顯示空白欄位
    var upColumn = document.createElement('span'); // 顯示上一個欄位
    var downColumn = document.createElement('span'); // 顯示下一個欄位

    blankSpan.textContent = '第' + parseInt(blankArray[curPos][0]+1) + '列，第' + parseInt(blankArray[curPos][1]+1) + '行為空白'; // 第三行顯示空白位置
    if(blankArray[curPos][0]-1 < 0){
        upColumn.textContent = "";
    }else{
        upColumn.textContent = forBlankData[blankArray[curPos][0]-1][blankArray[curPos][1]];
    }

    if(blankArray[curPos][0]+1 > InputData.length-1){
        downColumn.textContent = "";
    }else{
        downColumn.textContent = forBlankData[blankArray[curPos][0]+1][blankArray[curPos][1]];
    }
    

    blankDiv.insertBefore(blankSpan, blankDiv.childNodes[2]);
    blankDiv.insertBefore(upColumn, blankDiv.childNodes[4]);
    blankDiv.insertBefore(downColumn, blankDiv.childNodes[6]);

    divForPaging.appendChild(leftBtnForFraction);
    divForPaging.appendChild(fraction);
    divForPaging.appendChild(rightBtnForFraction);
    blankDiv.appendChild(divForPaging);

    if(curNumForPaging == 1){
        leftBtnForFraction.style.visibility = 'hidden';
    }
    
    rightBtnForFraction.addEventListener('click',changedown);
    leftBtnForFraction.addEventListener('click',changeup);
}

// 下一頁
function changedown(){
    leftBtnForFraction.style.visibility = 'visible'; // 顯示上一頁按鈕
    curNumForPaging += 1; // 位置加一
    curPos += 1; // 位置加一

    if(curNumForPaging >= blankArray.length){ // 超過總頁數
        curNumForPaging = blankArray.length;
        curPos = blankArray.length-1;
        paging(); // 顯示錯誤訊息並分頁
        rightBtnForFraction.style.visibility = 'hidden'; // 隱藏下一頁按鈕
    }else{
        paging();
    }
}

// 上一頁
function changeup(){
    rightBtnForFraction.style.visibility = 'visible'; // 顯示下一頁按鈕
    curNumForPaging -= 1; // 位置減一
    curPos -= 1; // 位置加一

    if(curNumForPaging <= 1){ // 低於最小頁數
        curNumForPaging = 1;
        curPos = 0;
        paging(); // 顯示錯誤訊息並分頁
        leftBtnForFraction.style.visibility = 'hidden'; // 隱藏上一頁按鈕
    }else{
        paging();
    }
}

// 清除所有資料
function clearAll(){
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
    updateChartTypeStyle();
    
}


// 檔案各鄉鎮取加總
function sumFile(){
    var firstCol = InputData[0]; // 記錄欄位名稱
    var countForValue = countRepeat(dealingArray); // 計算重複的鄉鎮資料
    var objectKeys = Object.keys(countForValue); // 矩陣,記錄鄉鎮名
    var sumArray = []; // 記錄各鄉鎮之各欄位總和

    for(var k = 0; k < objectKeys.length; k++){
        for(var i = 1; i < dealingArray.length; i++){
            var sum = 0; // 計入該鄉鎮的總和
            for(var j = 0; j < dealingArray[0].length; j++){
                if(dealingArray[0][j] == objectKeys[k]){ // 找到一樣的縣市
                    sum += parseInt(dealingArray[i][j]); // 加起來
                }
            }
            sumArray.push(sum)
        }
    }

    var newArray = []; // 新矩陣
    var len = dealingArray.length - 1; // 一組有len個資料
    newArray.push(objectKeys); // 先加入鄉鎮
    for(var i = 0; i < dealingArray.length; i++){
        var rowArray = []; // 存取列資料
            for(var k = 0; k < sumArray.length; k++){
                if(k % len == i){ // 分組
                    rowArray.push(sumArray[k])
                }
            }
        newArray.push(rowArray);
    }
    newArray.pop(); // 多建立一行要刪掉
    console.log(newArray)

    var originArray = []; // 將清洗好的陣列還原
    for(var i = 0; i < newArray[0].length; i++){
        var rowArray = [];
        for(var j = 0; j < newArray.length; j++){
            rowArray.push(newArray[j][i]);
        }
        originArray.push(rowArray);
    }

    originArray.unshift(firstCol); // 加入欄位名稱(單位、A1件數)
    InputData = originArray; // 更新InputData

    posForColumnDiv = 0;
    buttonVisible(); // 顯示各式按鈕
    renderColumnSelect(); // 生成欄位下拉式清單
    renderRowSelect();
    renderColumnText(); // 生成欄位名稱區塊(地圖變換用)
    Grouping(); // 分組

    console.log(InputData)
    
}
// 檔案各鄉鎮取平均
function avgFile(){
    var firstCol = InputData[0]; // 記錄欄位名稱
    var countForValue = countRepeat(dealingArray); // 計算重複的鄉鎮資料
    var objectKeys = Object.keys(countForValue); // 矩陣,記錄鄉鎮名
    var objectValues = Object.values(countForValue); // 矩陣，記錄鄉鎮數量
    var sumArray = []; // 記錄各鄉鎮之各欄位總和

    for(var k = 0; k < objectKeys.length; k++){
        for(var i = 1; i < dealingArray.length; i++){
            var sum = 0; // 計入該鄉鎮的總和
            for(var j = 0; j < dealingArray[0].length; j++){
                if(dealingArray[0][j] == objectKeys[k]){ // 找到一樣的縣市
                    sum += parseInt(dealingArray[i][j]); // 加起來
                }
            }
            sumArray.push(sum)
        }
    }

    var newArray = []; // 新矩陣
    var len = dealingArray.length - 1; // 一組有len個資料
    newArray.push(objectKeys); // 先加入鄉鎮
    for(var i = 0; i < dealingArray.length; i++){
        var rowArray = []; // 存取列資料
            for(var k = 0; k < sumArray.length; k++){
                if(k % len == i){ // 分組
                    rowArray.push(sumArray[k])
                }
            }
        newArray.push(rowArray);
    }
    newArray.pop(); // 多建立一行要刪掉

    // 算平均
    for(var k = 0; k < objectValues.length; k++){
        for(var i = 1; i < newArray.length; i++){
            for(var j = 0; j < newArray[0].length; j++){
                if(j == k){
                    newArray[i][j] = parseInt(newArray[i][j]) / parseInt(objectValues[k])
                }
            }
        }
    }
    console.log(newArray)

    var originArray = []; // 將清洗好的陣列還原
    for(var i = 0; i < newArray[0].length; i++){
        var rowArray = [];
        for(var j = 0; j < newArray.length; j++){
            rowArray.push(newArray[j][i]);
        }
        originArray.push(rowArray);
    }

    originArray.unshift(firstCol); // 加入欄位名稱(單位、A1件數)
    InputData = originArray; // 更新InputData

    posForColumnDiv = 0;
    buttonVisible(); // 顯示各式按鈕
    renderColumnSelect(); // 生成欄位下拉式清單
    renderRowSelect();
    renderColumnText(); // 生成欄位名稱區塊(地圖變換用)
    Grouping(); // 分組

    console.log(InputData)

}
// 檔案各鄉鎮取最大值
function maxFile(){
    var firstCol = InputData[0]; // 記錄欄位名稱
    var countForValue = countRepeat(dealingArray); // 計算重複的鄉鎮資料
    var objectKeys = Object.keys(countForValue); // 矩陣,記錄鄉鎮名
    var testArr = []
    
    for(var k = 0; k < objectKeys.length; k++){
        for(var i = 1; i < dealingArray.length; i++){
            var arr = []
            for(var j = 0; j < dealingArray[0].length; j++){
                if(dealingArray[0][j] == objectKeys[k]){ // 找到一樣的縣市
                   arr.push(parseInt(dealingArray[i][j])); // 加起來
                }
            }
            testArr.push(arr)
        }
    }
    console.log(testArr)
}
// 檔案各鄉鎮取最小值
function minFile(){
    
}
    

function renderMap(forBlankData){
    console.log(forBlankData)
    var tArray = [];
    for(var i = 0; i < forBlankData[0].length; i++){
        var rowArray = [];
        for(var j = 1; j < forBlankData.length; j++){
            rowArray.push(forBlankData[j][i]);
        }
        tArray.push(rowArray)
    }

    console.log(tArray)
    console.log(Object.keys(allMap).length)
    console.log(allMap[0].length)
    var allRowArray = [];
    for(var i = 0; i < tArray.length; i++){
        var rowData = [];
        for(var j = 0; j < tArray[0].length; j++){
            for(var w = 0; w < Object.keys(allMap).length; w++){
                for(var k = 0; k < allMap[w].length; k++){
                    var currentID = allMap[w][k]['id'].slice(0,-1);
                    if(tArray[i][j].indexOf(currentID) != -1){
                        rowData.push(allMap[w][k]['id']);
                    }
                }
            }
        }
        allRowArray.push(rowData)
    }
    console.log(allRowArray)
    var countArr = [];
    for(var i = 0; i < allRowArray.length; i++){
        countArr.push(allRowArray[i].length)
    }

    var maxRow = 0;
    var indexRow = 0;
    for(var i = 0; i < countArr.length; i++){
        if(countArr[i] > maxRow){
            maxRow = countArr[i];
            indexRow = i;
        }
    }

    console.log(indexRow)
    console.log(tArray[indexRow])

    var correctArr = [];
    for(var i = 0; i < tArray[indexRow].length; i++){
        var eachTownArr = [];
        for(var w = 0; w < Object.keys(allMap).length; w++){
            for(var k = 0; k < allMap[w].length; k++){
                var currentID = allMap[w][k]['id'].slice(0,-1);
                if(tArray[indexRow][i].indexOf(currentID) != -1){
                    eachTownArr.push(allMap[w][k]['id']);
                }
            }
        }
        eachTownArr = Array.from(new Set(eachTownArr));
        correctArr.push(eachTownArr)
    }
    console.log(correctArr)

    for(var i = correctArr.length-1; i >= 0; i--){
        for(var j = correctArr[0].length-1; j >= 0; j--){
            if(correctArr[i].length > 1){
                if(correctArr[i][j] == '南區' ||
                    correctArr[i][j] == '北區' ||
                    correctArr[i][j] == '東區' ||
                    correctArr[i][j] == '西區' ||
                    correctArr[i][j] == '中區' ){
                    correctArr[i].splice(j,1);
                }
            }
            
        }
    }
    console.log(correctArr)

    var countTownArray = [];
    for(var i = 0; i < correctArr.length; i++){
        for(var j = 0; j < correctArr[i].length; j++){
            for(var w = 0; w < Object.keys(allMap).length; w++){
                for(var k = 0; k < allMap[w].length; k++){
                    var currentID = allMap[w][k]['id'];
                    if(correctArr[i][j].indexOf(currentID) != -1){
                        console.log(1)
                        countTownArray.push(CityName[w]);
                    }
                }
            }
        }
    }
    console.log(countTownArray)
    var newCountTownArr = countTownArray.reduce((obj, item) => { // 計算出現次數
        if(item in obj){
            obj[item]++; // obj中的values
        }else{
            obj[item] = 1; // obj中的values
        }
        return obj;
    },{})

    console.log(newCountTownArr)

    var maxTownCount = 0;
    var maxTown = '';
    for(var i = 0; i < Object.values(newCountTownArr).length; i++){
        if(Object.values(newCountTownArr)[i] > maxTownCount){
            maxTownCount = Object.values(newCountTownArr)[i];
            maxTown = Object.keys(newCountTownArr)[i]
        }
        if(Object.values(newCountTownArr)[i] == Object.values(newCountTownArr)[i+1]){
            maxTownCount = Object.values(newCountTownArr)[i+1];
            maxTown = Object.keys(newCountTownArr)[i+1];
        }
    }
    console.log(maxTown)

    for(var i = 0; i < Object.keys(CityName).length; i++){
        if(Object.values(CityName)[i] == maxTown){
            currentMap = Object.keys(CityName)[i];
            townArea(currentMap);
            changeBackGround(currentMap)
        }
    }
}

