const {MongoClient,ObjectId} = require('mongodb');
const URL= 'mongodb+srv://ducanh1610:543694@cluster0.9rpbx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const DATABASE_NAME = "GCH0902-ApplicationDev"

async function getDB() {
    const client = await MongoClient.connect(URL);
    const dbo = client.db(DATABASE_NAME);
    return dbo;
}

async function insertObject(collectionName,objectToInsert){
    const dbo = await getDB();
    const newObject = await dbo.collection(collectionName).insertOne(objectToInsert);
    console.log("Gia tri id moi duoc insert la: ", newObject.insertedId.toHexString());
}

module.exports = {insertObject}