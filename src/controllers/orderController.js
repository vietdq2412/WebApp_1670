const express = require('express');
const { insertObject, checkUserRole, search, searchOne, deleteObjectById, updateObject, remove, getCurrentUserSession,
    deleteManyObjects ,ORDER_TABLE, ORDERDETAIL_TABLE, PRODUCT_TABLE } = require('../databaseHandler')
const {ObjectID} = require("mongodb");

const router = express.Router()

router.get('/accept', async (req, res) =>{
    const curUser = getCurrentUserSession(req,res);
    if (!curUser){
        req.session.error = 'please login first!';
        res.redirect("/authen/login");
        return;
    }

    if (curUser.role == 'admin'){
        let orderId = req.query.id;

        let condition = {"_id": ObjectID(orderId)};
        let data = {
            $set: {status : "shipping"}
        }
        await updateObject(condition, ORDER_TABLE, data);
        res.redirect("/order/orderList");
    }else{
        req.session.error = "you do not have permission to access this page!"
        res.redirect('/error')
    }
});

router.get('/detail', async (req, res) => {
    const curUser = getCurrentUserSession(req,res);
    if (!curUser){
        req.session.error = 'please login first!';
        res.redirect("/authen/login");
        return;
    }
    const orderId = req.query.id;
    let condition = { "_id": ObjectID(orderId) };
    let item = await searchOne(condition, ORDER_TABLE);

    res.render('order/orderDetail', {item: item, user:curUser})
});

/////////list order
router.get('/orderList', async (req, res) => {
    const curUser = getCurrentUserSession(req,res);
    if (!curUser){
        req.session.error = 'please login first!';
        res.redirect("/authen/login");
        return;
    }
    let orders;
    let status = req.query.status;
    let condition = {'status':status}
    if (!status){
        condition = '';
    }
    if (curUser.role == 'admin'){
        orders = await search(condition, ORDER_TABLE);
    }else {
        condition = {"userId": curUser.userId, "status": status}
        if (!status){
            condition = { "userId": curUser.userId };
        }
        orders = await search(condition, ORDER_TABLE);
    }
    res.render('order/orderList', { orders: orders, user:curUser });
})

router.get('/remove', async (req, res) => {
    if (curUser.role == 'admin'){
        await remove(ORDER_TABLE);
        res.redirect('/order/orderList');
    }else{
        res.redirect('/error')
    }
})
/////////////check out
router.get('/checkout', async (req, res) => {
    const curUser = getCurrentUserSession(req,res);
    if (!curUser){
        req.session.error = 'please login first!';
        res.redirect("/authen/login");
        return;
    }

    let list = req.session['cart'];

    if (list.length == 0){
        req.session.error = "your cart has no item!";
        res.redirect("/error");
    }

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
    let total = req.query.total;
    res.render('order/checkout', { orderList: orderList, total: total, user:curUser });
})

router.post('/checkout', async (req, res) => {
    const curUser = getCurrentUserSession(req,res);
    if (!curUser){
        req.session.error = 'please login first!';
        res.redirect("/authen/login");
        return;
    }

    const name = req.body.name;
    const address = req.body.address;
    const phone = req.body.phone;
    const email = req.body.email;

    let condition = {"userId" : curUser.userId}
    const orderList = await search(condition, ORDERDETAIL_TABLE);
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

    await deleteManyObjects(ORDERDETAIL_TABLE,condition);
    await insertObject(ORDER_TABLE, objectToInsert);
    res.redirect('/order/orderList');
})

router.get('/delete', async (req, res) => {
    const curUser = getCurrentUserSession(req,res);
    if (!curUser){
        req.session.error = 'please login first!';
        res.redirect("/authen/login");
        return;
    }
    const id = req.query.id;
    let condition = {"_id" : ObjectID(id)}
    if (curUser.role == 'admin'){
        let data = {
            $set: {status: "cancel"}
        }
        await updateObject(condition, ORDER_TABLE, data);
        res.redirect("/order/orderList")
    }else{
        let data = {
            $set: {status: "request_cancel"}
        }
        await updateObject(condition, ORDER_TABLE, data);
        res.redirect("/order/orderList")
    }
})

module.exports = router;