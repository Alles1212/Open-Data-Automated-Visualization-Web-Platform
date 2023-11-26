from flask import jsonify ,request, session, redirect
from passlib.hash import pbkdf2_sha256
from application import db
import uuid

class User:

    def start_session(self, user):
        del user['password']
        session['logged_in'] = True
        session['user'] = user
        return jsonify(user), 200

    def signUp(self):
        # tmp_id = uuid.uuid4().hex
        # Create User objects
        user = {
            "_id": uuid.uuid4().hex,
            "name": request.form.get("name"),
            "email": request.form.get("email"),
            "password": request.form.get("password")
        }
        
        #Encrypt password
        user["password"] = pbkdf2_sha256.encrypt(user["password"])

        #Check for existing email 
        if db.users.find_one({ "email": user["email"]}):
            return jsonify({ "error": "Email已經有人使用"}), 400


        if db.users.insert_one(user):
            return self.start_session(user)

        return jsonify({ "error": "註冊失敗" }), 400
    
    def signOut(self):
        session.clear()
        return redirect("/")
    
    def logIn(self):
        user = db.users.find_one({
            "email": request.form.get("email")
        })

        if user and pbkdf2_sha256.verify(request.form.get('password'), user['password']): #unencrypted, encrypted
            return self.start_session(user)
        
        return jsonify({ "error": "帳號或密碼有誤"}), 401