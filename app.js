const express = require('express')
const app = express()

app.set('view engine', 'hbs')
app.use(express.static(__dirname + '/views'));

app.use(express.urlencoded({
    extended:true
}))

app.get('/', (req,res) => {
    res.render('index')
})

// const adminController = require('./controllers/adminController')
// //tat ca dia chi chua /admin  => goi controller admin
// app.use('/admin', adminController)

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log('Server is running at ' + PORT)