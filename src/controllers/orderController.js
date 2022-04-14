const express = require('express');
const { render } = require('express/lib/response');
const async = require('hbs/lib/async');
const { insertObject, checkUserRole, search, searchOne, deleteObjectById, updateObject, remove,
    ORDER_TABLE, ORDERDETAIL_TABLE, PRODUCT_TABLE } = require('../databaseHandler')

const router = express.Router()

router.get('/cart', async (req, res) => {
    const orderList = await search('', ORDERDETAIL_TABLE);
    let subTotal = 0;
    for (let i = 0; i < orderList.length; i++) {
        subTotal += orderList[i].total;
    }

    let cartSession = req.session.cart;

    if (!cartSession) {
        var dict = {}
        for (let i = 0; i < orderList.length; i++) {
            let key = orderList[i].product.name;
            let value = {
                quantity: orderList[i].quantity,
                total: orderList[i].total
            }
            dict[key] = value;
        }
        req.session["cart"] = dict;
        console.log("cartSes", req.session.cart)

    } else {
        req.session["cart"] = cartSession;
    }

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

    let total = qt * parseInt(item.product.price)
    let newData = {
        $set: { quantity: qt, total: total }
    };

    await updateObject(condition, ORDERDETAIL_TABLE, newData);
    res.redirect('/order/cart')
})

router.get('/addToCart', async (req, res) => {
    const id = req.query.id;
    let inputQuantity = req.query.qt;

    let ObjectID = require('mongodb').ObjectID;
    const condition = { "_id": ObjectID(id) };
    let product = await searchOne(condition, PRODUCT_TABLE);

    const itemCondition = { "product": Object(product) };
    let item = await searchOne(itemCondition, ORDERDETAIL_TABLE);

    let qt;
    let total = parseInt(product.price) * parseInt(inputQuantity);
    if (item != null) {
        qt = parseInt(item.quantity) + parseInt(inputQuantity);
        total = product.price * qt;
        let editData = {
            $set: { quantity: qt, total: total }
        };
        await updateObject({ "_id": ObjectID(item._id) }, ORDERDETAIL_TABLE, editData);
        res.redirect('/order/cart')
    } else {
        let object = {
            product: product,
            quantity: inputQuantity,
            total: total
        }

        await insertObject(ORDERDETAIL_TABLE, object);
        res.redirect('/order/cart')
    }
})

/////////list order
router.get('/orderList', async (req, res) => {
    const orders = await search('', ORDER_TABLE);
    res.render('order/orderList_Customer', { orders: orders });
})

router.get('/remove', async (req, res) => {
    await remove(ORDER_TABLE);
    res.redirect('/order/orderList');
})

/////////////check out
router.get('/checkout', async (req, res) => {
    let list = req.session['cart'];
    console.log(list)
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
    const name = req.body.name;
    const address = req.body.address;
    const phone = req.body.phone;
    const email = req.body.email;


    const orderList = await search('', ORDERDETAIL_TABLE);
    let orderDate = new Date();

    let objectToInsert = {
        name: name,
        address: address,
        phone: phone,
        email: email,
        date: orderDate,
        items: Object(orderList),
        status: 'order'
    }

    let ObjectID = require('mongodb').ObjectID;
    
    for(let i = 0; i< orderList.length; i++){
        let productId = orderList[i].product._id;
        let order_qt = orderList[i].quantity;
        let condition = { "_id": ObjectID(productId) };
        let product = await searchOne({ "_id": ObjectID(productId) }, PRODUCT_TABLE);
        let new_qt = parseInt(product.quantity) - parseInt(order_qt);

        let updateData = {
            $set: {quantity: new_qt}
        }

        await updateObject(condition, PRODUCT_TABLE, updateData);
    }


    await insertObject(ORDER_TABLE, objectToInsert);
    user = req.session.id
    res.redirect('/order/orderList');
})



module.exports = router;