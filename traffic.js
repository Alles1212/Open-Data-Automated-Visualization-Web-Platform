(function() {
  var towns=
    [{id:"南投市"},{id:"埔里鎮"},{id:"草屯鎮"},{id:"竹山鎮"},{id:"集集鎮"},
     {id:"名間鄉"},{id:"鹿谷鄉"},{id:"中寮鄉"},{id:"魚池鄉"},{id:"國姓鄉"},
     {id:"水里鄉"},{id:"信義鄉"},{id:"仁愛鄉"}];
  // var stations=[{id:"南投分局"},{id:"中興分局"},{id:"仁愛分局"},{id:"信義分局"},{id:"埔里分局"},
  //    {id:"草屯分局"},{id:"竹山分局"},{id:"集集分局"}];
  var townName = document.getElementById("t");
  var currentId = "";
  // var curNum = "";
  // var sumData = document.getElementById("sumData");

  // 找鄉鎮區塊再讓滑鼠改變形狀
  towns.map(function (town) {
    var doms = [].map.call(document.querySelectorAll('[id=' + town.id + ']'), function (ele) { return ele; });
    doms.map(function (dom) {
      dom.style.fill = '#fff';
      dom.style.cursor = 'pointer';
      dom.addEventListener('click', showTowmName);
      // dom.addEventListener('click',showAccident);
    });
  });

  // // 找鄉鎮區塊再讓滑鼠改變形狀
  // stations.map(function (station) {
  //   var doms = [].map.call(document.querySelectorAll('[id=' + station.id + ']'), function (ele) { return ele; });
  //   doms.map(function (dom) {
  //     dom.style.fill = '#fff';
  //     dom.style.cursor = 'pointer';
  //     dom.addEventListener('click',showAccident);
  //   });
  // });
  // 顯示該區塊之鄉鎮名稱
  function showTowmName(name){
    currentId = (name.target.id || name.target.textContent).replace(/\d*/g, "");
    townName.textContent = currentId;
  }
  // //顯示交通事故件數
  // function showAccident(num){
  //   curNum = (num.target.id || num.target.textContent).replace(/\d*/g, "");
  //   console.log(sumData);
  //   sumData.textContent = curNum;
  // }
  // 讀取csv
  d3.csv('https://data.nantou.gov.tw/dataset/7ff9b37b-4067-45d8-aefb-6166e226190d/resource/c4126b32-a305-41d7-baa4-81d2516a511c/download/11203171446.csv').then((data) => {
    console.log(data);
    console.log(data.length);
    console.log(data[1]);
    console.log(data[0]["總計件數"]);
    sumData = (data[0]["總計件數"]);
    // for(let i = 0; i < data.length; i++){
    
    // }
  })
  console.log(sumData)
})();