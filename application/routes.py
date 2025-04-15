from application import app, db
from flask import render_template, flash, request, url_for, redirect, session, request, jsonify
from functools import wraps
from .forms import TodoForm
from datetime import datetime
import datetime
from werkzeug.utils import redirect
from bson import ObjectId
from application.user import routesUser
import json
import requests
#generate html
from jinja2 import Environment, FileSystemLoader
import webbrowser
import csv
from io import StringIO, BytesIO
import chardet



@app.route("/receiver", methods=['POST'])
def get_post():#取得前端的json資料
    if request.method == 'POST':
        data = request.get_json()
        return redirect(url_for("add_todo", data=data))
    return render_template("add_todo.html")

@app.route("/handleApi", methods=['GET', 'POST'])
def handleCORS():#headers problem
    data = request.json#前端傳來的
    print(data)#應該為網址
    url = data.get("api_url")
    print(url)

    #GET request , request的data contain了BOM(指定emcode為'utf-8-sig'不行), headers={'Accept-Encoding': 'utf-8-sig'}
    response = requests.get(url, timeout=5,verify=False)# headers={'Accept-Encoding': 'utf-8-sig'}
    encoding = chardet.detect(response.content)['encoding']
    response.encoding = response.apparent_encoding#auto check encode
    content = response.content.decode(encoding)#.decode('utf-8-sig')#use 'utf-8-sig' decode
    # content = response.text
    # content = response.content.decode('utf-8-sig')
    #print(content)
    #將context轉類文件
    csv_file = StringIO(content)
    #解析csv data
    csv_reader = csv.reader(csv_file)
    for row in csv_reader:
        print(row)#\uteff
    csv_file.seek(0)
    csv_data = list(csv_reader) #obtain csv data
    print(csv_data)
    # if content.startswith(b'\xef\xbb\xbf'):  # check whether header is UTF-8 BOM
    #     content = content[3:]

    #check status
    if response.status_code == 200:
        try:
            response.raise_for_status()
            # return content
            return jsonify({'data': csv_data})
        except requests.exceptions.RequestException as e:
            # handle exception
            print(f"Error occur!:{e}")
            return jsonify({'error': str(e)})
    else:
        return jsonify({'error': 'Failed to fetch data'})

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
@login_required
def get_todos():
    todos = []
    image_names = []
    for todo in db.member_flask.find().sort("data_created", -1):
        if todo["UserId"] == session['user']['_id']:#test 當前登入者的_id = session['user']['_id']
            todo["_id"] = str(todo["_id"])
        # todo["UserId"] = str(todo["UserId"]) #test 當前登入者的_id
        
            todo["date_created"] = todo["date_created"].strftime("%b %d %Y %H:%M:%S")
            todo["pic_name"] = "{}.jpg".format(todo["pic_name"])#將pic_name改為XXX.jpg
            image_name = todo["pic_name"]
            todos.append(todo)
            image_names.append(image_name)
    return render_template("view_todos.html", title = "Layout_page", todos = todos, image_names = image_names)#image_name = image_name

@app.route("/get_todos_public_privacy")
def get_public_privacy():
    todos_public = []
    image_names = []
    for todo in db.member_flask.find().sort("data_created", -1):
        if todo["completed"] == "True":#顯示要放在公開作品集
            todo["_id"] = str(todo["_id"])
            todo["date_created"] = todo["date_created"].strftime("%b %d %Y %H:%M:%S")
            todo["pic_name"] = "{}.jpg".format(todo["pic_name"])#將pic_name改為XXX.jpg
            image_name = todo["pic_name"]
            todos_public.append(todo)
            image_names.append(image_name)
    return render_template("view_public_privacy.html", title = "Layout_page", todos = todos_public, image_names = image_names)

@app.route("/get_todos_public")
def get_public():
    todos_public = []
    image_names = []
    for todo in db.member_flask.find().sort("data_created", -1):
        if todo["completed"] == "True":#顯示要放在公開作品集
            todo["_id"] = str(todo["_id"])
            todo["date_created"] = todo["date_created"].strftime("%b %d %Y %H:%M:%S")      
            todo["pic_name"] = "{}.jpg".format(todo["pic_name"])#將pic_name改為XXX.jpg
            image_name = todo["pic_name"]     
            todos_public.append(todo)
            image_names.append(image_name)
    return render_template("view_public.html", title = "Layout_page", todos = todos_public, image_names = image_names)

