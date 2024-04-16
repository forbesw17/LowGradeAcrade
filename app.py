import os
from flask import Flask, jsonify, request, session
from flask import render_template
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy import MetaData
from sqlalchemy import Table, Column, Integer, String,ForeignKey,insert,select,update
 
basedir = os.path.abspath(os.path.dirname(__file__))

engine = create_engine('sqlite:///' + os.path.join(basedir, 'data.sqlite'), echo=True)

metadata_obj = MetaData()

app = Flask(__name__)

# user_table = Table(
     
#     "Users",
#     metadata_obj,
#     Column("user", String(30), primary_key=True),
#     Column("password", String(30))
#     )

highscore_table = Table(
     
    "Highscores",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("userName", String(3), nullable=False),
    Column("gameTitle",String(30)),
    Column("score",Integer)  
    )

metadata_obj.create_all(engine)
 
 
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
    # your code here...
    stmt = select(highscore_table).where(highscore_table.c.gameTitle == game_name).order_by(highscore_table.c.score.desc()).limit(5)
   
    high_scores = []
    with engine.connect() as conn:
        for row in conn.execute(stmt):
            high_scores.append(row)
            conn.commit()
   
    return render_template(f'games/{game_name}.html', high_scores=high_scores)
 

@app.route('/submit_score', methods=['POST'])
def submit_score():
    data = request.json
    username = data.get('username')
    score = data.get('score')
    title = data.get('title')
    
    stmt = insert(highscore_table).values(userName = username, gameTitle = title, score = score)
        
    with engine.connect() as conn:
       result = conn.execute(stmt)
       print(result)
       conn.commit()
    # Do something with the score, like storing it in the database
    # Example: You could store the score in your database using SQLAlchemy
    # For simplicity, let's just print the score here
    print('Received score:', score)
#     return jsonify({'message': 'Score received successfully'})
    stmt = select(highscore_table).where(highscore_table.c.gameTitle == title).order_by(highscore_table.c.score.desc()).limit(5)
   
    high_scores = []
    with engine.connect() as conn:
        for row in conn.execute(stmt):
            high_scores.append(row)
            conn.commit()
   
    return render_template(f'games/{title}.html', high_scores=high_scores)



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
    app.run(debug=True)