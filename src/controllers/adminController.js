const express = require('express')
const router = express.Router()

const path = require('path')
const {getCurrentUserSession} = require("../databaseHandler");


router.get('/', (req, res) => {
    const curUser = getCurrentUserSession(req, res);
    if (!curUser) {
        req.session.error = "please login first!";
        res.redirect("/authen/login");
        return;
    }
    res.render('admin/adminPage', {user:curUser})
})

module.exports = router;