
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
const { GraphQLString, GraphQLBoolean, GraphQLInt } = require('graphql');
var userModel = require('../models/User')
var playlistModel = require('../models/Playlist')
var GraphQLDate = require('graphql-date');

var Friend = new GraphQLObjectType({
    name: 'Friend',
    fields: function () {
      return {
        friendId: {
          type: GraphQLString
        },
        messageHistory: {
          type: GraphQLList(message_history)
        }
      }
    }
  });
var recentSong= new GraphQLObjectType({
    name:'recentSong',
    fields: function(){
        return{
            playlist_id:{
                type: GraphQLString
            },
            uri:{
                type: GraphQLString
            }
        }
    }
});
var message_history = new GraphQLObjectType({
    name: 'message_history',
    fields: function () {
      return {
       senderId: {
          type: GraphQLString
        },
        message: {
          type: GraphQLString
        }
      }
    }
  });
var UserType = new GraphQLObjectType({
    name: 'UserObject',
    fields: function () {
      return {
        _id: {
          type: GraphQLString
        },
        password: {
          type: GraphQLString
        },
        email: {
          type: GraphQLString
        }, 
        profileName:{
          type: GraphQLString
        }, 
        library:{
          type: GraphQLList(GraphQLString)
        },
        friends:{
          type: GraphQLList(Friend)
        }

      }
    }
  });

  var song = new GraphQLObjectType({
    name: "songObject",
    fields: function(){
      return {
        title: {
          type:  GraphQLString
        }, 
        artist:{
          type: GraphQLString
        }, 
        duration:{
          type:  GraphQLString
        }, 
        uri:{
          type:  GraphQLString
        }, 
        image:{
          type: GraphQLString
        }
      }
    }
  });

var PlaylistType = new GraphQLObjectType({
    name: 'PlaylistObject',
    fields: function () {
      return {
        _id: {
          type: GraphQLString
        },
        userID: {
          type: GraphQLString
        },
        public: {
          type: GraphQLBoolean
        }, 
        name:{
          type: GraphQLString
        },
        songs:{
          type: GraphQLList(song)
        },
        likes: {
          type: GraphQLInt
        }
      }
    }
  });
  
var queryType = new GraphQLObjectType({
    name: 'Query',
    fields: function () {
        return {
            all_users: {
                type: new GraphQLList(UserType),
                resolve: function () {
                    const users = userModel.find().exec()
                    if (!users) {
                        throw new Error('Error')
                    }
                    return users;
                }
            }, 
            user:{
              type:UserType, 
              args:{
                  id: {
                    name: '_id',
                    type: GraphQLString
                  }
                },
                  resolve: function (root, params) {
                    const userDetails = userModel.findById(params.id).exec()
                    if (!userDetails) {
                      throw new Error('Error')
                    }
                    return userDetails
                  }
                },
            message_history:{
              type: UserType,
              args:{
                userId: {
                  name: '_id',
                  type: GraphQLString
                },
                friendId: {
                  name: 'friendId',
                  type: GraphQLString
                }
              },
              resolve: function (root, params) {
                const userDetails = userModel.findOne({ "_id": params.userId, "friends.friendId": params.friendId }, { 'friends.$': 1 }).exec()
                if (!userDetails) {
                  throw new Error('Error')
                }
                return userDetails
              }
            },
            all_playlists: {
              type: new GraphQLList(PlaylistType),
              resolve: function () {
                  const playlists = playlistModel.find().exec()
                  if (!playlists) {
                      throw new Error('Error')
                  }
                  return playlists;
              }
        }, 
        Playlist:{
          type: PlaylistType,
          args:{
          id: {
              name: '_id',
              type: GraphQLString
            }
          }, 
          resolve: function(root, params){
            const playlists = playlistModel.findById(params.id).exec()
                  if (!playlists) {
                      throw new Error('Error')
                  }
                  return playlists;
          }
        }
      }
    }
    });

var mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: function () {
      return {
          addUser: {
              type: UserType,
              args: {
                  profileName: {
                    type: new GraphQLNonNull(GraphQLString)
                  },
                  email: {
                    type: new GraphQLNonNull(GraphQLString)
                  },
                  password: {
                    type: new GraphQLNonNull(GraphQLString)
                  }
              },
              resolve: function (root, params) {
                  const user = new userModel(params);
                  const newLogo = user.save();
                  if (!newLogo) {
                      throw new Error('Error');
                  }
                  return user;
              }
          },
          addPlaylist: {
            type: PlaylistType,
            args: {
                userID: {
                  type: new GraphQLNonNull(GraphQLString)
                },
                public: {
                  type: new GraphQLNonNull(GraphQLBoolean)
                },
                name: {
                  type: new GraphQLNonNull(GraphQLString)
                },
                songs: {
                  type: new GraphQLNonNull(GraphQLList(GraphQLString))
                },
                likes: {
                  type: new GraphQLNonNull(GraphQLInt)
                }
            },
            resolve: function (root, params) {
                const playlist = new playlistModel(params);
                const newLogo = playlist.save();
                if (!newLogo) {
                    throw new Error('Error');
                }
                return playlist;
            }
        }
      }
  }
});

module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });