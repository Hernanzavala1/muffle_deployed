import React from 'react';
import { Link } from 'react-router-dom';
import './css/playlist_player.css'
import './css/Network.css'
import data from '../data.json'
import SimpleChatItem from './SimpleChatItem'
import axios from 'axios'
import SimplePlaylistTable from './SimplePlaylistTable'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import { Button, Modal } from 'react-bootstrap'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
// import io from 'socket.io-client';
var socket = io.connect('http://muffle-deployment1.herokuapp.com/');
// const socket = socketIOClient.connect("http://muffle-deployment1.herokuapp.com/");
// const socket = require('socket.io-client')('http://muffle-deployment1.herokuapp.com/', {
//   transports: ['websocket'],
//   rejectUnauthorized: false
// })
class publicPlaylistPlayer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            user: null,
            playlist: null,
            modalShow: false,
            friends: [{ name: 'ryan Brener', id: "5faa29f181cddb09b45fcd81" }, { name: 'julia Furry', id: "5fac8c0341b6513ea83e9a12" }],
            shareWith: [],
            checked: [],
            channel: "",
            message:"",
            messageHistory: []
        }

    }
    componentDidMount = () => {
        document.getElementById("app").style.height = "calc(100vh - 90 px)";
        // console.log(this.props.match.params.id , " is the id")
        let playlistId = this.props.match.params.id
        if (this.props.location.state !== undefined) {
          this.source = this.props.location.state.source;
        }
        axios.post('/auth/getPlaylist', { playlistId }).then(res => {
            let length = (this.state.friends).length;
            var arr = Array(length).fill(false);
            this.setState({ playlist: res.data.playlist, checked: arr, messageHistory: res.data.playlist.messageHistory }, () => {
                console.log("we are updating the playlist from online")
                this.props.updatePlaylist(this.state.playlist);
                document.getElementById("ul_chat").scrollTop = document.getElementById("ul_chat").scrollHeight;
            })
            if (this.state.playlist == null) {
                this.props.updatePlaylist(data.publicPlayer.publicPlaylist.playlist);
            }

            axios.post('/auth/getUser', { userId: this.props.userID }).then((res) => {
                this.setState({ user: res.data.user })
                var tempArr = []
                Object.assign(tempArr, this.state.user.likedPlaylists)
                let result = null;
                var i;
                for (i = 0; i < tempArr.length; i++) {
                  if (tempArr[i].playlistId === this.state.playlist._id) {
                    result = tempArr[i];
                    break;
                  }
                }
                if (result != null) {
                  if (result.isLiked) {
                    document.getElementById("likeButton").style.color = "#007bff"
                  }
                  else {
                    document.getElementById("dislikeButton").style.color = "#007bff"
                  }
                }
              }).catch((err) => {
                console.log(err)
              })

        }).catch(err => {
            console.log(err)
        })

        var tempA = []
        socket.on('publicMessage', data => {
            if (data.channel == this.state.channel) {
                var mObj = {
                    message: data.message,
                    profileName: data.profileName
                }
                console.log(mObj.profileName)
                Object.assign(tempA, this.state.messageHistory)
                tempA.push(mObj)
                console.log("HEY");
                this.setState({ messageHistory: tempA }, function() {document.getElementById("ul_chat").scrollTop = document.getElementById("ul_chat").scrollHeight;})
            }
        });
    }

    setChannel = () => {
      this.setState({ messageHistory: this.state.playlist.messageHistory, 
          channel: this.state.playlist.socketId }, () => {
          socket.emit("joinChannel", {
              channel: this.state.channel
          })
      })
  }

  updatePlaylist=()=>{
    axios.post('/auth/getPlaylist', { playlistId: this.state.playlist._id}).then(res => {
        this.setState({ playlist: res.data.playlist }, this.setChannel)
    }).catch(err => {
        console.log(err)
    })
  }

    likePlaylist = () => {
        console.log("in like")
        if (this.state.user == null) {
          return
        }
    
        var tempArr = []
        Object.assign(tempArr, this.state.user.likedPlaylists)
        let result = null;
        var i;
        for (i = 0; i < tempArr.length; i++) {
          if (tempArr[i].playlistId === this.state.playlist._id) {
            result = tempArr[i];
            break;
          }
        }
        if (result != null) {
          if (result.isLiked) {
            tempArr.splice(i, 1);
            axios.post('/auth/updateLikedPlaylist', { userId: this.state.user._id, likedPlaylists: tempArr }).then((res) => {
              console.log("unliked here")
              this.setState({ user: res.data.user }, (() => {
                this.updateLikes(this.state.playlist.likes - 1)
                document.getElementById("likeButton").style.color = "white"
              }))
    
            }).catch((err) => {
              console.log(err)
            })
          }
          else {
            //change color of icon
            tempArr[i].isLiked = true;
            axios.post('/auth/updateLikedPlaylist', { userId: this.props.userID, likedPlaylists: tempArr }).then((res) => {
              this.setState({ user: res.data.user }, (() => {
                this.updateLikes(this.state.playlist.likes + 2)
                document.getElementById("likeButton").style.color = "#007bff"
                document.getElementById("dislikeButton").style.color = "white"
              }))
    
            }).catch((err) => {
              console.log(err)
            })
          }
    
        } else {
          tempArr.push({ playlistId: this.state.playlist._id, isLiked: true })
          axios.post('/auth/updateLikedPlaylist', { userId: this.props.userID, likedPlaylists: tempArr }).then((res) => {
            this.setState({ user: res.data.user }, (() => {
              this.updateLikes(this.state.playlist.likes + 1)
              document.getElementById("likeButton").style.color = "#007bff"
            }))
          }).catch((err) => {
            console.log(err)
          })
        }
      }
      unlikePlaylist = () => {
        if (this.state.user == null) {
          return
        }
    
        var tempArr = []
        Object.assign(tempArr, this.state.user.likedPlaylists)
        console.log(this.state.user, "user")
        console.log(tempArr, "array in liekd")
        let result = null;
        var i;
        for (i = 0; i < tempArr.length; i++) {
          if (tempArr[i].playlistId === this.state.playlist._id) {
            result = tempArr[i];
            break;
          }
        }
        console.log(result, " found ")
        if (result != null) {
          if (!result.isLiked) {
            //change color of icon
            tempArr.splice(i, 1);
            axios.post('/auth/updateLikedPlaylist', { userId: this.state.user._id, likedPlaylists: tempArr }).then((res) => {
              console.log("unliked here")
              this.setState({ user: res.data.user }, (() => {
                this.updateLikes(this.state.playlist.likes + 1)
                document.getElementById("dislikeButton").style.color = "white"
              }))
    
            }).catch((err) => {
              console.log(err)
            })
          }
          else {
            //change color of icon
            tempArr[i].isLiked = false;
            axios.post('/auth/updateLikedPlaylist', { userId: this.props.userID, likedPlaylists: tempArr }).then((res) => {
              this.setState({ user: res.data.user }, (() => {
                this.updateLikes(this.state.playlist.likes - 2)
                document.getElementById("dislikeButton").style.color = "#007bff"
                document.getElementById("likeButton").style.color = "white"
              }))
    
            }).catch((err) => {
              console.log(err)
            })
          }
    
        } else {
          tempArr.push({ playlistId: this.state.playlist._id, isLiked: false })
          axios.post('/auth/updateLikedPlaylist', { userId: this.props.userID, likedPlaylists: tempArr }).then((res) => {
            this.setState({ user: res.data.user }, (() => {
              this.updateLikes(this.state.playlist.likes - 1)
              document.getElementById("dislikeButton").style.color = "#007bff"
            }))
          }).catch((err) => {
            console.log(err)
          })
        }
      }

    updateLikes = (likes) => {
        console.log("In likes")
        console.log("likes: ", this.state.playlist.likes);
        if (likes < 0) {
            likes = 0;
        }

        axios.post('/auth/updateLikes', { playlistId: this.state.playlist._id, likes: likes })
            .then(res => {
                console.log(res.data)
                this.setState({ playlist: res.data.playlist }, () => {

                })
            })
            .catch(error => {
                console.log(error)
            });
    }
    handleModal(e, value) {
        e.preventDefault();
        // W3C model
        let length = (this.state.friends).length;
        var arr = Array(length).fill(false);
        if (!value) {
            this.setState({ modalShow: value, shareWith: [], checked: arr }, () => {
                console.log("we are opening the modal? ", value)
            })
        }
        else {
            this.setState({ modalShow: value }, () => {
                console.log("we are opening the modal? ", value)
            })
        }

    }
    checked = (e, id, index) => {
        e.preventDefault();
        let tempArr = [];
        Object.assign(tempArr, this.state.shareWith);
        let checked = [];
        Object.assign(checked, this.state.checked);
        if (!tempArr.includes(id) && !checked[index]) {
            tempArr.push(id);
            checked[index] = true;
            this.setState({ shareWith: tempArr, checked: checked }, () => {
                console.log("the state should have been updated by now")

            })
        }
        else {
            console.log("deleting it from the array")
            tempArr.splice(tempArr.indexOf(id), 1)
            checked[index] = false;
            this.setState({ shareWith: tempArr, checked: checked })

        }
    }

    sharePlaylist = (e) => {
        e.preventDefault()
        this.state.shareWith.map((friendId) => {
            axios.post('/auth/addPlaylist', { userId: friendId, playlistId: this.state.playlist._id }).then(() => {
                console.log("succesfully added to ", friendId)
            }).catch()
        })
        console.log("we finished all of the friends list")
        this.setState({ modalShow: false, shareWith: [], checked: [] })

    }

  onChangeMessage = (e) => {
    this.setState({
        message: e.target.value
    });
  }

  sendMessage = (e) => {
      e.preventDefault()

      var mObj = {
          message: this.state.message,
          senderId: this.props.userID,
          profileName: this.state.user.profileName
      }
      console.log(mObj.profileName)
      var tempA = []
      Object.assign(tempA, this.state.messageHistory)
      tempA.push(mObj)

      axios.post('/auth/addPublicMessage', { playlistId: this.state.playlist._id, message: mObj }).then(res => {
          console.log("playlist", res.data)

          this.setState({ messageHistory: tempA, message: "", playlist: res.data }, function() {document.getElementById("ul_chat").scrollTop = document.getElementById("ul_chat").scrollHeight;})
      }).catch(err => {
          console.log(err)
      })

      socket.emit('publicChat', {
          channel: this.state.channel,
          message: this.state.message,
          profileName: this.state.user.profileName
      });
  }

    render() {
        var temp;
        var songs;

        // console.log("RIGHT BEFORE IF")
        if (this.state.playlist == null) {
            // console.log("INSIDE IFFFF")
            temp = data.publicPlayer.publicPlaylist;
            songs = data.publicPlayer.publicPlaylist.playlist;
        }
        else {
            temp = this.state.playlist;
            songs = this.state.playlist.songs;
        }
        console.log(songs)
        return (
            <div className="player_container">
                <div id="row1_player" className="row height:10%">
                    <Link to={this.source} style={{ "display": "flex" }}>
                        <div><i className="fas fa-long-arrow-alt-left" style={{ "color": "White", "textAlign": "center" }}></i></div>
                        <div> <label style={{ "color": "White", "textAlign": "center", "fontWeight": "bold", "margin-left": "5px", "cursor": "pointer" }}>Back</label></div>
                    </Link>
                </div>
                <div style={{ "margin": "20px", "marginBottom": "25px" }} className="row height:15% ">
                    <div className="col">
                        <h3 style={{ "color": "white" }}>{temp.name}</h3>
                    </div>
                    <div className="col justify-content:space-between">
                        <div id="playlist-options">
                            <Link><i onClick={(e) => { this.handleModal(e, true) }} className="fa fa-share-alt" style={{ "fontSize": "2.5rem", "color": "white", "marginRight": "35px" }}></i></Link>
                            <Link onClick={() => this.likePlaylist()}><i id="likeButton" className="fa fa-thumbs-up" aria-hidden="true" style={{ "fontSize": "2.5rem", "color": "white", "marginRight": "35px" }}></i></Link>
                            <Link onClick={() => this.unlikePlaylist()}><i id="dislikeButton" className="fa fa-thumbs-down" aria-hidden="true" style={{ "fontSize": "2.5rem", "color": "white" }}></i></Link>
                        </div>
                    </div>
                </div>
                <div className="row height:70%" style={{ "columnGap": "150px" }}>
                    <div className='col-5' >
                        <div className="table-wrapper-scroll-y my-custom-scrollbar height:inherit" style={{ "minHeight": "50vh", "maxHeight": "50vh" }}>
                            <table scope="col" className="table table-dark table-fixed ">
                                <thead>
                                    <tr>
                                        <th id="column_title" scope="col">Title</th>
                                        <th id="column_title" scope="col">Artist</th>
                                        <th id="column_title" scope="col">Time</th>
                                    </tr>
                                </thead>
                                <SimplePlaylistTable playlists={songs} updateSong={this.props.updateSong} playSong={this.props.playSong}></SimplePlaylistTable>
                            </table>
                        </div>
                    </div>
                    <div className="col" >
                        <div className="container_chat" style={{ "minHeight": "50vh", "maxHeight": "50vh", "backgroundRepeat": "no-repeat", "backgroundPosition": "center",  "backgroundImage":`url(${songs[0].image})`}}>
                            {/* <div style={{ "position": "absolute", "minHeight": "100%", "minWidth": "100%", "backgroundRepeat": "no-repeat", "backgroundPosition": "center", "opacity": "0.5", "backgroundImage":`url(${songs[0].image})`}}  ></div> */}
                            <div>
                            <Tabs id="uncontrolled-tab-example">
                                <Tab eventKey="row_chat" title="Chat">
                                    <ul id="ul_chat">
                                        <SimpleChatItem messageHistory={this.state.messageHistory} userId={this.props.userID} publicPlayer={true}></SimpleChatItem>
                                    </ul>
                                    <div id="row_chat" className="row">
                                      <div className="col">
                                        <form onSubmit={this.sendMessage} autoComplete="off">
                                          <input id="text_input" type="text" style={{ "width": "100%" }} value={this.state.message} onChange={this.onChangeMessage}></input>
                                        </form>
                                      </div>
                                    </div>
                                </Tab>
                                <Tab eventKey="lyrics" title="Lyrics">
                                    <ul>
                                        {/* <SimpleChatItem className={"friend-item"} playlists={this.state.theirPlaylists}></SimpleChatItem> */}
                                    </ul>
                                    <div id="lyrics" className="row">
                                      <div className="col">
                                        <p>Here are the lyrics</p>
                                      </div>
                                    </div>
                                </Tab>
                            </Tabs>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    backdrop='static'
                    keyboard={false}
                    show={this.state.modalShow}
                >
                    <Modal.Header> Share playlist</Modal.Header>
                    <Modal.Body>
                        <h3> Select a friend to share the playlist with:</h3>
                        <List>
                            {this.state.friends.map((friend, index) => (
                                <ListItem key={friend.id}  >
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            disableRipple
                                            checked={this.state.checked[index]}
                                            id={friend.id}
                                            onClick={(e) => { this.checked(e, friend.id, index) }}
                                        />
                                    </ListItemIcon>
                                    {friend.name}
                                </ListItem>

                            ))}
                        </List>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="secondary" onClick={(e) => { this.sharePlaylist(e) }} > share </Button>
                        <Button className='secondary' onClick={(e) => this.handleModal(e, false)} data-dismiss="modal"> close </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
export default publicPlaylistPlayer;