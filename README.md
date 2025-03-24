# Open Data Automated Visualization Web Platform
## About
An effective automative platform to visualize open data and further utilization.
## Abstract
透過[政府開放資料](https://data.gov.tw/)進行制縣地圖之開發，將開放資料清洗，並實踐資料流程自動化（ETL)可視化圖表呈現，預期能透過圖表分析取得各層面成效。<br>
Through the development of county maps through [Open Government Information](https://data.gov.tw/), we will open data cleansing and implement data flow automation (ETL) visualization for graphical presentation, and expect to achieve various levels of effectiveness through graphical analysis.<br>
> 109 NCNU IM graduate project
## Usage
> 以 Docker 快速布建 MongoDB
```
python run.py
```
## Tech Tools
主要使用以下技術進行系統功能開發與使用者介面設計，以 Photoshop 繪製臺灣各鄉鎮縣市地圖，放入 SVG 檔案中，再以技術整合，使繪製的地圖呈現出顏色的變化<br>
- HTML－建立網頁並藉由瀏覽器的讀取，轉換成視覺化的網頁
- CSS－進行網頁的畫面排版與美化
- JavaScript－與前端互動的程式語言，使系統功能多樣化
- Python－撰寫後端的程式語言，便利性高
- Photoshop－繪製地圖並取得點座標
- SVG－縮放向量圖形的檔案格式
- Docker－方便作業系統虛擬化，可迅速地部署 MongoDB
- Flask－網站微框架(microframework)，建置網站自由度高
- MongoDB-非關聯式資料庫(NoSQL)，易於擴展且靈活度大，主要用來儲存作品 Info。
## UI of the platform
![image](https://github.com/Alles1212/-projectIM/assets/82037602/f66fcdfc-4e9b-4a18-8c5b-328a150725b8)
![image](https://github.com/Alles1212/-projectIM/assets/82037602/d911721c-3426-4414-919a-166aa7f9fa8f)
![image](https://github.com/Alles1212/-projectIM/assets/82037602/48f4e2a4-1df4-461d-9491-e1218b338011)
![image](https://github.com/Alles1212/-projectIM/assets/82037602/b957bda0-b561-4fda-8324-9ed3cc00d9ba)
![image](https://github.com/Alles1212/-projectIM/assets/82037602/073bd30e-735b-4e04-86b8-4f5bb7aefa04)
