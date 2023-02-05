const mongoose = require('mongoose');
const { Schema } = mongoose;

const spotifySchema = new Schema({
    settingsName: String,
    spotifyAccessToken: String,
});

module.exports = mongoose.model('spotifySchema', spotifySchema);