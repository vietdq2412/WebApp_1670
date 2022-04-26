const express = require('express');
const req = require('express/lib/request');
const { redirect } = require('express/lib/response');
const async = require('hbs/lib/async');
const { ObjectId } = require('mongodb');
const router = express.Router()
const { insertObject, checkUserRole, sort, getCurrentUserSession,
     search, updateProduct ,deleteProductById, PRODUCT_TABLE, CATEGORY_TABLE, searchOne } = require('../databaseHandler')

router.get('/', async (req, res) => {
    const curUser = getCurrentUserSession(req,res);
    if (!curUser){
        req.session.error = 'please login first!';
        res.redirect("/authen/login");
        return;
    }

    let role = curUser.role;

    if(role != 'admin'){
        res.render('test', {message: "You are not admin"})
        return;
    }else{
        const products = await search('', PRODUCT_TABLE);
        res.render('product/listProducts', { products: products, user:curUser})
    }
})
///show products
router.get('/shop',async(req,res)=>{
    const products = await search('',PRODUCT_TABLE);
    let curUser = req.session.User
    res.render('shop',{products: products, user:curUser})
})
///add product
router.get('/add', async (req, res) => {
    const curUser = getCurrentUserSession(req,res);
    if (!curUser){
        req.session.error = 'please login first!';
        res.redirect("/authen/login");
        return;
    }

    let role = curUser.role;

    if(role != 'admin'){
        res.render('test', {message: "You are not admin"})
        return;
    }else{
    const categories = await search('', CATEGORY_TABLE);
    res.render('product/addProductForm', {categories:categories, user:curUser})
    }
})

router.post('/add', async (req, res) => {
    const name = req.body.txtName;
    const categoryId = req.body.txtCategory;
    const price = req.body.txtPrice;
    const image = req.body.txtImage;
    const qt = req.body.txtQuantity;


    var ObjectID = require('mongodb').ObjectID;
    const condition = { "_id": ObjectID(categoryId) };

    const category = await searchOne(condition, CATEGORY_TABLE);
    objectToInsert = {
        name: name,
        category:category,
        price: price,
        quantity: qt,
        image:image,
    }
    await insertObject(PRODUCT_TABLE, objectToInsert);
    res.redirect('/product')
})
///edit 
router.get('/edit', async (req, res) => {
    let curUser = req.session.User;
    const id = req.query.id
    var ObjectID = require('mongodb').ObjectID;
    const condition = {"_id":ObjectID(id)};
    console.log(id)
    const product = await searchOne(condition, PRODUCT_TABLE);

    const categories = await search('', CATEGORY_TABLE);
    res.render('product/editProductForm', {product:product, categories, user:curUser})
})

router.post('/edit', async(req,res)=> {
    const updateId= req.body.txtId; 
    const name = req.body.txtName;
    const categoryId = req.body.txtCategory;
    const price = req.body.txtPrice;
    const image = req.body.txtImage;
    const newvalues = {$set: {'name': name, 'price': price ,'categoryId': categoryId,'image': image}}
    const myquery= {_id:ObjectId(updateId)}
    const collectionName ='Product'
    await updateProduct(collectionName,myquery,newvalues)
    res.redirect('/product')
})

///delete 
router.get('/delete', async(req,res)=>{
    const id = req.query.id
    const collectionName ='Product'
    await deleteProductById(collectionName,id)
    res.redirect('/product')
  })

///detail
router.get('/detail', async (req, res) => {
    let curUser = req.session.User;
    const id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    const condition = { "_id": ObjectID(id) };
    let message = req.session.erro;
    delete req.session.erro;
    const product = await searchOne(condition, PRODUCT_TABLE);
    res.render('product/detail', {product:product, message:message, user:curUser})
})


/////search
router.get('/search', async (req, res) => {
    let curUser = req.session.User;

    const content = req.query.content;
    const condition = { "name":  new RegExp("^.*"+content+".*$")}
    const product = await search(condition, PRODUCT_TABLE);

    res.render('shop', {products:product, user:curUser})
})

///sort 
/////search
router.get('/sort', async (req, res) => {
    let sortBy = req.query.by;
    let curUser = req.session.User;

    const content = req.query.content;
    let sortCondition = '';
    if(sortBy == 'name'){
         sortCondition = { 'name': 1}
    }else{
        sortCondition = {'price':1}
    }
    const product = await sort('',sortCondition, PRODUCT_TABLE);

    res.render('shop', {products:product, user:curUser})
})
module.exports = router;