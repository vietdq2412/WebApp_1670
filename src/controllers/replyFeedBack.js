var mongoose = require('mongoose')
    , Schema = mongoose.Schema
var mongoDB = 'mongodb+srv://ducanh1610:543694@cluster0.9rpbx.mongodb.net/test'
    mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

var ReplyFeedbackSchema = Schema({
    replyFeedback:{type:String, required:true},
})

module.exports = mongoose.model('ReplyFeedback', ReplyFeedbackSchema);