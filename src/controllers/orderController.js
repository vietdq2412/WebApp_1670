const express = require('express');
const { insertObject, checkUserRole, search, searchOne, deleteObjectById, updateObject, remove, getCurrentUserSession,
    deleteManyObjects ,ORDER_TABLE, ORDERDETAIL_TABLE, PRODUCT_TABLE } = require('../databaseHandler')
const {ObjectID} = require("mongodb");

const router = express.Router()

/////////////check out
router.get('/checkout', async (req, res) => {
    const curUser = getCurrentUserSession(req,res);

    let list = req.session['cart'];
    console.log('check out', list)
    let orderList = [];
    for (let key in list) {
        const qt = list[key].quantity
        const total = list[key].total
        orderList.push({
            name: key,
            quantity: qt,
            total: total
        })
    }

    console.log('check out to arr',orderList)
    let total = req.query.total;
    res.render('order/checkout', { orderList: orderList, total: total });
})

router.post('/checkout', async (req, res) => {
    const curUser = getCurrentUserSession(req,res);

    const name = req.body.name;
    const address = req.body.address;
    const phone = req.body.phone;
    const email = req.body.email;


    const orderList = await search('', ORDERDETAIL_TABLE);
    let orderDate = new Date();

    let objectToInsert = {
        userId: curUser.userId,
        name: name,
        address: address,
        phone: phone,
        email: email,
        date: orderDate,
        items: Object(orderList),
        status: 'order'
    }
    let ObjectID = require('mongodb').ObjectID;

    //decrease quantity of book in stock
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

    let condition = { "userId": curUser.userId };
    await deleteManyObjects(ORDERDETAIL_TABLE,condition);
    await insertObject(ORDER_TABLE, objectToInsert);
    res.redirect('/order/orderList');
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
module.exports = router;