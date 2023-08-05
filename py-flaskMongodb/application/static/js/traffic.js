window.onload = (function() {
    var towns=
      [{id:"南投市"},{id:"埔里鎮"},{id:"草屯鎮"},{id:"竹山鎮"},{id:"集集鎮"},
       {id:"名間鄉"},{id:"鹿谷鄉"},{id:"中寮鄉"},{id:"魚池鄉"},{id:"國姓鄉"},
       {id:"水里鄉"},{id:"信義鄉"},{id:"仁愛鄉"}];
  
    var townName = document.getElementById("townName"); // 鄉鎮名稱
    var townData = document.getElementById("townData"); // 鄉鎮資料
    var selectMap = document.getElementById("selectMap"); // 選擇縣市的下拉式清單
    var map_Selected = document.getElementById("map_Selected") // 顯示所選的縣市
    var showMax = document.getElementById("Max"); // 最大值之區塊
    var showmin = document.getElementById("min"); // 最小值之區塊
    var showAvg = document.getElementById("avg"); // 平均之區塊
    var currentId = ""; // 當前id
    var dataText = ""; // 空字串,存鄉鎮資料用
    var currentCity = ""; // 目前所選的縣市
  
    var csvForm = document.getElementById('csvForm'); // 拿取html裡面的id的表單的元素
    var csvFileInput = document.getElementById('csvFile'); // 拿取html裡面的id輸入的元素
    var columnSelect = document.getElementById('columnSelect'); // 下拉選單元的名稱
    csvForm.addEventListener('submit', handleFormSubmit); // 表單提交，呼叫 handleFormSubmit
    var chartData; // 用於存儲解析後的 CSV 數據
    var selectedColumnIndex = 0; // 選擇的列索引
    var chartContainer = document.getElementById('chartContainer'); // 用於顯示圖表
    columnSelect.addEventListener('change', handleColumnSelectChange); // 點下下拉選單裡面的值，去做改變
    
    // 選擇縣市對應地圖
    selectMap.addEventListener("change",chooseMap);
    function chooseMap(city){
      var cityValue = city.target.value; // value值(數字)
      currentCity = selectMap.options[cityValue].text; // 縣市名稱
      map_Selected.textContent = "你的選擇是:" + currentCity;
    }
  
    // 找鄉鎮區塊再讓滑鼠改變形狀
    towns.map(function (town) {
      var doms = [].map.call(document.querySelectorAll('[id=' + town.id + ']'), function (ele) { return ele; });
      doms.map(function (dom) {
        dom.style.fill = '#ccddff';
        dom.style.cursor = 'pointer';
        dom.addEventListener('click', showTownName); // 顯示鄉鎮名稱
      });
    });
  
    // 顯示該區塊之鄉鎮名稱
    function showTownName(name){
      currentId = (name.target.id || name.target.textContent).replace(/\d*/g, "");
      townName.textContent = "鄉鎮名稱：" + currentId;
      showTownData(currentId);
    }
  
    
    // 讀取csv，並顯示鄉鎮資料
    function showTownData(currentId){
      d3.csv('https://data.nantou.gov.tw/dataset/7ff9b37b-4067-45d8-aefb-6166e226190d/resource/c4126b32-a305-41d7-baa4-81d2516a511c/download/11203171446.csv').then((data) => {
        var JSON_List = []; // 空陣列
  
        for(var i = 0; i < data.length; i++){ // 將csv資料丟進陣列(JSON形式)
          JSON_List.push(data[i]);
        }
        dataText = JSON.stringify(findData(JSON_List,currentId)); // 將object改成string
        dataText = dataText.replace(/{/g,"").replace(/}/g,"").replace(/"/g,"").replace(/,/g,"、");
        townData.textContent = dataText; // 輸出
      });
    }
  
    // 找出對應的鄉鎮資料
    function findData(JSON_List,currentId){
      var currentId_length = currentId.slice(0,-1).length; // 只取鄉鎮名，不取鄉鎮市區(最後一個字)
      var found = ""; // 找到的鄉鎮資料
  
      for(var i = 0; i < JSON_List.length; i++){ // JSON_List.length: 9
        for(var j = 0; j < Object.values(JSON_List[0]).length; j++){ // Object.values(JSON_List[0]).length: 10
          //if(typeof(Object.values(JSON_List[i])[j]) == "string"){
          if(currentId.slice(0,-1) == Object.values(JSON_List[i])[j].slice(0,currentId_length)){
  
            found = (JSON_List[i]); // 找到的資料
            return found;
          }
        }
      }
    }
  
      //表單提交
      function handleFormSubmit(event) {
          event.preventDefault(); // 停止事件的默認動作
          var file = csvFileInput.files[0]; // 獲取選擇的檔案
          var reader = new FileReader();
          reader.onload = handleFileLoad; // 加載檔案
          reader.readAsText(file); // 將文件讀取爲文本
      }
      //讀取csv
      function handleFileLoad(event) {
          var csvData = event.target.result;
          chartData = parseCSV(csvData); // 陣列
          renderColumnSelect();
          //statistics();
          renderChart();
      }
      //分析csv裡面的資料，並且去除雙引號""
      function parseCSV(csv) {
          var lines = csv.split('\n'); // 每行分組
          var data = [];
          for (var i = 0; i < lines.length; i++) {
              var line = lines[i].trim(); // 删除字符串的頭尾空白符號
              if (line !== '') {
                  var values = line.split(','); // 每列中分組
                  console.log(values)
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
      //下拉選單裡面的資料
      function renderColumnSelect() {
          columnSelect.innerHTML = '';
          var columnNames = chartData[0]; // 欄位名稱
          for (var i = 0; i < columnNames.length; i++) {
              var option = document.createElement('option');
              option.value = i;
              option.text = columnNames[i];
              columnSelect.appendChild(option); // 將節點元素當成最後一個子元素加到父元素
          }
      }
      //下拉選單值改變事件
      function handleColumnSelectChange() {
          selectedColumnIndex = parseInt(columnSelect.value); // 將輸入的字串轉成整數
          renderChart();
      }
      //google charts長條圖
      function renderChart() {
          chartContainer.innerHTML = '';
          //加載 Google Charts 套件的函式
          google.charts.load('current', { packages: ['corechart'] });
          google.charts.setOnLoadCallback(drawChart);
  
          function drawChart() {
              var data = new google.visualization.DataTable();
              data.addColumn('string', 'Name');
              data.addColumn('number', 'Value');
  
              for (var i = 1; i < chartData.length; i++) {
                  var row = chartData[i];
                  data.addRow([row[0].replace(/"/g, ''), parseFloat(row[selectedColumnIndex])]); // 將輸入的字串轉成浮點數
              }
              statistics()
              var options = {
                  width: '100%',
                  height: '100%',
                  bar: { groupWidth: '80%' },
                  legend: { position: 'none' },
                  chartArea: { width: '80%', height: '80%' }//調整圖表區域大小
              };
  
  
              var chart = new google.visualization.ColumnChart(chartContainer);
              chart.draw(data, options);
          }
      }
  
      function statistics(){
          var calArray = []; // 空陣列，存數值
          var townArray = []; // 空陣列，存鄉鎮
          var maxValue = 0; // 最大數值
          var minValue = 0; // 最小數值
          var sum = 0; // 總和
          var average; // 平均
          var maxTown = ""; // 最大數值之鄉鎮
          var minTown = ""; // 最小數值之鄉鎮
  
          for(var i = 1; i < chartData.length-1; i++){ // 第一列為各欄位，不計入計算
              calArray.push(parseInt(chartData[i][selectedColumnIndex])); // 將點選的下拉式欄位之數值加到空陣列
              townArray.push(chartData[i][0]); // 將對應的鄉鎮加到空陣列
          }
          // 將所有要計算的數值先設為每一陣列第一個位置之值
          maxValue = calArray[0];
          minValue = calArray[0];
          maxTown = townArray[0];
          minTown = townArray[0];
  
          for(var i = 0; i < calArray.length; i++){
              if(maxValue < calArray[i]){ // 比大
                  maxValue = calArray[i];
                  maxTown = townArray[i];
              }
              if(minValue > calArray[i]){ // 比小
                  minValue = calArray[i];
                  minTown = townArray[i];
              }
              sum += calArray[i]; // 將陣列之值加總
          }
          average = sum / calArray.length; // 計算平均
  
          showMax.textContent = "最大值👉" + maxTown + ":" + maxValue;
          showmin.textContent = "最小值👉" + minTown + ":" + minValue;
          showAvg.textContent = "平均值👉" + ":" + average;
  
      }
  })();
  