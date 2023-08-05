from flask import Flask
from flask_pymongo import PyMongo
import pymongo #solution
from flask_uploads import UploadSet, IMAGES, configure_uploads
from flask import request
import sys,os
from gridfs import *

app = Flask(__name__)
#設定hex出的值才能用
app.config["SECRET_KEY"] = "186e46fe4c5618948cd2638d8ec0f1b42b38ccea"
conn = "mongodb://localhost:27017/" #alles:1212@
client = pymongo.MongoClient(conn, serverSelectionTimeoutMS=5000)
db = client.user_login_system #針對personal


path = sys.path[0] + os.sep
fs = GridFS(db, collection="upload_test")
# # r'C:\Users\USER\專題\project\py-flaskMongodb\application\static\img_fold'
# app.config['UPLOADED_DEF_DEST'] = r'C:\Users\USER\專題\project\py-flaskMongodb\application\static\img_fold'
# # '\\static\\image_fold\\'
# app.config['UPLOADED_DEF_URL'] = '\\static\\image_fold\\'
# uploadData = UploadSet(name='def', extensions=IMAGES)
# configure_uploads(app,uploadData)

# #setup mongodb
# mongodb_client = PyMongo(app)
# db = mongodb_client.db

from application import routes