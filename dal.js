const { MongoClient, ObjectId } = require('mongodb');
const url         = 'mongodb://localhost:27017';
let db;
 
// connect to mongo
MongoClient.connect(url, { useUnifiedTopology: true }, (_, client) => {
    console.log("Connected successfully to db server");

    // connect to myproject database
    db = client.db('badbank');
});

// create user 
function create(name, email, password){
    return new Promise((resolve, reject) => {    
        const collection = db.collection('users');
        const doc = {name, email, password, balance: 0};
        collection.insertOne(doc, {w:1}, function(err, result) {
            err ? reject(err) : resolve(doc);
        });    
    })
}

// find user account
function find(email){
    return new Promise((resolve, reject) => {    
        const customers = db
            .collection('users')
            .find({email: email})
            .toArray(function(err, docs) {
                err ? reject(err) : resolve(docs);
        });    
    })
}

// find user account
function findOne(email){
    return new Promise((resolve, reject) => {    
        const customers = db
            .collection('users')
            .findOne({email: email})
            .then((doc) => resolve(doc))
            .catch((err) => reject(err));    
    })
}

// update - deposit/withdraw amount
function update(email, amount){
    return new Promise((resolve, reject) => {    
        const customers = db
            .collection('users')            
            .findOneAndUpdate(
                {email: email},
                { $inc: { balance: amount}},
                { returnOriginal: false },
                function (err, documents) {
                    err ? reject(err) : resolve(documents);
                }
            );            


    });    
}

// all users
function all(){
    return new Promise((resolve, reject) => {    
        const customers = db
            .collection('users')
            .find({})
            .toArray(function(err, docs) {
                err ? reject(err) : resolve(docs);
        });    
    })
}

// create a route to get all users
const getAllUsers = () => {
return db
.collection('users')
.find()
.toArray();
};


//create a route to create new user
const createUser = (user) => {
return db.collection('users').insertOne(user);
};

//create a route to update a user's balance
const updateUserBalance = (userId, balance) => {
return db.collection('users').updateOne(
    { _id: ObjectId(userId) },
    { $set: { balance: balance }}
)
};

module.exports = {create, findOne, find, update, all, getAllUsers, createUser, updateUserBalance};