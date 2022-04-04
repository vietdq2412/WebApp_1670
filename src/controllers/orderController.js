const express = require('express');
const async = require('hbs/lib/async');
const { insertObject, checkUserRole, search, searchOne, ORDER_TABLE, ORDERDETAIL_TABLE, PRODUCT_TABLE } = require('../databaseHandler')

const router = express.Router()

router.get('/cart', async (req, res) => {
    const orderList = await search('', ORDERDETAIL_TABLE);
    res.render('order/cart', { orderList: orderList });
})

router.get('/delete', async (req, res) => {
    const orderList = await search('', ORDERDETAIL_TABLE);
    res.render('order/cart', { orderList: orderList });
})

router.get('/addToCart', async (req, res) => {
    const id = req.query.id;
    let quantity = req.query.qt;

    let ObjectID = require('mongodb').ObjectID;
    const condition = { "_id": ObjectID(id) };
    let product = await searchOne(condition, PRODUCT_TABLE);

    let object = {
        product: product,
        quantity: quantity,
    }

    insertObject(ORDERDETAIL_TABLE, object);
    res.redirect('/cart')
    // let isMove = window.confirm("sure?");
    // if(isMove){
    //     res.redirect('/order')
    // } else{      }
})

router.get('/checkout', async (req, res) => {
    const orderList = await search('', ORDERDETAIL_TABLE);
    user = req.session.id
    res.render('order/checkout', { orderList: orderList });
})

module.exports = router;