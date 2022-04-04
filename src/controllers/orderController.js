const express = require('express');
const async = require('hbs/lib/async');
const { insertObject, checkUserRole, search, searchOne, deleteObjectById, updateObject,
    ORDER_TABLE, ORDERDETAIL_TABLE, PRODUCT_TABLE } = require('../databaseHandler')

const router = express.Router()

router.get('/cart', async (req, res) => {
    const orderList = await search('', ORDERDETAIL_TABLE);
    res.render('order/cart', { orderList: orderList });
})

router.get('/delete', async (req, res) => {
    const id = req.query.id;
    await deleteObjectById(ORDERDETAIL_TABLE, id);
    res.redirect("/order/cart")
})

router.get('/edit', async (req, res) => {
    const id = req.query.id;
    let action = req.query.action;

    let ObjectID = require('mongodb').ObjectID;
    const condition = { "_id": ObjectID(id) };
    let item = await searchOne(condition, ORDERDETAIL_TABLE);
    let qt = 0;
    if (action == 'plus') {
        qt = parseInt(item.quantity) + 1;
    } else {
        qt = parseInt(item.quantity) - 1;
    }

    let newData = {
         $set: { quantity: qt } 
        };

    await updateObject(condition,ORDERDETAIL_TABLE, newData);
    res.redirect('/order/cart')
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
    res.redirect('/order/cart')
})

router.get('/checkout', async (req, res) => {
    const orderList = await search('', ORDERDETAIL_TABLE);
    user = req.session.id
    res.render('order/checkout', { orderList: orderList });
})

module.exports = router;