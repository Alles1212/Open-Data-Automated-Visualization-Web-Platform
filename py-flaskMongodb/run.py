# from flask import Flask#load Flask
# app = Flask(__name__) #construct application

# #建立網站首頁回應方式
# @app.route("/")
# def index():#用來回應網站首頁連線的函式
#     return "Hello Flask" #回傳網站首頁的內容

# # activate server
# app.run()
from application import app, db
import os

if __name__ == "__main__":
    app.run()