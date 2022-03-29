const express = require('express')
const router = express.Router()

const path = require('path')


router.get('/register', (req, res) => {
    res.render('test')
})

module.exports = router;