var mongoose = require('mongoose')
    , Schema = mongoose.Schema

var mongoDB = 'mongodb+srv://ducanh1610:543694@cluster0.9rpbx.mongodb.net/test'
    mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

var FeedbackSchema = Schema({
    firstname: {type:String, required:true},
    lastname: {type:String},
    mail: {type:String},
    nameBook:{type:String},
    country:{type:String},
    feedback:{type:String},
    replyFeedbackAdmin:{type:String}
})

module.exports = mongoose.model('Feedback', FeedbackSchema);