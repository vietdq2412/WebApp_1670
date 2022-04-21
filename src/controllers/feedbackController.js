const express = require('express')
const req = require('express/lib/request')
const async = require('hbs/lib/async')
const router = express.Router()
const { insertObject, getCurrentUserSession, search, remove,
     USERTABLE, FEEDBACK_TABLE } = require('../databaseHandler')


router.get('/feedback', async (req, res) =>{
    const curUser = getCurrentUserSession(req,res);
    if (!curUser){
        res.render('login', {error: 'please login first!'});
        return;
    }
console.log(curUser);
    let listFeedback = await search('',FEEDBACK_TABLE);

    res.render('feedback', {listFeedback:listFeedback, user:curUser});
})

router.post('/sent',async (req, res) =>{
    const curUser = getCurrentUserSession(req,res);
    if (!curUser){
        res.render('login', {error: 'please login first!'});
        return;
    }

    let content = req.body.text;
    let date = new Date;
    
    let objectToInsert = {
        user: curUser,
        content: content,
        date: date
    }

    await insertObject(FEEDBACK_TABLE, objectToInsert);
    let message = "hello";
    let user = req.session.User;
    res.redirect('/feedback/feedback')
})


router.get('/remove', async (req, res) =>{
    remove(FEEDBACK_TABLE);

    res.redirect("/feedback/feedback");
})

module.exports = router;