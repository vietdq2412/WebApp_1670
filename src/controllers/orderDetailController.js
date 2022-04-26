const express = require('express');
const {
    insertObject, checkUserRole, search, searchOne, deleteObjectById, updateObject, remove, getCurrentUserSession,
    ORDER_TABLE, ORDERDETAIL_TABLE, PRODUCT_TABLE
} = require('../databaseHandler')
const {ObjectID} = require("mongodb");

const router = express.Router()

router.get('/cart', async (req, res) => {
    const curUser = getCurrentUserSession(req, res);
    if (!curUser) {
        req.session.error = "please login first!";
        res.redirect("/authen/login");
        return;
    }

    const condition = {"userId": curUser.userId};
    const orderDetailList = await search(condition, ORDERDETAIL_TABLE);
    let subTotal = 0;
    for (let i = 0; i < orderDetailList.length; i++) {
        subTotal += orderDetailList[i].total;
    }

    let dict = {}
    for (let i = 0; i < orderDetailList.length; i++) {
        let key = orderDetailList[i].product.name;
        let value = {
            quantity: orderDetailList[i].quantity,
            total: orderDetailList[i].total
        }
        dict[key] = value;
    }
    req.session["cart"] = dict;

    if (dict.length <= 0) {
        req.session.message = "Cart is empty!";
    }
    let message = req.session.message;
    res.render('order/cart', {orderList: orderDetailList, subTotal: subTotal, message: message, user:curUser});
})

router.get('/delete', async (req, res) => {
    const curUser = getCurrentUserSession(req, res);
    if (!curUser) {
        res.render('login', {message: 'please login first!'});
        return;
    }

    const id = req.query.id;
    await deleteObjectById(ORDERDETAIL_TABLE, id);
    res.redirect("/orderDetail/cart")
})

router.get('/edit', async (req, res) => {
    const curUser = getCurrentUserSession(req, res);
    if (!curUser) {
        res.render('login', {message: 'please login first!'});
        return;
    }

    const id = req.query.id;
    let action = req.query.action;

    let ObjectID = require('mongodb').ObjectID;
    const condition = {"_id": ObjectID(id)};
    let item = await searchOne(condition, ORDERDETAIL_TABLE);
    let qt = 0;
    if (action == 'plus') {
        qt = parseInt(item.quantity) + 1;
    } else {
        qt = parseInt(item.quantity) - 1;
    }

    let total = qt * parseInt(item.product.price)
    let newData = {
        $set: {quantity: qt, total: total}
    };

    await updateObject(condition, ORDERDETAIL_TABLE, newData);
    res.redirect('/orderDetail/cart')
})

router.get('/addToCart', async (req, res) => {
    const ObjectID = require('mongodb').ObjectID;
    const curUser = getCurrentUserSession(req, res);
    if (curUser == null) {
        res.redirect("/authen/login");
        return;
    }

    const id = req.query.id;
    let inputQuantity = req.query.qt;

    const condition = {"_id": ObjectID(id)};
    let product = await searchOne(condition, PRODUCT_TABLE);
    let productId = product._id;

    if (inputQuantity > product.quantity) {
        req.session.erro = "Over quantity!";
        res.redirect("/product/detail?id=" + productId);
        return;
    }

    const itemCondition = {"product": Object(product)};
    let item = await searchOne(itemCondition, ORDERDETAIL_TABLE);

    let qt;
    let total = parseInt(product.price) * parseInt(inputQuantity);
    if (item != null) {
        qt = parseInt(item.quantity) + parseInt(inputQuantity);
        if (qt > product.quantity) {
            req.session.erro = "Over quantity!";
            res.redirect("/product/detail?id=" + productId);
            return;
        }
        total = product.price * qt;
        let editData = {
            $set: {quantity: qt, total: total}
        };
        await updateObject({"_id": ObjectID(item._id)}, ORDERDETAIL_TABLE, editData);
        res.redirect('/orderDetail/cart')
    } else {
        let object = {
            userId: curUser.userId,
            productId: productId,
            product: product,
            quantity: inputQuantity,
            total: total
        }

        await insertObject(ORDERDETAIL_TABLE, object);
        res.redirect('/orderDetail/cart')
    }
})

router.get('/remove', async (req, res) => {
    await remove(ORDERDETAIL_TABLE);
    res.redirect("/orderDetail/cart")
})

module.exports = router;