
    var rangeDiv = document.getElementById("rangeDiv"); // 範圍區塊(分辨顏色)

    var showMax = document.getElementById("Max"); // 最大值之文字
    var showmin = document.getElementById("min"); // 最小值之文字
    var showAvg = document.getElementById("avg"); // 平均之文字
    var showstD = document.getElementById("stD"); // 平均之文字
    var showSum = document.getElementById("sum"); // 總和之文字
    var showNum = document.getElementById("num"); // 個數之文字
    
    var colArray = []; // 空陣列，存數值
    var townArray = []; // 空陣列，存鄉鎮
    var average = 0; // 平均
    var standard_deviation = 0; // 標準差

    // 摘要統計
    function statistics(){

        var maxValue = 0; // 最大數值
        var minValue = 0; // 最小數值
        var sum = 0; // 總和
        var maxTown = ""; // 最大數值之鄉鎮
        var minTown = ""; // 最小數值之鄉鎮
        var stD_sum = 0; // 總和,計算標準差用
        var num = 0; // 總數

        colArray = []; // 重製矩陣
        townArray = []; // 重製矩陣

        for(var i = 1; i < InputData.length; i++){ // 第一列為各欄位，不計入計算
            colArray.push(parseInt(InputData[i][selectedColumnIndex])); // 將點選的下拉式欄位之數值加到空陣列
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

        showMax.textContent = "最大值" + maxTown + ":" + maxValue;
        showmin.textContent = "最小值" + minTown + ":" + minValue;
        showAvg.textContent = "平均值" + average.toFixed(2); // 限制在小數第二位
        showstD.textContent = "標準差" + standard_deviation.toFixed(2); // 限制在小數第二位
        showSum.textContent = "總和 "  + sum;
        showNum.textContent = "個數 "  + num;

        appearRange();

    }


    // 依平均與標準差顯示數字範圍
    function appearRange(){
        rangeDiv.replaceChildren(); // 清除原本的所有元素
        rangeDiv.style.visibility = 'visible';
        
        average = parseFloat(average.toFixed(2)); // 限制在小數第二位
        standard_deviation = parseFloat(standard_deviation.toFixed(2)); // 限制在小數第二位
        
        var rangeArray = [parseFloat(average + standard_deviation * 3).toFixed(2),
                          parseFloat(average + standard_deviation * 2).toFixed(2),
                          parseFloat(average + standard_deviation * 1).toFixed(2),
                          parseFloat(average).toFixed(2),
                          parseFloat(average - standard_deviation * 1).toFixed(2),
                          parseFloat(average - standard_deviation * 2).toFixed(2),
                          parseFloat(average - standard_deviation * 3).toFixed(2),
                        ]
        var inputColorPos = 0; // 在輸入的顏色陣列中的位置
        for(var i = 0; i < rangeArray.length; i++){
            if(i == rangeArray.length - 1){ // 讀到倒數第二個值就終止
                break;
            }
            var span = document.createElement('span');
            span.textContent = rangeArray[i+1] + ' ~ ' + rangeArray[i]; // 顯示文字(數值)
            span.style.backgroundColor = redDiv1[inputColorPos] // 設定背景顏色
           
            rangeDiv.appendChild(span);
            inputColorPos += 1; // 下一個位置
            
        }
        chooseMap()
    }

    // 生成顏色
    function renderColor(attr,svg_Polygon,i){
        var rangeArray = [parseFloat(average + standard_deviation * 3).toFixed(2),
            parseFloat(average + standard_deviation * 2).toFixed(2),
            parseFloat(average + standard_deviation * 1).toFixed(2),
            parseFloat(average).toFixed(2),
            parseFloat(average - standard_deviation * 1).toFixed(2),
            parseFloat(average - standard_deviation * 2).toFixed(2),
            parseFloat(average - standard_deviation * 3).toFixed(2),]
        var townID = allMap[attr][i]['id']; // 該鄉鎮id
        var townIDName = townID.slice(0,-1); // 刪掉最後一個字(鄉、鎮、市、區)

        svg_Polygon.style.fill = redDiv1[6]; // 無數值之地區顏色
        for(var j = 0; j < townArray.length; j++){
            if(townArray[j].indexOf(townIDName) != -1){
                var currentValue = parseInt(colArray[j]); // 當前數值
                if(currentValue <= rangeArray[0] & currentValue >= rangeArray[1]){ // 設定顏色
                    svg_Polygon.style.fill = redDiv1[0];
                }else if(currentValue <= rangeArray[1] & currentValue >= rangeArray[2]){
                    svg_Polygon.style.fill = redDiv1[1];
                }else if(currentValue <= rangeArray[2] & currentValue >= rangeArray[3]){
                    svg_Polygon.style.fill = redDiv1[2];
                }else if(currentValue <= rangeArray[3] & currentValue >= rangeArray[4]){
                    svg_Polygon.style.fill = redDiv1[3];
                }else if(currentValue <= rangeArray[4] & currentValue >= rangeArray[5]){
                    svg_Polygon.style.fill = redDiv1[4];
                }else if(currentValue <= rangeArray[5] & currentValue >= rangeArray[6]){
                    svg_Polygon.style.fill = redDiv1[5];
                }
            }
        }
    }
    var basisColor = ['red','orange','yellow','green','blue','purple']
    function chooseColor(attr,svg_Polygon,i){
        var colorDiv = document.getElementById('colorDiv');
        colorDiv.replaceChildren();
        colorDiv.style.visibility = 'visible'

        for(var i = 0; i < basisColor.length; i++){
            var btn = document.createElement('button');
            btn.style.position = 'relative';
            btn.style.width = 20 + 'px';
            btn.style.height = 20 + 'px';
            btn.style.left = 5 + 'px';
            btn.style.background = basisColor[i];
            btn.id = i

            if(i == 3){
                var br = document.createElement('br');
                colorDiv.appendChild(br)
            }
            colorDiv.appendChild(btn);

            var btnId = document.getElementById(i)
            btnId.addEventListener('click',changeColor)
        }
    }
    function changeColor(e){
        var currentColorID = e.target.id // 當前被點到的顏色塊

        redDiv1 = allColor[currentColorID];
        console.log(redDiv1)
    }
    




  



    

    

    