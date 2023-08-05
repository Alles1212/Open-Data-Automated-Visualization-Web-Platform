from flask import Flask
from application import app
from application.user.models import User

@app.route('/user/signup', methods=['POST'])
def signup():
    return User().signUp()

@app.route('/user/signout')
def signout():
    return User().signOut()

@app.route('/user/login', methods = ['POST'])
def login():
    return User().logIn()