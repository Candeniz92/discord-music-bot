const mongoose = require('mongoose');
const { Schema } = mongoose;

const playlistSchema = new Schema({
    name: String,
    url: String,
    id: String,
    createdAt: String
});

module.exports = mongoose.model('playlistSchema', playlistSchema);