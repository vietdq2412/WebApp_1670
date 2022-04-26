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

router.post('/replyfeedback',async(req,res)=>{
    const id = req.body.ctid
    const reply = req.body.reply
    const UpdateValue = {$push: {reply:{  content: reply}} }
    console.log(UpdateValue)
    const update = await dbHandler.updateDocument(id,UpdateValue,"Feedback")
    console.log(update)
    res.redirect('/feedback/feedback')
})
module.exports = router