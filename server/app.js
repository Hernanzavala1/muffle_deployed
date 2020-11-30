const express = require('express') // import express
 const bodyParser = require('body-parser') // import body-parser \
 var schema = require('../server/graphql/Schema');
 var mongoose = require('mongoose');
 var cookieParser = require('cookie-parser')
 const graphqlHTTP = require('express-graphql').graphqlHTTP;
 var cors = require('cors');
 const app = express() // create express server
 var auth = require('./routes/auth');
 require("dotenv").config();
const http = require('http');
const socketio = require('socket.io');
const { isObjectType } = require('graphql');
const server = http.createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  } 
});


app.use(express.urlencoded({ extended: true }));
 app.use(bodyParser.json()) // use body-parser middleware to parse incoming json

 

 mongoose
  .connect(process.env.ATLAS_URI, {
    promiseLibrary: require('bluebird'), useUnifiedTopology: true ,useNewUrlParser: true, }).then(() => console.log('connection successful')).catch((err) => console.error('this is the errror: ' + err)); 
 app.use(
    '/graphql',
    cors(),
    graphqlHTTP({
      schema: schema,
      rootValue: global,
      graphiql: true
    })
  );

 app.use('/auth', auth)

io.on('connection', socket => {
  //socket.broadcast.emit('message', 'User has joined');
  socket.channel = "";
  console.log("in connection")

  socket.on("joinChannel", function (data) {
    socket.channel = data.channel;
    console.log("on channel: ", data.channel)
  });



  socket.on('chat', function (data) {
    console.log("before emitting message")
    socket.broadcast.emit('message', {
      channel: socket.channel,
      message: data.message
    });
  })

  socket.on('publicChat', function (data) {
    console.log("before emitting message")
    socket.broadcast.emit('publicMessage', {
      channel: socket.channel,
      message: data.message,
      profileName: data.profileName
    });
  })
})
if(process.env.NODE_ENV ==="production" ){
  app.use(express.static("client/build"))
}
//  server.listen(5000) // setup server to run on port 5000 
app.listen(process.env.PORT || 5000)

 module.exports = app;
