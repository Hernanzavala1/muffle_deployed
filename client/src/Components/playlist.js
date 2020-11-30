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
      playlist: this.props.playlist,
      modalShow: false,
      friends: [{ name: 'ryan Brener', id: "5faa29f181cddb09b45fcd81" }, { name: 'julia Furry', id: "5fac8c0341b6513ea83e9a12" }],
      shareWith: [],
      checked: []
    }
  }
  componentDidMount = () => {
    console.log((this.state.friends).length)
    let length = (this.state.friends).length;
    var arr = Array(length).fill(false);
    this.setState({ checked: arr })
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


    return (
      <div>
        <Link to={`/publicPlayer/${this.props.playlist._id}`}>
          <div className="cardsWrapInner">
            <div className="home-card" >
              <div className="cardImage">
                <img className="songCover" src={this.state.playlist.songs[0].image} alt="Pic 1" />
                <div className="hoverContainer">
                  <div style={{ "marginBottom": "10px" }} className="first">
                    <Link onClick={this.addToLibrary}><i className="fas fa-plus-circle" style={{ "marginRight": "10px", "fontSize": "2rem", "color": "white" }}></i></Link>
                    <Link onClick={() => this.updateLikes(this.state.playlist.likes + 1)}><i className="fa fa-thumbs-up" style={{ "fontSize": "2rem", "color": "white" }}></i></Link>
                  </div>
                  <div className="second">
                    <Link > <i onClick={(e) => { this.handleModal(e, true) }} className="fa fa-share-alt" style={{ "marginRight": "10px", "fontSize": "2rem", "color": "white" }}></i></Link>
                    <Link onClick={() => this.updateLikes(this.state.playlist.likes - 1)}><i className="fa fa-thumbs-down" style={{ "fontSize": "2rem", "color": "white" }}></i></Link>
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

    )
  }
}
export default Playlist;