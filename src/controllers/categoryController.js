const express = require('express')
const async = require('hbs/lib/async')
const { insertObject, search, CATEGORY_TABLE } = require('../databaseHandler')

const router = express.Router()

router.get('/add', (req, res) => {
    res.render('category/addCategoryForm')
})

router.post('/add', async (req, res) => {
    const name = req.body.txtName;

    objectToInsert = {
        name: name
    }
    await insertObject(CATEGORY_TABLE, objectToInsert);
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