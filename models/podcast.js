const mongoose = require('mongoose');
const { Schema } = mongoose;

const podcastSchema = new Schema({
    imageUrl: String,
    title: String,
    description: String
});

const Podcast = mongoose.model('Podcast', podcastSchema);

module.exports = Podcast;
