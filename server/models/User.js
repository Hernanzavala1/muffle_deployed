var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
    id: String,
    profileName:{type:String , unique: true},
    password: String,
    email:{type:String , unique: true}, 
    profilePicture: String,
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
});
UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});
UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
  };
module.exports = mongoose.model('users', UserSchema);