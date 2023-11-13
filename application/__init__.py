from flask import Flask
from flask_pymongo import PyMongo
import pymongo #solution
from flask_uploads import UploadSet, IMAGES, configure_uploads
from flask import request
from flask_cors import CORS #pip install Flask-Cors
import sys,os
from gridfs import *

app = Flask(__name__,template_folder='templates')
CORS(app)#test 允許所有route上的所有網域進行CORS(同源政策)
#設定hex出的值才能用
app.config["SECRET_KEY"] = "186e46fe4c5618948cd2638d8ec0f1b42b38ccea"
conn = "mongodb://localhost:27017/" #alles:1212@
client = pymongo.MongoClient(conn, serverSelectionTimeoutMS=5000)
db = client.user_login_system #針對personal
db_graph = client.graph_data#圖片的儲存


path = sys.path[0] + os.sep
print(path)
fs = GridFS(db_graph, collection="upload_graph")

from application import routes#重要,位置要放好
