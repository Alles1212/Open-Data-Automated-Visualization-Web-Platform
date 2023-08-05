function analyze(InputData){
    

    var tArray = []; //存轉置後的矩陣
    var posArray = []; // 存找到總計值的位置(每一列)

    for(var i = 0; i < InputData[0].length; i++){
        var rowArray = [];
        for(var j = 1; j < InputData.length; j++){
            rowArray.push(InputData[j][i]);
        }
        tArray.push(rowArray)
    }

    for(var i = 0; i < tArray.length; i++){
        var sum = 0; // 計算每一列總和
        for(var j = 0; j < tArray[0].length; j++){
            sum += parseInt(tArray[i][j]);
            if(sum == tArray[i][j+1]){ // 下一個位置為總計值
                posArray.push(j+1);
            }
        }
    }
    
    posArray.sort(); // 由小到大排列
    
    var countArray = posArray.reduce((arr,item)=>{ // 計算該位置出現的次數
        if(item in arr){ // 如果有重複就加一
            arr[item] += 1;
        }else {
            arr[item] = 1;
        }
        
          return arr},{}) // 回傳次數陣列
          
    var keysArray = Object.keys(countArray) // 鍵
    var valuesArray = Object.values(countArray); // 值

    for(var i = 0; i < valuesArray.length; i++){
        if(valuesArray[i] < valuesArray[i+1]){ // 如果有位置較小的就刪掉
            valuesArray.shift(); // 刪除值
        }
        keysArray.shift(); // 鍵同步刪除
    }

    keysArray.sort((a,b) => b-a);  // 由大到小排列

    for(var i = 0; i < tArray.length; i++){
        for(var j = 0; j < keysArray.length; j++){
            tArray[i].splice(keysArray[j],1); // 刪除為統計值的列
        }
    }

    var originArray = []; // 將清洗好的陣列再轉置
    for(var i = 0; i < tArray[0].length; i++){
        var rowArray = [];
        for(var j = 0; j < tArray.length; j++){
            rowArray.push(tArray[j][i]);
        }
        originArray.push(rowArray)
    }
    originArray.unshift(InputData[0]); // 加入欄位名稱(單位、A1件數)

    return originArray;

}


