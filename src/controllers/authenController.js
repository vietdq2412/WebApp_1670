const express = require('express')
const router = express.Router()
const { insertObject, checkUserRole, USERTABLE } = require('../databaseHandler')

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
        req.session.User = "ádasd";
        // req.session.User = {
        //     username: username,
        //     role: role
        // }
        res.redirect('/')
    }
})
/////////

/////////////Register
router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', (req, res) => {
    const name = req.body.txtName;
    const password = req.body.txtPassword;
    const role = req.body.role;

    const objectToInsert = {
        username: name,
        password: password,
        role: role
    }

    insertObject(USERTABLE, objectToInsert);

    res.render('index')
})
////////////////////

module.exports = router;