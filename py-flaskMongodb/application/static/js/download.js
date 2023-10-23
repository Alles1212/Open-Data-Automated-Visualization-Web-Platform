	var downloadAll = document.getElementById('downloadAll'); // 選擇下載按鈕

	downloadAll.addEventListener('click',chooseDownload);

	// 選擇下載方式
	function chooseDownload(){
		var downloadDivBackDrop = document.createElement('div'); // 建立下載按鈕選擇區塊的背景區塊
		downloadDivBackDrop.id = 'downloadDivBackDrop';

		var downloadDiv = document.createElement('div'); // 建立下載按鈕選擇區塊
		downloadDiv.id = 'downloadDiv';

		var downloadXLSX = document.createElement('button'); // 下載CSV按鈕(預留)
		var downloadJPG = document.createElement('button'); // 下載JPG按鈕
		var cancelDownload = document.createElement('button'); // 下載JPG按鈕

		downloadXLSX.id = 'downloadXLSX';
		downloadJPG.id = 'downloadJPG';
		cancelDownload.id = 'cancelDownload';

		downloadXLSX.addEventListener('click', exportXlsxFile); // 選擇下載XLSX
		downloadJPG.addEventListener('click', exportJpgFile); // 選擇下載JPG

		cancelDownload.addEventListener('click',function(){ // 點擊取消按鈕
			document.body.removeChild(downloadDivBackDrop); // 刪除下載區塊
		});

		downloadDiv.appendChild(downloadXLSX);
		downloadDiv.appendChild(downloadJPG);
		downloadDiv.appendChild(cancelDownload);
		downloadDivBackDrop.appendChild(downloadDiv);
		document.body.appendChild(downloadDivBackDrop);

		downloadXLSX.addEventListener('mousemove',createButtonSuspendBox); // 滑鼠進入按鈕

		downloadXLSX.addEventListener('mouseout',function(){  // 滑鼠離開按鈕
    		suBoxForButtons.style.visibility = 'hidden';
		})
		downloadJPG.addEventListener('mousemove',createButtonSuspendBox); // 滑鼠進入按鈕

		downloadJPG.addEventListener('mouseout',function(){  // 滑鼠離開按鈕
    		suBoxForButtons.style.visibility = 'hidden';
		})
		
	}
	
	// 匯出jpg
	function exportJpgFile(){
		JpgFile('all');
		document.body.removeChild(downloadDivBackDrop); // 刪除下載區塊
	}

	function JpgFile(id){
		html2canvas(document.getElementById(id)).then(canva => {
			document.body.appendChild(canva);
		
			a = document.createElement('a');
			a.href = canva.toDataURL("image/jpeg",0.92).replace("image/jpeg", "image/octet-stream");

			a.download = 'image.jpg';
			a.click();
		});

		
	}

    // // 匯出csv
	// function exportCsvFile(){
	// 	html2canvas(document.getElementById("showSvg")).then(function (canvas){ // 擷取區塊
	// 		var imageCode = canvas.toDataURL("image/jpeg", 0.92).replace("image/jpeg", "image/octet-stream");
	// 		csv(imageCode); // 將圖片變為 base64 編碼
	// 	});

	// 	function csv(imageCode){
	// 		var data = getData(); // 建立資料
	// 		var blob = new Blob([data + '\n' + imageCode], { // 藉型別陣列建構的 blob 來建立 URL
	// 		type : "data:text/csv;charset=utf-8",
	// 		});
	// 		var href = URL.createObjectURL(blob); // 從 Blob 取出資料
	// 		console.log(href)
	// 		var link = document.createElement("a");
	// 		link.href = href; // 設定herf
	// 		link.download = "OpenData.csv"; // 匯出的檔名
	// 		document.body.appendChild(link);
	// 		link.click(); // 透過建立的 a 連結所產生的點擊事件
	// 	}
	// }
	// var test1 = map_Selected.textContent.slice(5,map_Selected.textContent.length)
	
	// // 要匯出的資料
	// function getData() {
	// 	var totalDiv; // 所有資料

	// 	var mapSelected = map_Selected.textContent.slice(5,map_Selected.textContent.length); // 縣市名稱
	// 	var TownName = townName.textContent.slice(5,townName.textContent.length); // 鄉鎮名稱
	// 	var TownData = townData.textContent.slice(5,townData.textContent.length); // 鄉鎮資料
	// 	var chooseMap_header = "\ufeff縣市名稱,鄉鎮名稱,鄉鎮資料\n"; // 地圖標題
	// 	var chooseMap_array = [mapSelected, TownName, TownData];
	// 	var chooseMap_data = chooseMap_array.join(','); // 以逗號連接
	// 	var chooseMap_div = chooseMap_header + chooseMap_data; // 標題加資料

	// 	var columnName = '欄位名稱：' + columnNameArray[0]; // 當前欄位名稱
	// 	var TownArray = townArray.join(","); // 鄉鎮
	// 	var ColArray = colArray.join(","); // 數值
	// 	var chart_array = [columnName, TownArray, ColArray]
	// 	var chart_div = chart_array.join("\n"); // 以換行連接

	// 	var ShowMax = showMax.textContent.slice(4,showMax.textContent.length); // 最大值之文字
	// 	var Showmin = showmin.textContent.slice(4,showmin.textContent.length); // 最小值之文字
	// 	var ShowAvg = showAvg.textContent.slice(4,showAvg.textContent.length); // 平均值之文字
	// 	var ShowstD = showstD.textContent.slice(4,showstD.textContent.length); // 標準差之文字
	// 	var ShowSum = showSum.textContent.slice(3,showSum.textContent.length); // 總和之文字
	// 	var ShowNum = showNum.textContent.slice(3,showNum.textContent.length); // 個數之文字
	// 	var statistic_header = "最大值,最小值,平均值,標準差,總和,個數\n"; // 摘要統計標題
	// 	var statistic_array = [ShowMax, Showmin, ShowAvg, ShowstD, ShowSum, ShowNum];
	// 	var statistic_data = statistic_array.join(','); // 以逗號連接
	// 	var statistic_div = statistic_header + statistic_data; // 標題加資料
		
	// 	totalDiv = [chooseMap_div + "\n", chart_div + "\n", statistic_div  + "\n"].join("\n") // 加入換行符號
	// 	console.log(totalDiv)
		
	// 	return totalDiv;
	// }

	
	// 下載xlsx
	function exportXlsxFile() {
		document.body.removeChild(downloadDivBackDrop); // 刪除下載區塊
		var mapArray = [townName.textContent.slice(5,townName.textContent.length),
					   ];
		var chartArray = ['欄位名稱：' + columnNameArray[0]];
		var statArray = [showMax.textContent.slice(4,showMax.textContent.length),showmin.textContent.slice(4,showmin.textContent.length),
							showAvg.textContent.slice(4,showAvg.textContent.length),showstD.textContent.slice(4,showstD.textContent.length),
							showSum.textContent.slice(3,showSum.textContent.length),showNum.textContent.slice(3,showNum.textContent.length)
						];
		
		var filename = 'download.xlsx'; // 檔名

		var sheetname = 'test'; // 表名

		// 測試資料
		var data = [
			['縣市名稱'], // 地圖標題
			mapArray, // 地圖區塊資料
			[], // 換行
			chartArray, // 圖表標題
			townArray, // 鄉鎮名稱
			colArray, // 鄉鎮資料
			[], // 換行
			['最大值','最小值','平均值','標準差','總和','個數'], // 統計標題
			statArray, // 統計資料
			[], // 換行		
		];

		downloadxlsx(filename, sheetname, data); // 下載
			
	}
	
    //儲存xlsx檔
	function downloadxlsx(filename, sheetname, data) {

		function sheet_from_array_of_arrays(data, opts) {
			var ws = {};
			var range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
			for (var R = 0; R != data.length; ++R) {
				for (var C = 0; C != data[R].length; ++C) {
					if (range.s.r > R) range.s.r = R;
					if (range.s.c > C) range.s.c = C;
					if (range.e.r < R) range.e.r = R;
					if (range.e.c < C) range.e.c = C;
					var cell = { v: data[R][C] };
					if (cell.v == null) continue;
					var cell_ref = XLSX.utils.encode_cell({ c: C, r: R });

					if (typeof cell.v === 'number') cell.t = 'n';
					else if (typeof cell.v === 'boolean') cell.t = 'b';
					else if (cell.v instanceof Date) {
						cell.t = 'n'; cell.z = XLSX.SSF._table[14];
					}
					else cell.t = 's';

					ws[cell_ref] = cell;
				}
			}
			if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
			return ws;
		}

		//s2ab
		function s2ab(s) {
			var buf = new ArrayBuffer(s.length);
			var view = new Uint8Array(buf);
			for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
			return buf;
		}

		//Workbook
		function Workbook() {
			if (!(this instanceof Workbook)) return new Workbook();
			this.SheetNames = [];
			this.Sheets = {};
		}

		//write
		var wb = new Workbook(); // 新工作簿
		var ws = sheet_from_array_of_arrays(data); // 內容資料

		wb.SheetNames.push(sheetname);
		wb.Sheets[sheetname] = ws;

		var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
		saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), filename);
	}
	



  




		
