	var downloadAll = document.getElementById('downloadAll'); // 選擇下載按鈕

	downloadAll.addEventListener('click',chooseDownload);

	var downloadExist = false;
	// 選擇下載方式
	function chooseDownload(){

		if(downloadExist){
			document.getElementById('downloadDivBackDrop').style.visibility = 'visible';
		}else{
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
				downloadDivBackDrop.style.visibility = 'hidden';
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
			});

			downloadExist = true;
		}
	}
	
	// 匯出jpg
	function exportJpgFile(){
		var originHeight = window.getComputedStyle(document.getElementById('all')).getPropertyValue('height');
		document.getElementById('all').style.height = 700 + 'px';
		suBoxForButtons.style.visibility = 'hidden';

		JpgFile('all');

		document.getElementById('all').style.height = originHeight;
		document.getElementById('downloadDivBackDrop').style.visibility = 'hidden';
	}

	function JpgFile(id){
		html2canvas(document.getElementById(id)).then(canva => {
			// document.body.appendChild(canva);
		
			a = document.createElement('a');
			a.href = canva.toDataURL("image/jpeg",0.92).replace("image/jpeg", "image/octet-stream");

			a.download = 'image.jpg';
			a.click();
		});

		
	}

	// 下載xlsx
	function exportXlsxFile() {
		document.body.removeChild(downloadDivBackDrop); // 刪除下載區塊
		var mapArray = [townName.textContent];
		var statArray = [showMax.textContent.slice(4,showMax.textContent.length),showmin.textContent.slice(4,showmin.textContent.length),
							showAvg.textContent.slice(4,showAvg.textContent.length),showstD.textContent.slice(4,showstD.textContent.length),
							showSum.textContent.slice(3,showSum.textContent.length),showNum.textContent.slice(3,showNum.textContent.length)
						];
		
		var filename = 'download.xlsx'; // 檔名

		var sheetname = 'test'; // 表名

		// 測試資料
		var data = [
			['縣市名稱：', mapArray], // 鄉鎮名稱
			[], // 換行
			['檔案名稱：', fileNameDiv.textContent], // 檔案名稱
			['欄位名稱：', columnNameDiv.textContent], // 檔案欄位名稱
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
	



  




		
