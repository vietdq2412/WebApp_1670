const express = require('express');
const req = require('express/lib/request');
const async = require('hbs/lib/async');
const router = express.Router()
const { insertObject, checkUserRole, search, PRODUCT_TABLE, CATEGORY_TABLE, searchOne } = require('../databaseHandler')

router.get('/', async (req, res) => {
    // if (req.session.username) {
    //     username = req.session.username;
    // } else {
    //     res.redirect('/login');
    // }

    const products = await search('', PRODUCT_TABLE);

    // if (req.session.username) {
    //     username = req.session.username;
    // }
    console.log(products);
    res.render('product/listProducts', { products: products})
})
///show products
router.get('/shop',async(req,res)=>{
    console.log(1)
    const products = await search('',PRODUCT_TABLE);
    console.log(products);
    res.render('shop',{products: products})
})
///add product
router.get('/add', async (req, res) => {
    const categories = await search('', CATEGORY_TABLE);
    res.render('product/addProductForm', {categories:categories})
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
    const id = req.query.id
    var ObjectID = require('mongodb').ObjectID;
    const condition = {"_id":ObjectID(id)};
    console.log(id)
    const product = await searchOne(condition, PRODUCT_TABLE);

    const categories = await search('', CATEGORY_TABLE);
    console.log('cat',product.category.name)
    res.render('product/editProductForm', {product:product, categories})
})

///detail
router.get('/detail', async (req, res) => {
    const id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    const condition = { "_id": ObjectID(id) };
    console.log(id)
    const product = await searchOne(condition, PRODUCT_TABLE);
    res.render('product/detail', {product:product})
})


/////order


module.exports = router;