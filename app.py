
from flask import Flask, request, jsonify
from flask import render_template
# import psycopg2

app = Flask(__name__)

# Database connection parameters
db_params = {
    "dbname": "dvdrental",
    "user": "raywu1990",
    "password": "test",
    "host": "127.0.0.1",
    "port": "5432",
}

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

@app.route('/auth')
def auth():
       return render_template("auth.html")



if __name__ == '__main__':
    app.run(debug=True)