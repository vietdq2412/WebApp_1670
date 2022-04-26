const express = require('express')
const async = require('hbs/lib/async')
const router = express.Router()
const { insertObject, getUser, USERTABLE } = require('../databaseHandler')

///////////Login
router.get('/login', (req, res) => {
    let error = req.session.error;
    res.render('login', {layout: 'layout_signin', error:error})
})

router.post('/login', async (req, res) => {
    const username = req.body.txtName;
    const password = req.body.txtPassword;

    const user = await getUser(username, password);
    if (user == -1) {
        res.end('login invalid!');
    } else {
        req.session["User"] = {
            userId: user._id,
            username: username,
            role: user.role
        }
        res.redirect('/product/shop')
    }
})
/////////

/////////////Register
router.get('/register', (req, res) => {
    res.render('register', {layout: 'layout_signin'})
})

router.post('/register', async (req, res) => {
    const name = req.body.txtName;
    const password = req.body.txtPassword;
    const role = req.body.role;

    const objectToInsert = {
        username: name,
        password: password,
        role: role
    }

    await insertObject(USERTABLE, objectToInsert)
    res.redirect('/authen/login')
});
////////////////////
router.get('/logout', (req, res) => {
    delete req.session.User;
    res.redirect("/authen/login");
})

module.exports = router;