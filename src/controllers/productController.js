const express = require('express')
const router = express.Router()
const { insertObject, checkUserRole } = require('../databaseHandler')

router.get('/add', (req, res) => {
    res.render('test')
})

module.exports = router;