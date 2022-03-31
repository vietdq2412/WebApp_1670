const express = require('express');
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


///add product
router.get('/add', async (req, res) => {
    const categories = await search('', CATEGORY_TABLE);
    res.render('product/addProductForm', {categories:categories})
})

router.post('/add', (req, res) => {
    const name = req.body.txtName;
    const price = req.body.txtPrice;
    const image = req.body.txtImage;
    const category = req.body.txtCategory;


    objectToInsert = {
        name: name,
        price: price,
        image:image,
        category:category
    }
    insertObject(PRODUCT_TABLE, objectToInsert);
    res.redirect('/product')
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
router.get('/order', (req, res) => {
    const id = req.query.id;
    console.log("oder id: ", id);

    console.log('order id', id)
    res.redirect('/order/addToCart?id='+id);
})

module.exports = router;