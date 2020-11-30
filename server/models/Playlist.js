var mongoose = require('mongoose');


var PlaylistSchema = new mongoose.Schema({
    id: String,
    userID: String,
    public: Boolean,
    name: String,
    songs: [{
        title: String,
        artist: String,
        duration: String,
        uri:String, 
        image:String
    }],
    likes: Number,
    socketId: String,
    messageHistory: [
        {
            senderId: String,
            message: String,
            profileName: String,
        }
    ]
})

module.exports = mongoose.model('playlists', PlaylistSchema);