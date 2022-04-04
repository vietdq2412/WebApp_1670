const express = require('express')
const expressHbs = require('express-handlebars')
const session = require('express-session')
const path = require('path')
const app = express()


app.engine('hbs', expressHbs.engine({
    extname: '.hbs'
}) )
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname + '/resources/views'));



app.use(express.static(path.join(__dirname + '/resources/public')));

app.use(express.urlencoded({
    extended:true
}))


app.use(session({ secret: 'nhom 1 0902', cookie: { maxAge: 60000 }, saveUninitialized:false, resave: false}))

////////////admin
const adminController = require('./controllers/adminController')
//tat ca dia chi chua /admin  => goi controller admin
app.use('/admin', adminController, express.static(path.join(__dirname, '/resources/public')));
///////////////////

////////////Authentication
const authenController = require('./controllers/authenController')
//tat ca dia chi chua /authen  => goi controller authen
app.use('/authen', authenController, express.static(path.join(__dirname, '/resources/public')));
///////////////////

////////////Product
const productController = require('./controllers/productController')
//tat ca dia chi chua /authen  => goi controller authen
app.use('/product', productController, express.static(path.join(__dirname, '/resources/public')));
///////////////////

////////////Category
const categoryController = require('./controllers/categoryController')
//tat ca dia chi chua /authen  => goi controller authen
app.use('/category', categoryController, express.static(path.join(__dirname, '/resources/public')));
///////////////////

////////////Order
const orderController = require('./controllers/orderController')
//tat ca dia chi chua /authen  => goi controller authen
app.use('/order', orderController, express.static(path.join(__dirname, '/resources/public')));
///////////////////


app.get('/', (req,res) => {
    res.render('index')
})

app.get('/test', (req,res) => {
    let id = req.session.userId;
    let name = req.session.username;
    let role = req.session.role

    console.log(id)
    console.log(name)
    console.log(role)

    let user = {
        id : id,
        username: name,
        role: role
    }
    res.render('test', {user:user})
})

app.get('/shop', (req,res) => {
    res.render('shop')
})



app.get('/checkout', (req,res) => {
    res.render('checkout')
})



const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log('Server is running at ' + PORT)