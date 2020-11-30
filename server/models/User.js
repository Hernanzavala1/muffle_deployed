var mongoose = require('mongoose');


var UserSchema = new mongoose.Schema({
    id: String,
    profileName: String,
    password: String,
    email: String, 
    library: [
       { type: String}
    ],
    addedPlaylists: [
        { type: String}
     ],
    likedPlaylists:[
        {
            playlistId:String, 
            isLiked:Boolean
        }
    ],
    friends:[
        {
            friendId: String,
            socketId: String,
            messageHistory: [
                {
                    senderId: String,
                    message: String,
                }
            ]
        }
    ]
})

module.exports = mongoose.model('users', UserSchema);