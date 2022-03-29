const express = require('express')
const app = express()
const expressHbs = require('express-handlebars')
const path = require('path')
const session = require('express-session')


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

////////////admin
const authenController = require('./controllers/authenController')
//tat ca dia chi chua /authen  => goi controller authen
app.use('/authen', authenController, express.static(path.join(__dirname, '/resources/public')));
///////////////////


app.get('/', (req,res) => {
    res.render('index')
})

app.get('/shop', (req,res) => {
    res.render('shop')
})

app.get('/detail', (req,res) => {
    res.render('detail')
})

app.get('/cart', (req,res) => {
    res.render('cart')
})

app.get('/checkout', (req,res) => {
    res.render('checkout')
})



// const adminController = require('./controllers/adminController')
// //tat ca dia chi chua /admin  => goi controller admin
// app.use('/admin', adminController)

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log('Server is running at ' + PORT)