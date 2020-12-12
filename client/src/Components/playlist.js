import React from 'react';
import { Link } from 'react-router-dom';
import './css/playlist.css'
import axios from 'axios';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import { Button, Modal } from 'react-bootstrap'


class Playlist extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      playlist: this.props.playlist,
      modalShow: false,
      friends: [],
      shareWith: [],
      checked: []
    }
  }
  componentDidMount=  ()=> {
    // console.log((this.state.friends).length)

    axios.post('/auth/getUser', { userId: this.props.userID }).then((res) => {
      let temp = []
      let requests = this.getFriends(res.data.user);
      axios.all(requests).then(axios.spread((...responses) => {
        for (var i = 0; i < responses.length; i++) {
          temp.push(responses[i].data.user)
        }
        let length = temp.length;
        var arr = Array(length).fill(false);
        // return result
        this.setState({ checked: arr, friends: temp , user: res.data.user})
      })).catch(errors => {
        console.log(errors)
      })
    }).catch((err) => {
      console.log(err)
    })
  }

   getFriends = (user)=>  {
    // console.log("getting friends")
    let requests = []
    
    var i = 0;
    for (i; i < user.friends.length; i++) {
      console.log(user.friends[i])
      requests.push(axios.post('/auth/getUser', { userId: user.friends[i].friendId }))
    }
    return requests
  
  }

  addToLibrary = () => {
    console.log("in addToLibrary", this.props.playlist._id);
    console.log(this.props.playlist);
    console.log('the user id is ', this.props.userID)
    axios.post('/auth/addPlaylist', { userId: this.props.userID, playlistId: this.props.playlist._id })
      .then(res => {
        console.log("added to the database")
        console.log(res.data)
      })
      .catch(error => {
        console.log(error)
      });
  }
  likePlaylist = (undo) => {
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
      if (result.isLiked) {
        //change color of icon
        tempArr.splice(i, 1);
        axios.post('/auth/updateLikedPlaylist', { userId: this.state.user._id, likedPlaylists: tempArr }).then((res) => {
          console.log("unliked here")
          this.setState({ user: res.data.user }, (() => {
            this.updateLikes(this.state.playlist.likes - 1)
            // document.getElementById(this.state.playlist._id).style.color = "white"
          }))

        }).catch((err) => {
          console.log(err)
        })
        if (!undo){
          this.props.undoCallback(this.likePlaylist);
        }
        if (undo) {
          this.props.redoCallback(this.likePlaylist);
        }
      }
      else {
        //change color of icon
        tempArr[i].isLiked = true;
        axios.post('/auth/updateLikedPlaylist', { userId: this.props.userID, likedPlaylists: tempArr }).then((res) => {
          console.log("unliked here")
          this.setState({ user: res.data.user }, (() => {
            this.updateLikes(this.state.playlist.likes + 2)
            // document.getElementById(this.state.playlist._id).style.color = "#007bff"
            // document.getElementById(this.state.playlist._id+this.state.playlist._id).style.color = "white"
          }))

        }).catch((err) => {
          console.log(err)
        })
        if (!undo){
          this.props.undoCallback(this.unlikePlaylist);
        }
        if (undo) {
          this.props.redoCallback(this.unlikePlaylist);
        }
      }

    } else {
      console.log(this.state.user._id, " in playlist")
      //change color of icon => blue
      tempArr.push({ playlistId: this.state.playlist._id, isLiked: true })
      axios.post('/auth/updateLikedPlaylist', { userId: this.props.userID, likedPlaylists: tempArr }).then((res) => {
        console.log("unliked here")
        this.setState({ user: res.data.user }, (() => {
          this.updateLikes(this.state.playlist.likes + 1)
          // document.getElementById(this.state.playlist._id).style.color = "#007bff"
        }))
      }).catch((err) => {
        console.log(err)
      })
      if (!undo){
        this.props.undoCallback(this.likePlaylist);
      }
      if (undo) {
        this.props.redoCallback(this.likePlaylist);
      }
    }
    
  }
  unlikePlaylist = (undo) => {
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
            // document.getElementById(this.state.playlist._id+this.state.playlist._id).style.color = "white"
          }))

        }).catch((err) => {
          console.log(err)
        })
        if (!undo){
          this.props.undoCallback(this.unlikePlaylist);
        }
        if (undo) {
          this.props.redoCallback(this.unlikePlaylist);
        }
      }
      else {
        //change color of icon
        tempArr[i].isLiked = false;
        axios.post('/auth/updateLikedPlaylist', { userId: this.props.userID, likedPlaylists: tempArr }).then((res) => {
          console.log("unliked here")
          this.setState({ user: res.data.user }, (() => {
            this.updateLikes(this.state.playlist.likes - 2)
            // document.getElementById(this.state.playlist._id+this.state.playlist._id).style.color = "#007bff"
            // document.getElementById(this.state.playlist._id).style.color = "white"
          }))

        }).catch((err) => {
          console.log(err)
        })
        if (!undo){
          this.props.undoCallback(this.likePlaylist);
        }
        if (undo) {
          this.props.redoCallback(this.likePlaylist);
        }
      }

    } else {
      console.log(this.state.user._id, " in playlist")
      //change color of icon => blue
      tempArr.push({ playlistId: this.state.playlist._id, isLiked: false })
      axios.post('/auth/updateLikedPlaylist', { userId: this.props.userID, likedPlaylists: tempArr }).then((res) => {
        console.log("unliked here")
        this.setState({ user: res.data.user }, (() => {
          this.updateLikes(this.state.playlist.likes - 1)
          // document.getElementById(this.state.playlist._id+this.state.playlist._id).style.color = "#007bff"
        }))
      }).catch((err) => {
        console.log(err)
      })
      if (!undo) {
        this.props.undoCallback(this.unlikePlaylist);
      }
      if (undo) {
          this.props.redoCallback(this.unlikePlaylist);
      }
    }
    
  }
  updateLikes = (likes) => {

    console.log("In likes")
    console.log("likes: ", this.state.playlist.likes);
    if (likes < 0) {
      likes = 0;
    }

    axios.post('/auth/updateLikes', { playlistId: this.props.playlist._id, likes: likes })
      .then(res => {
        console.log(res.data)
        this.setState({ playlist: res.data.playlist }, () => {
          document.getElementById("likes").value = res.data.playlist.likes;
        })
      })
      .catch(error => {
        console.log(error)
      });
  }

  handleModal(e, value) {
    e.preventDefault()
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

  render() {
    if (this.state.user == null) {
      return <div>Loading</div>
    }

    var colorL = "white", colorD = "white";
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
        colorL = "#007bff"
      }
      else {
        colorD = "#007bff"
      }
    }

    return (
      <div>
        <Link to={{ pathname: `/publicPlayer/${this.props.playlist._id}`, state: { source: '/home' } }}>
          <div className="cardsWrapInner">
            <div className="home-card" >
              <div className="cardImage">
                <img className="songCover" src={this.state.playlist.songs[0].image} alt="Pic 1" />
                <div className="hoverContainer">
                  <div style={{ "marginBottom": "10px" }} className="first">
                    <Link onClick={this.addToLibrary}><i className="fas fa-plus-circle" style={{ "marginRight": "10px", "fontSize": "2rem", "color": "white" }}></i></Link>
                    <Link onClick={() => this.likePlaylist(false)}><i id={this.state.playlist._id} className="fa fa-thumbs-up" style={{ "fontSize": "2rem", "color": `${colorL}` }}></i></Link>
                  </div>
                  <div className="second">
                    <Link > <i onClick={(e) => { this.handleModal(e, true) }} className="fa fa-share-alt" style={{ "marginRight": "10px", "fontSize": "2rem", "color": "white" }}></i></Link>
                    <Link onClick={() => this.unlikePlaylist(false)}><i id={this.state.playlist._id + this.state.playlist._id} className="fa fa-thumbs-down" style={{ "fontSize": "2rem", "color": `${colorD}` }}></i></Link>
                  </div>
                </div>
              </div>
              <div style={{ "minHeight": '60px', "maxHeight": "80px" }} className="card-body text-center">
                <h2 style={{ "maxHeight": "40px" }} className="card-title">{this.state.playlist.name}</h2>
                <div className="users">
                  <i style={{ "color": "white", "position": "absolute", "top": "20px", "left": "30%" }} className="fas fa-user"></i>
                  <label id='likes' inputMode={'numeric'} style={{ "overflow": "hidden", "maxWidth": "90px", "color": "white", "position": "absolute", "top": "14px" }}>{this.state.playlist.likes}</label>
                </div>
              </div>
            </div>
          </div>
        </Link>
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
                <ListItem key={friend._id}  >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      disableRipple
                      checked={this.state.checked[index]}
                      id={friend._id}
                      onClick={(e) => { this.checked(e, friend._id, index) }}
                    />
                  </ListItemIcon>
                  {friend.profileName}
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

    )
  }
}
export default Playlist;