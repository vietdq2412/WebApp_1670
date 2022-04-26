const express = require('express')
const req = require('express/lib/request')
const async = require('hbs/lib/async')
const router = express.Router()
const { insertObject, getCurrentUserSession, search, remove,
     USERTABLE, FEEDBACK_TABLE, updateObject
} = require('../databaseHandler')
const {ObjectID} = require("mongodb");



router.get('/feedback', async (req, res) =>{
    const curUser = getCurrentUserSession(req,res);
    if (!curUser){
        req.session.error = 'please login first!';
        res.redirect("/authen/login");
        return;
    }
console.log(curUser);
    let listFeedback = await search('',FEEDBACK_TABLE);

    res.render('feedback', {listFeedback:listFeedback, user:curUser});
})

router.post('/sent',async (req, res) =>{
    const curUser = getCurrentUserSession(req,res);
    if (!curUser){
        req.session.error = 'please login first!';
        res.redirect("/authen/login");
        return;
    }

    let content = req.body.text;
    let date = new Date;
    
    let objectToInsert = {
        user: curUser,
        content: content,
        reply : '',
        date: date
    }

    await insertObject(FEEDBACK_TABLE, objectToInsert);
    let message = "hello";
    let user = req.session.User;
    res.redirect('/feedback/feedback')
})


router.get('/remove', async (req, res) =>{
    await remove(FEEDBACK_TABLE);

    res.redirect("/feedback/feedback");
})

router.post('/reply', async (req, res) =>{
    const curUser = getCurrentUserSession(req,res);
    if (!curUser){
        req.session.error = 'please login first!';
        res.redirect("/authen/login");
        return;
    }
    let fbId = req.query.id;

    let replyContent = req.body.txtReply;
    console.log(replyContent);

    let condition = {'_id':ObjectID(fbId)}
    let data = {
        $set: {reply: replyContent}
    }
    await updateObject(condition, FEEDBACK_TABLE,data)
    res.redirect("/feedback/feedback");
})

// router.post('/reply',async(req,res)=>{
//     const id = req.body.ctid
//     const reply = req.body.reply
//     const UpdateValue = {$push: {reply:{  content: reply}} }
//     console.log(UpdateValue)
//     const update = await dbHandler.updateDocument(id,UpdateValue,"Feedback")
//     console.log(update)
//     res.redirect('/feedback/feedback')
// })
module.exports = router;