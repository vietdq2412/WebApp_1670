const express = require('express')
const router = express.Router()
const { insertObject, checkUserRole, USERTABLE } = require('../databaseHandler')

const path = require('path')

///////////Login
router.get('/login', (req, res) => {
    res.render('login', {layout: 'layout_signin'})
})

router.post('/login', async (req, res) => {
    const username = req.body.txtName;
    const password = req.body.txtPassword;

    const role = await checkUserRole(username, password);
    if (role == -1) {
        res.end('login invalid!');
    } else {
        req.session.User = {
            username: username,
            role: role
        }
        res.redirect('/')
    }
})
/////////


module.exports = router;