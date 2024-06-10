import os
from flask import Flask, jsonify, request, session
from flask import render_template


app = Flask(__name__) 
 
@app.route('/')
def index():
       return render_template("index.html")
 
@app.route('/about')
def about():
       return render_template("about.html")
 
@app.route('/games')
def games():
       return render_template("games.html")

@app.route('/games/<game_name>')
def game(game_name):
    return render_template(f'games/{game_name}.html')

# @app.route('/auth', methods = ["PUT", "GET"])
# def auth():
#     if request.method == "PUT":
#         givenName = request.form["username"]
#         givenPassword = request.form["password"]
#         print("Name: " , givenName)
#         print("Password: ", givenPassword)
        

#         # stmt = select(user_table).where(user_table.c.user == givenName)
#         # with engine.connect() as conn:
#         #     print(stmt) 
#         #     result = conn.execute(stmt)
#         #     if(result != None):
#         #         print("no user found")
               
#         #     else:
#         #         print("user found: " , result)
                
#         #     print(result)
             
#         stmt = update(user_table).values(user=givenName, password=givenPassword)
        
 
#         with engine.connect() as conn:
#             result = conn.execute(stmt)
#             print(result)
#             conn.commit()
            
   

 
#     return render_template("auth.html")


# @app.route('/login')
# def login():
#        return render_template("login.html") 


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)