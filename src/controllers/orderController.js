const express = require('express');
const async = require('hbs/lib/async');
const { insertObject, checkUserRole, search, searchOne, deleteObjectById, updateObject,
    ORDER_TABLE, ORDERDETAIL_TABLE, PRODUCT_TABLE } = require('../databaseHandler')

const router = express.Router()

router.get('/cart', async (req, res) => {
    const orderList = await search('', ORDERDETAIL_TABLE);
    let subTotal = 0;
    for (let i = 0; i < orderList.length; i++) {
        subTotal += orderList[i].total;
    }

    let myCart = req.session["cart"]
    var dict = {}
    for (let i = 0; i < orderList.length; i++) {
        let key = orderList[i].product.name;
        let value = {
            quantity:orderList[i].quantity,
            total: orderList[i].total
        }

        dict[key] = value;
    }
    req.session["cart"] = dict

    req.session["subTotal"] = subTotal;

    res.render('order/cart', { orderList: orderList, subTotal: subTotal });
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

    await updateObject(condition, ORDERDETAIL_TABLE, newData);
    res.redirect('/order/cart')
})

router.get('/addToCart', async (req, res) => {
    const id = req.query.id;
    let quantity = req.query.qt;

    let ObjectID = require('mongodb').ObjectID;
    const condition = { "_id": ObjectID(id) };
    let product = await searchOne(condition, PRODUCT_TABLE);

    let total = product.price * quantity;
    let object = {
        product: product,
        quantity: quantity,
        total: total
    }

    await insertObject(ORDERDETAIL_TABLE, object);
    res.redirect('/order/cart')
})

router.get('/checkout', async (req, res) => {
    let list = req.session.cart;
    let orderList = [];
    for (var key in list) {
        const qt = list[key].quantity
        const total = list[key].total
        orderList.push({ 
            name: key,
            quantity: qt,
            total: total
        })
    }
    console.log(orderList)
    let total = req.query.total;
    res.render('order/checkout', { orderList: orderList, total: total });
})

router.post('/checkout', async (req, res) => {
    const orderList = await search('', ORDERDETAIL_TABLE);
    let orderDate = new Date();
    user = req.session.id
    res.render('order/checkout', { orderList: orderList });
})

module.exports = router;