@app.route("/add_todo", methods=["POST", "GET"])#新增
# @login_required
def add_todo():
    
    data = request.get_json()#取得前端remitBtn觸發傳入JSON值

    if request.method == "POST" :#判斷是否來自POST
        form = TodoForm(request.form)
        if (data["theme"] or data["descript"] != ""):
            todo_name = data["theme"]
            todo_description = data["descript"]
        else:
            todo_name = form.name.data
            todo_description = form.description.data
        todo_file = data#放資料form.file.data
        completed = form.completed.data#false
        
        print("store action trigger")
        db.member_flask.insert_one({
            "name": todo_name, #圖表主題
            "description": todo_description, #圖表主題描述
            "file": todo_file, #JSON data
            "completed": completed, #是否公開
            "UserId":  session['user']['_id'] , #test 當前登入者的_id
            "date_created": datetime.datetime.now(),#datetime.datetime.now(datetime.timezone.utc), #建立或更改時間
            "creater": session['user']['name'], #test 當前登入者的名字
            "pic_name":todo_file["backGround"]#圖片是哪個
        })

        flash("資料已加入", "success")
        return redirect("/get_todos")
    else:
        form = TodoForm()
    return render_template("add_todo.html", form = form)#導引到建立作品區


@app.route("/update_todo/<id>", methods= ["POST", "GET"])#修改
@login_required
def update_todo(id):
    if request.method == "POST":
        form = TodoForm(request.form)
        todo_name = form.name.data
        todo_description = form.description.data

        # todo_file = request.get_json() #不能更動file欄位

        completed = form.completed.data

        db.member_flask.find_one_and_update({"_id": ObjectId(id)}, {"$set": {
            "name": todo_name,
            "description": todo_description,
            # "file": todo_file, #不去更動該作品file欄位儲存進度
            "completed": completed,
            "UserId": session['user']['_id'], #test 當前登入者的_id
            "date_created": datetime.datetime.now(),
        }})

        flash("資料已更新", "success")
        return redirect("/get_todos") #重新抓取collections
    
    else:
        form = TodoForm()

        todo = db.member_flask.find_one({"_id": ObjectId(id)}) #Collections.find_one_or_404
        form.name.data = todo.get("name", None)
        form.description.data = todo.get("description", None)
        # form.file.data = todo.get("file", None)
        form.completed.data = todo.get("completed", None)

    return render_template("add_todo.html", form = form)

@app.route("/delete_todo/<id>")#刪除
@login_required
def delete_todo(id):
    db.member_flask.find_one_and_delete({"_id": ObjectId(id)})
    flash("資料已刪除", "success")
    return redirect("/get_todos")

#無使用
@app.route('/graph')#存圖片
def graph():
    file = r"C:\Users\USER\手機照片i11\其他\IMG_3012.jpg"

    with open(file, 'rb') as f:#自動關檔
        contents = f.read()

    fs.put(contents, filename="file")
    return redirect("/get_todos")

#無使用
@app.route('/upload', methods=['GET', 'POST'])
def upload():
    form = TodoForm()
    if form.validate_on_submit():
        fileUpload = form.file.data
        # 處理上傳的文件
        # ...
        with open("file.json", "w") as uploadFile:
            json.dump(fileUpload, uploadFile)
        flash("資料成功上傳","success")
    return render_template('add_todo.html', form=form)

#無使用
@app.route('/download_todo')#下載
def download_todo():
    for cursor in fs.find():
        file_name = cursor.file_name
        content = cursor.read()
        with open(path + "temp/" + file_name, "wb") as f:
            print(path)
            f.write(content)
    flash("資料已下載", "success")
    return redirect("/get_todos")

@app.route('/gen_graph')#前端操作產圖
def gen_graph():

    return render_template("genGraph.html") #genGraph_2

