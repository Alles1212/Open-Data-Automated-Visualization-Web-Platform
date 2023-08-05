from application import app, db, path, fs
from flask import render_template, flash, request, url_for, redirect, send_from_directory, session
from functools import wraps
from .forms import TodoForm
from datetime import datetime
import datetime
from werkzeug.utils import redirect, secure_filename
from bson import ObjectId
import gridfs
import os
from flask_wtf import FlaskForm
from wtforms import SubmitField
from flask_wtf.file import FileField, FileAllowed, FileRequired
from application.user import routesUser
# from flask_pymongo import PyMongo
# import pymongo

#Decorators要先有這個動作(登入)
def login_required(f):
  @wraps(f)
  def wrap(*args, **kwargs):
    if 'logged_in' in session:
      return f(*args, **kwargs)
    else:
      return redirect('/')
  
  return wrap

@app.route("/")#登入&註冊頁面
def home():
    return render_template("home.html")

@app.route("/dashboard/")#登入後畫面(選擇登出或進入平台)
@login_required
def dashboard():
    return render_template("dashboard.html")

@app.route("/get_todos")#取得個人存在DB中資料 collections
def get_todos():
    todos = []
    for todo in db.member_flask.find().sort("data_created", -1):
        todo["_id"] = str(todo["_id"])
        todo["date_created"] = todo["date_created"].strftime("%b %d %Y %H:%M")
        todos.append(todo)
    return render_template("view_todos.html", title = "Layout_page", todos = todos)


@app.route("/add_todo", methods=["POST", "GET"])#新增
def add_todo():
    if request.method == "POST":
        form = TodoForm(request.form)
        todo_name = form.name.data
        todo_description = form.description.data
        completed = form.completed.data

        db.member_flask.insert_one({
            "name": todo_name,
            "description": todo_description,
            "completed": completed,
            "date_created": datetime.datetime.now(datetime.timezone.utc)
        })
        flash("資料已加入", "success")
        return redirect("/get_todos")
    else:
        form = TodoForm()
    return render_template("add_todo.html", form = form)


@app.route("/update_todo/<id>", methods= ["POST", "GET"])#修改

def update_todo(id):
    if request.method == "POST":
        form = TodoForm(request.form)
        todo_name = form.name.data
        todo_description = form.description.data
        completed = form.completed.data

        db.member_flask.find_one_and_update({"_id": ObjectId(id)}, {"$set": {
            "name": todo_name,
            "description": todo_description,
            "completed": completed,
            "date_created": datetime.datetime.now(datetime.timezone.utc)
        }})

        flash("資料已更新", "success")
        return redirect("/get_todos") #重新抓取collections
    
    else:
        form = TodoForm()

        todo = db.member_flask.find_one({"_id": ObjectId(id)}) #Collections.find_one_or_404
        form.name.data = todo.get("name", None)
        form.description.data = todo.get("description", None)
        form.completed.data = todo.get("completed", None)

    return render_template("add_todo.html", form = form)

@app.route("/delete_todo/<id>")#刪除
def delete_todo(id):
    db.member_flask.find_one_and_delete({"_id": ObjectId(id)})
    flash("資料已刪除", "success")
    return redirect("/get_todos")

# #還沒寫
# @app.route('/upload_wtf/', methods=['GET', 'POST'])#flask_upload test
# def upload_wtf():
#     form = FormUploads()
#     if form.validate_on_submit():
#         file_name = uploadData.save(form.btn_uploads.data)#利用UploadSet.save取,不用request
#         file_url = uploadData.url(file_name)#利用UploadSet.url取得路徑
#         print(file_name, file_url)
#         return render_template('file_upload.html', form=form, file_url=file_url)
#     else:
#         file_url=None
#     return render_template('file_upload.html', form=form, file_url = file_url)

@app.route('/restore_todo')#儲存處理後的資料
def restore_todo():
    # html_mapVal_str = "genGraph.html"
    # soup = BeautifulSoup(html_str, 'html.parser')
    # div_ele = soup.find(id = "selectMap")
    # print(div_ele.text)
    # # selectMap.value
    return 0

@app.route('/download_todo')#下載
def download_todo():
    for cursor in fs.find():
        file_name = cursor.file_name
        content = cursor.read()
        with open(path + "temp/" + file_name, "wb") as f:
            f.write(content)
    flash("資料已下載", "success")
    return redirect("/get_todos")

@app.route('/gen_graph')#前端操作產圖
def gen_graph():
    return render_template("genGraph.html")