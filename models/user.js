const mongoose = require('mongoose');
const { Schema } = mongoose;
const creatorSchema = require('./creator')

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    date: {
        type: Date,
        default: Date.now()
    },
    favorites:[creatorSchema],
    // favoritePodcast:[podcastSchema]
    commen
})


const User = mongoose.model('User', userSchema);

module.exports = User;