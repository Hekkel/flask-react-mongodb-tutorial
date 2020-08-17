from flask import Flask, request, jsonify
from flask_pymongo import PyMongo, ObjectId
from flask_cors import CORS

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost/pythonreactdb'
mongo = PyMongo(app)
CORS(app)
db = mongo.db.users


@app.route('/user', methods=['POST'])
def crate_user():
    result = db.insert_one({
        'name': request.json['name'],
        'email': request.json['email'],
        'password': request.json['password']
    })
    print(str(ObjectId(result.inserted_id)))
    return jsonify({'msg': 'User created'})


@app.route('/users', methods=['GET'])
def get_users():
    users = []
    for doc in db.find():
        users.append({
            '_id': str(ObjectId(doc['_id'])),
            'name': doc['name'],
            'email': doc['email'],
            'password': doc['password'],
        })
    return jsonify(users)


@app.route('/user/<id>', methods=['GET'])
def get_user(id):
    doc = db.find_one({'_id': ObjectId(id)})
    return jsonify({'_id': str(ObjectId(doc['_id'])),
                    'name': doc['name'],
                    'email': doc['email'],
                    'password': doc['password']
                    })


@app.route('/user/<id>', methods=['DELETE'])
def delete_user(id):
    db.delete_one({'_id': ObjectId(id)})
    return jsonify({'msg': 'User deleted'})


@app.route('/user/<id>', methods=['PUT'])
def update_user(id):
    db.update_one({'_id': ObjectId(id)}, {'$set': {
        'name': request.json['name'],
        'email': request.json['email'],
        'password': request.json['password']
    }})

    return jsonify({'msg': 'user updated'})


if __name__ == '__main__':
    app.run(debug=True)
