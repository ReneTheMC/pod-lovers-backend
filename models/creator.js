const mongoose = require('mongoose');
const { Schema } = mongoose;

const creatorSchema = new Schema({
    pcid:String,
    name:String,
    informalName:String,
    bio:String,
    location:String,
    imageUrl:String,
    socialLinks:String,
users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
}],
comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
}]
});

const Creator = mongoose.model('Creator', creatorSchema);

module.exports = Creator;