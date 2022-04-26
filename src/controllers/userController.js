const express = require('express')
const router = express.Router()
const {USERTABLE, updateObject, search, searchOne,
    getCurrentUserSession, getUser, updateDocument
} = require('../databaseHandler')
const path = require('path')


router.get('/', async (req, res) => {
    let listUser = await search('', USERTABLE);
    res.render('user/profileUser', {listUser: listUser});
})

router.get('/profileUser', async (req, res) => {
    const uname = req.session["Users"]
    const user = await getUser(uname)
    res.render('user/profileUser', { dataInfo: user })
})

router.get('/editUser/:id', async (req, res) => {
    const idValue = req.params.id
    const userToEdit = await getUser(idValue, "Users")
    res.render("user/editUser", { user: userToEdit })
})
router.get('/update', async (req, res) => {
    const id = req.body.txtOId
    const name = req.body.txtUname
    const uid = req.body.txtId
    const pass = req.body.txtPassword
    let updateValues = { $set: {
            userName: name,
            userId: uid,
            password: pass,
        } };
    await updateDocument(id, updateValues, "Users")
    res.redirect('/profileUser')
})
module.exports = router;