@app.route('/search/privacy', methods=['GET', 'POST'])#搜尋欄(作品名或作者) privacy, layout_privacy, 搜尋個人作品
def search_pri():
    if request.method == 'POST' and session["user"]["name"] != "":
        print("有登入")
        print(session)
        print(session["user"]["name"])
        # todos = []
        todos_pri= []
        image_names = []
        print(request.form.get("search"))
        searchStr = str(request.form.get("search"))
        #修改中 {name: {$regex : /searchStr/} {todo["name"]:/searchStr/}
        for todo in db.member_flask.find().sort("data_created", -1):#找出所有資料並以時間排序
            if ((searchStr in todo["name"]) and (session["user"]["name"] == todo["creater"])):#test 查詢有對應到作品名及個人 True or False, 個人作品
                todo["_id"] = str(todo["_id"])
                todo["date_created"] = todo["date_created"].strftime("%b %d %Y %H:%M:%S")
                todo["pic_name"] = "{}.jpg".format(todo["pic_name"])#將pic_name改為XXX.jpg
                image_name = todo["pic_name"]
                todos_pri.append(todo)#增加該筆作品資料
                image_names.append(image_name)
                print(todos_pri)

        if todos_pri == []:#False, 沒找到任何搜尋結果,或作者名不同所以沒加入todos
            print("not in")
            print(todos_pri)
            flash("沒有找到符合的結果或不是自己的作品", "error")
        return render_template("view_todos.html", title = "Layout_page", todos = todos_pri, image_names = image_names)#image_name = image_name

@app.route('/search', methods=['GET', 'POST'])#搜尋欄(作品名或作者) public 搜尋公開作品
def search():
    #session.get('user''name') != True
    if request.method == 'POST':#無登入,public
        # print(session['logged_in'])
        print(session.get('username'))
        print(session.get('user''name'))
        # print(session["user"]["name"])
        print("無登入")#此時沒有session exist 
        todos = []
        image_names = []
        print(request.form.get("search"))
        searchStr = str(request.form.get("search"))
        #修改中 {name: {$regex : /searchStr/} {todo["name"]:/searchStr/}
        for todo in db.member_flask.find().sort("data_created", -1):#找出所有資料並以時間排序
            if ((searchStr in todo["name"]) and todo['completed'] == "True"):#test 查詢有對應到作品名且公開
                print("in")
                todo["_id"] = str(todo["_id"])
                todo["date_created"] = todo["date_created"].strftime("%b %d %Y %H:%M:%S")
                todo["pic_name"] = "{}.jpg".format(todo["pic_name"])#將pic_name改為XXX.jpg
                image_name = todo["pic_name"]
                todos.append(todo)#增加該筆作品資料
                image_names.append(image_name)
                print(todos)
        if todos == []:#False, 沒找到任何搜尋結果
            print("not in")
            print(todos)
            flash("沒有找到符合的結果或輸入有錯誤", "error")
        return render_template("view_public.html", title = "Layout_page", todos = todos, image_names = image_names)#image_name = image_name


@app.route('/history/<id>')#儲存紀錄
def store(id):
    history = []
    for todo in db.member_flask.find({"_id":ObjectId(id)}):
        todo["name"] = todo["name"]
        todo["description"] = todo["description"]
        todo["file"] = (todo["file"])
        # todo["completed"] = todo["completed"]#增加的
        history.append(todo)
        print(history)
    return render_template("genGraph.html", history = history)

#檔案命名Userid + getTime
@app.route('/new_html/<id>')#新生成一個html檔
# @login_required
def new_html(id):
    item = []
    for todo in db.member_flask.find({"_id":ObjectId(id)}):
            todo["_id"] = str(todo["_id"])
            todo["name"] = str(todo["name"])
            todo["creater"] = str(todo["creater"])
            # todo["file"] = str(todo["file"])
            todo["description"] = str(todo["description"])
            todo["date_created"] = todo["date_created"].strftime("%b %d %Y %H:%M:%S")
            item.append(todo)
            print(item)
    # return render_template("output.html", body=item)
    env = Environment(loader=FileSystemLoader('./')) #問題!!(Solved)
    template = env.get_template("application/templates/output.html")#路徑注意doc中沒提到
    with open("{}.html".format(todo["_id"], encoding='utf-8'), 'wb+') as f:#wb+二進制打開
        html_content = template.render(body = item)
        f.write(html_content.encode("utf-8"))
    webbrowser.open_new_tab('{}.html'.format(todo["_id"]))
    return redirect("/get_todos")