const mongoose = require('mongoose');
const { Schema } = mongoose;


const commentSchema = new Schema({
  pcid:String,
  user:String,
  rating:String,
  content:String,
  url:String,
  reviewedAt:String,
  modifiedDate:String,
  reply:String,

});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;