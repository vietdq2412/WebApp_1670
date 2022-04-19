const express = require('express')
const async = require('hbs/lib/async')
const { insertObject,getCurrentUserSession, search, CATEGORY_TABLE, deleteObjectById } = require('../databaseHandler')

const router = express.Router()

router.get('/add', (req, res) => {
    const curUser = getCurrentUserSession(req,res);
    if (!curUser){
        res.render('test', {message: 'please login first!'});
        return;
    }

    let role = curUser.role;

    if(role != 'admin'){
        res.render('test', {message: "You are not admin"})
        return;
    }else{
    res.render('category/addCategoryForm')
    }
})

router.post('/add', async (req, res) => {
    const name = req.body.txtName;

    objectToInsert = {
        name: name
    }
    await insertObject(CATEGORY_TABLE, objectToInsert);
    res.redirect('/category')
})

///Delete
router.get('/delete', async(req,res)=>{
    const id = req.query.id
    const collectionName ='Category'
    await deleteObjectById(collectionName,id)
    res.redirect('/category')
  })

router.get('/', async (req, res) => {
    // if (req.session.username) {
    //     username = req.session.username;
    // } else {
    //     res.redirect('/login');
    // }

    const categories = await search('', CATEGORY_TABLE);

    // if (req.session.username) {
    //     username = req.session.username;
    // }
    console.log(categories);
    res.render('category/listCategories', { categories: categories})
})
module.exports = router;