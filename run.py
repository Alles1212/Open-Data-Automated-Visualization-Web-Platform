from application import app, db

if __name__ == "__main__":
    app.run('0.0.0.0', port = 5000, debug=True) #允許外部訪問, debug=True=AutoReload