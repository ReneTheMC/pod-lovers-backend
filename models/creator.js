const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = new Schema({
    pcid:String,
    name:String,
    informalName:String,
    bio:String,
    location:String,
    imageUrl:String,
    birthday: String,
    followerCount: String,
comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
}]
});

// const Creator = mongoose.model('Creator', creatorSchema);

// module.exports = {Creator, creatorSchema};