const {MongoClient,ObjectId} = require('mongodb');

const URL = "mongodb+srv://ducanh1610:543694@cluster0.9rpbx.mongodb.net/test";
const DATABASE_NAME = "GCH0902-ApplicationDev"

async function getDB(){
        const client = await MongoClient.connect(URL);
        const dbo = client.db(DATABASE_NAME);
        return dbo;
}

async function insertObject(collectionName,objectToInsert){
    const dbo = await getDB();
    const newObject = await dbo.collection(collectionName).insertOne(objectToInsert);
    console.log("Gia tri id moi duoc insert la: ", newObject.insertedId.toHexString());
}

async function search(condition, collectionName) {
    const dbo = await getDB();
    //const searchCondition = new RegExp(condition, 'i')
    var results = await dbo.collection(collectionName).
    find(condition).toArray();
    return results;
}

async function searchOne(condition, collectionName) {
    const dbo = await getDB();
    //const searchCondition = new RegExp(condition, 'i')
    var results = await dbo.collection(collectionName).
    findOne(condition);
    return results;
}

async function getUser(username, password){
    const dbo = await getDB();
    const user = await dbo.collection(USERTABLE).findOne({username:username, password:password});
    if(user == null){
        return -1;
    }else{
        console.log(user);
        return user;
    }
    
}

const USERTABLE = 'Users';
const CATEGORY_TABLE = 'Category';
const PRODUCT_TABLE = 'Product';
const ORDER_TABLE = 'Order';
const ORDERDETAIL_TABLE = 'Order';




module.exports = {insertObject, getUser, search, searchOne, USERTABLE, CATEGORY_TABLE, PRODUCT_TABLE, ORDER_TABLE, ORDERDETAIL_TABLE}