const express = require('express')
const router = express.Router() 
const {insertObject }= require('../databaseHandler')
//neu request la: /admin/register
router.get('/register',(req,res)=> {
    res.render('register')
})
router.get('/login',(req,res)=> {
    res.render('login')
})
router.get('/add',(req,res)=> {
    res.render('add')
})
router.get('/update',(req,res)=> {
    res.render('add')
})
router.post('/register',(req,res)=>{
    const name = req.body.txtName
    const role = req.body.Role
    const pass= req.body.txtPassword
    const objectToInsert = {
        userName: name,
        role:role,
        password: pass
    }
    insertObject("Users",objectToInsert)
    res.render('home')
})

module.exports = router;