//import {Taiwan,New_Taipei,Taipei,Keelung,Taoyuan,Hsinchu_County,Hsinchu_City,Miaoli,Taichung,Chiayi_County,Chiayi_City,Yilan,Nantou} from './coordinate.js';



window.onload = (function() {
    var selectMap = document.getElementById("selectMap"); // 選擇縣市的下拉式清單
    var svgDiv = document.getElementById("svgDiv"); // 放置svg的區塊
    var colorBtn = document.getElementById('colorBtn');

    selectMap.addEventListener("change",chooseMap);
    svgDiv.addEventListener('click',showTownName); // 滑鼠點擊時觸發
    svgDiv.addEventListener('mousemove',suspendBox); // 滑鼠移動到開區域時觸發
});

    var map_Selected = document.getElementById("map_Selected") // 顯示所選的縣市
    var townName = document.getElementById("townName"); // 鄉鎮名稱
    var suBox = document.getElementById("suBox"); // 懸浮區塊

    // 顯示該區塊之鄉鎮名稱
    function showTownName(name){
        var currentId = (name.target.id);
        townName.textContent = "鄉鎮名稱：" + currentId;
        
    }

    // 懸浮框,顯示名稱與資料
    function suspendBox(d){
        suBox.replaceChildren(); // 當滑鼠移動時,刪除原本的文字(名稱)

        // 設定懸浮框位置
        suBox.style.top = d.pageY - 50 + 'px';
        suBox.style.left = d.pageX - 90 + 'px';
        suBox.style.display = 'block';
        
        var title = document.createElement('span'); // 建立名稱,顯示在懸浮框
        title.style.display = 'flex';
        title.style.justifyContent = 'center';
        title.textContent = d.target.id;

        if(title.textContent == ""){ // 滑鼠超出地圖範圍時,不顯示懸浮框
            suBox.style.display = 'none';
        }
        
        suBox.appendChild(title);
    }
    
    // 選擇縣市對應地圖
    var currentCity = ""; // 目前所選的縣市
    function chooseMap(){
        townName.textContent = "選擇鄉鎮" + ""; // 換縣市時清空原本顯示的鄉鎮
        var cityValue = selectMap.value; // value值(數字)
        currentCity = selectMap.options[cityValue].text; // 縣市名稱
        map_Selected.textContent = "你的選擇是:" + currentCity;

        svgDiv.replaceChildren(); // 點擊其他選項時刪除原本svg
        for(var attr in allMap){
            if(cityValue == attr){ // 點選下拉式清單對應該縣市地圖
                townArea(cityValue,attr)
            }
        }
    }
    var redDiv1 = ['#800000','#A80000','#D10000','#FF0000','#FF5959','#FFABAB','#FFD4D4']
    var redDiv = ['#800000','#A80000','#D10000','#FF0000','#FF5959','#FFABAB','#FFD4D4']
    var orangeDiv = ['#805300','#A86E00','#D18800','#FFA600','#FFC559','#FFE1AB','#FFF0D4']
    var yellowDiv = ['#808000','#A8A800','#D1D100','#FFFF00','#FFFF59','#FFFFAB','#FFFFD4']
    var greenDiv = ['#008000','#00A800','#00D100','#00FF00','#59FF59','#ABFFAB','#D4FFD4']
    var blueDiv = ['#008080','#00A8A8','#00D1D1','#00FFFF','#59FFFF','#ABFFFF','#D4FFFF']
    var purpleDiv = ['#4A0080','#6100A8','#7900D1','#9300FF','#B959FF','#DBABFF','#EDD4FF']
    var allColor = [redDiv,orangeDiv,yellowDiv,greenDiv,blueDiv,purpleDiv]
 
    // 印出地圖
    function townArea(cityValue,attr){
        var svg_SVG = createSvg('svg',{'xmlns':svgNS,'width':'600px','height':'550px'}); // svg圖片(背景)
        var svg_G = createSvg('g',{'cursor':'pointer'}); // 容器
        for(var i = 0; i < allMap[attr].length; i++){ // 讀座標
            var svg_Polygon = createSvg('polygon',allMap[attr][i]); // 多邊形
            svg_G.appendChild(svg_Polygon);

            if(InputData.length != 0){ // 傳送檔案後才會生成顏色
                
                colorBtn.style.visibility = 'visible';
                colorBtn.addEventListener('click',chooseColor);
                renderColor(attr,svg_Polygon,i) // 生成顏色(在 Statis&Color.js)
            }
        }
        
        for(var index in viewbox){
            if(cityValue == index){
                svg_SVG.setAttribute('viewBox',viewbox[index]); // 設定地圖大小 
            }
        }
        svg_SVG.appendChild(svg_G);
        svgDiv.appendChild(svg_SVG);
        
    }
    
    // 建立svg
    var svgNS = "http://www.w3.org/2000/svg"; // xmlns(svg屬性)
    function createSvg(tag, objArray){
        var current_tag = document.createElementNS(svgNS, tag); // 創建新元素
        for(var arr in objArray){
            current_tag.setAttribute(arr, objArray[arr]); // 設定屬性
        }
        return current_tag;
    }
    


