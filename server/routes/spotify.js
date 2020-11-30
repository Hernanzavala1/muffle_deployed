var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var User = require('../models/User');
const cors = require('cors')
router.use(cors())


router.get('/getSong', function (req, res) {
   let q = req.body.songName;
   let type = "type=album,artist,track"
   axios.get(`https://api.spotify.com/v1/search?q=${q}&${type}`,{},{headers:' Authorization: Bearer'  + 'varToken'}).then(res => {
       console.log(res);
   }).catch(err =>{
       console.log(err.message)
   })
  });

  axios({
    method: 'get', //you can set what request you want to be
    url: 'https://example.com/request',
    data: {},
    headers: {
      Authorization: 'Bearer ' + varToken
    }
  })
