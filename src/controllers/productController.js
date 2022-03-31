const express = require('express');
const async = require('hbs/lib/async');
const router = express.Router()
const { insertObject, checkUserRole, search, PRODUCT_TABLE, CATEGORY_TABLE } = require('../databaseHandler')

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

module.exports = router;