import os
from flask import Flask, jsonify, request, session
from flask import render_template
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy import MetaData
from sqlalchemy import Table, Column, Integer, String,ForeignKey,insert,select
# import psycopg2
 
basedir = os.path.abspath(os.path.dirname(__file__))

engine = create_engine('sqlite:///' + os.path.join(basedir, 'data.sqlite'), echo=True)


metadata_obj = MetaData()


app = Flask(__name__)

user_table = Table(
     
    "Users",
    metadata_obj,
    Column("user", String(30), primary_key=True),
    Column("password", String(30))
    )

highscore_table = Table(
     
    "Highscores",
    metadata_obj,
    Column("userName",ForeignKey("Users.user"),primary_key=True,nullable=False),
    Column("gameTitle",String(30),primary_key=True),
    Column("score",Integer)  
    )

metadata_obj.create_all(engine)


# stmt = insert(user_table).values(user="spongebob", password="Spongebob Squarepants")

# with engine.connect() as conn:
#     result = conn.execute(stmt)
#     conn.commit()
    
# stmt = select(highscore_table).where(highscore_table.c.userName == "spongebob").where(highscore_table.c.gameTitle == game)

# stmt select(highscore_table)


# with engine.connect() as conn:
#     result = conn.execute(stmt)
#     conn.commit()
     



    
    

#'sqlite:///' + os.path.join(basedir, 'data.sqlite')
 
#db = SQLAlchemy(app)
#app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'data.sqlite')
#app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

#engine = create_engine("sqlite+pysqlite:///:memory:", echo=True)

# Database connection parameters
db_params = {
    "dbname": "dvdrental",
    "user": "raywu1990",
    "password": "test",
    "host": "127.0.0.1",
    "port": "5432",
}
 
# class Users(db.Model):
 
#     ID = db.Column("id",db.Integer, primary_key = True)
#     userName = db.Column(db.String(20), unique = True)
#     password = db.Column(db.String(64))
#     HighScores = db.relationship('HighScores', backref='Users')
 
#     def __init__(self,name,password):
#         self.userName = name
#         self.password = password
 
 
# class HighScores(db.Model):
 
#     name = db.Column(db.String(20), db.ForeignKey('userName'), primary_key = True)
#     game = db.Column(db.String(20), primary_key = True)
#     score = db.Column(db.Integer)
 
#     def __init__(self,name,game,score):
#         self.name = name
#         self.game = game
#         self.score = score
 
    
 
 
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
    stmt = select(highscore_table).order_by(highscore_table.c.score.desc()).limit(5)
    
    with engine.connect() as conn:
        for row in conn.execute(stmt):
            print(row) 
    
    return render_template(f'games/{game_name}.html')

@app.route('/submit_score', methods=['POST'])
def submit_score():
    data = request.json
    score = data.get('score')
    # Do something with the score, like storing it in the database
    # Example: You could store the score in your database using SQLAlchemy
    # For simplicity, let's just print the score here
    print('Received score:', score)
    return jsonify({'message': 'Score received successfully'})



@app.route('/auth', methods = ["POST", "GET"])
def auth():
    if request.method == "POST":
        givenName = request.form["username"]
        givenPassword = request.form["password"]
        print("Name: " , givenName)
        print("Password: ", givenPassword)
        

        # stmt = select(user_table).where(user_table.c.user == givenName)
        # with engine.connect() as conn:
        #     print(stmt) 
        #     result = conn.execute(stmt)
        #     if(result != None):
        #         print("no user found")
               
        #     else:
        #         print("user found: " , result)
                
        #     print(result)
             
        stmt = insert(user_table).values(user=givenName, password=givenPassword)
        
 
        with engine.connect() as conn:
            result = conn.execute(stmt)
            print(result)
            conn.commit()
            
        stmt = insert(highscore_table).values(userName = givenName, gameTitle ="Tetris",score = givenPassword)
        
        with engine.connect() as conn:
            result = conn.execute(stmt)
            print(result)
            conn.commit()

 
    return render_template("auth.html")


    @app.route('/login')
    def login():
     return render_template("login.html") 


if __name__ == '__main__':
    #db.create_all()
    app.run(debug=True)