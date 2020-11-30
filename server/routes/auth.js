

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var User = require('../models/User');
var playlist = require('../models/Playlist');
const cors = require('cors');
const { default: Axios } = require('axios');
router.use(cors())



router.post('/register', function (req, res) {
  console.log('on post method');
  console.log('register');
  let password = req.body.password;
  let email = req.body.email;
  let profileName = req.body.profileName;
  if (profileName === '' || password === '' || email === '') {
    console.log('the user nanme is empty');
    res.json({ success: false, msg: 'Please pass username and password.' });
  } else {
    var newUser = new User({
      profileName: profileName,
      password: password,
      email: email,
      library: [], 
      likedPlaylists:[]
    });

    User.findOne({
      email: newUser.email
    })
      .then(user => {
        if (!user) {
          console.log("the user was not  found");
          // save the user
          newUser.save(function (err) {
            if (err) {
              console.log("username already exists!")
              return res.json({ success: false, msg: 'Username already exists.' });
            }
            console.log("returning new user")
            res.json({ success: true, msg: 'Successful created new user.', user:newUser });
          });

        } else {
          console.log("user already exist ")
          res.json({ error: 'User already exists',  user:user})
        }
      })
      .catch(err => {
        res.send('error: ' + err)
      })
  }
});

router.post('/getPlaylist', function (req, res) {
  let trackId = req.body.playlistId;
  // console.log(trackId, " in aiuth")
  playlist.findOne({
    "_id": trackId
  }, function (err, playlist_res) {
    if (err) throw err;

    // console.log(playlist_res)
    res.json({ playlist: playlist_res });
  })

})

router.post('/getUser', function (req, res) {
  let userId = req.body.userId;
  User.findById({ "_id": userId }, function (err, user) {
    if (err) throw err;
    // console.log(user)
    res.json({ user: user });
  })

})

router.post('/addPlaylist', function (req, res) {
  let userId = req.body.userId;
  let playlistId = req.body.playlistId;
  // console.log("in add playlist", playlistId);

  User.updateOne(
    { "_id": userId },
    { "$push": { "addedPlaylists": playlistId } },
    // {$push: {"library.$": playlistId}},
    function (err, user) {
      if (err) throw err;
      // console.log(user)
      res.json({ user: user });
    }
  )
  // }
})
router.post('/updateLikedPlaylist', function (req, res) {
  let userId = req.body.userId;
  let likedPlaylists = req.body.likedPlaylists;
  User.findByIdAndUpdate(
    { "_id": userId },
    {  "likedPlaylists": likedPlaylists },{new: true},
    function (err, user) {
      if (err) throw err;
      // User.save();
      // console.log(user)
      res.json({ user: user });
    }
  )
})
router.post('/updatePlaylist', function (req, res) {
  let playlistId = req.body.playlistId;
  let playlistName = req.body.playlistName;
  let songs = req.body.songs;

  playlist.findByIdAndUpdate(
    { "_id": playlistId },
    {  "name": playlistName, "songs": songs },{new: true},
    function (err, playlist) {
      if (err) throw err;
      playlist.save();
      // console.log(playlist)
      res.json({ playlist: playlist });
    }
  )
})

router.post('/playlistPublic', function (req, res){
  let playlistId = req.body.playlistId;
  let public = req.body.public;
  playlist.findByIdAndUpdate(
    { "_id": playlistId },
    {  "public": public } ,{new: true},
    function (err, playlist) {
      if (err) throw err;
      // console.log(playlist)
      res.json({ playlist: playlist });
    }
  )

})

router.post('/homePlaylists', function (req, res) {
  playlist.find({}, function (err, playlists) {
    if (err) throw err;
    // console.log("all of the platylists")
    // console.log(playlists)
    res.json({ playlist: playlists });
  })

})
router.post('/login', function (req, res) {
  let email = req.body.email;
  let password = req.body.password;
  User.findOne(
    {
      email: email,
      password: password
    },
    function (err, user) {
      if (err) throw err;

      if (!user) {
        res.status(401).send({
          success: false,
          msg: 'Authentication failed. User not found.',
        });
      } else {
        if (password != user.password) {
          res.status(401).send({
            success: false,
            msg: 'Authentication failed. Wrong password.',
          });
        }
        // console.log("the user id is: ", user._id)
        res.json({ success: true, msg: "passwords matched we are good", userId: user._id });
      }
    }
  );
});

router.post('/updateLikes', function (req, res) {
  let playlistId = req.body.playlistId;
  let likes = req.body.likes;
  playlist.findByIdAndUpdate(
    { "_id": playlistId },
    {  "likes": likes } ,{new: true},
    function (err, playlist) {
      if (err) throw err;
      // console.log(playlist)
      res.json({ playlist: playlist });
    }
  )
})
router.post('/removePlaylist', function (req, res) {
  let userId = req.body.userId;
  let library = req.body.library;
  User.findByIdAndUpdate(
    { "_id": userId },
    {  "library": library } , {new: true},
    function (err, user) {
      if (err) throw err;
      // console.log(user)
      res.json({ user: user });
    }
  )
})
router.post('/removeAddedPlaylist', function (req, res) {
  let userId = req.body.userId;
  let library = req.body.library;
  User.findByIdAndUpdate(
    { "_id": userId },
    {  "addedPlaylists": library } , {new: true},
    function (err, user) {
      if (err) throw err;
      // console.log(user)
      res.json({ user: user });
    }
  )
})

router.post('/createPlaylist', function(req, res) {
  // console.log("in create playlist")
  var newPlaylist = new playlist({
    songs: req.body.songs,
    userID: req.body.userId,
    public: req.body.public,
    name: req.body.name,
    likes: req.body.likes
  });
  newPlaylist.save(function (err, playlist) {
    if (err) {
      console.log(err)
    }
    // console.log("success", res)
    res.json({playlist: playlist})
  });
})

router.post('/addMessage', function (req, res) {
  let userId = req.body.userId;
  let friendId = req.body.friendId;
  let message = req.body.message;

  let user = User.findOneAndUpdate(
    { "_id": userId, "friends.friendId": friendId },
    {
        "$push": {
            "friends.$.messageHistory": message
        }
    },
    {
      new: true
    })
    user.then((data) => {
      res.json(data)
    })
    .catch((err) => {
      console.log(err)
    })
})

router.post('/addPublicMessage', function (req, res) {
  let playlistId = req.body.playlistId;
  let message = req.body.message;

  let p = playlist.findOneAndUpdate(
    { "_id": playlistId },
    {
        "$push": {
            "messageHistory": message
        }
    },
    {
      new: true
    })
    p.then((data) => {
      res.json(data)
    })
    .catch((err) => {
      console.log(err)
    })
})

module.exports = router;
