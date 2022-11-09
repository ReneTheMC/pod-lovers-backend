const mongoose = require('mongoose');
const { Schema } = mongoose;

const podcastSchema = new Schema({
    id: String,
    imageUrl: String,
    title: String,
    description: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

// const Podcast = mongoose.model('Podcast', podcastSchema);

// module.exports = Podcast;
