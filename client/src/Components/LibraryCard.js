import React from 'react';
import './css/Library.css'
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import axios from 'axios';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import { Button, Modal } from 'react-bootstrap'
class LibraryCard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: this.props.user,
            userId: this.props.userId,
            playlist: null,
            isLoading: true,
            modalShow: false,
            modalShowD: false,
            friends: [],
            shareWith: [],
            checked: [],
            library: this.props.library,
            playlistImages: []
        }
    }
    componentDidMount() {

        document.getElementById("app").style.height = "calc(100vh - 90px)";
        // TODO: DATA.JSON DATA IS GETTING PASSED IN, FIND HOW, ARBITRARY NUMBER 30 IS GREATER THAN THE LENGTH OF DATA.JSON BUT LESS THAN ID
        if (JSON.stringify(this.props.playlist).length > 30)
            return
        axios.post('/auth/getPlaylist', { playlistId: this.props.playlist }).then(res => {
            if (res.data.playlist === null) {
                this.props.deletePlaylist(this.props.playlist)
                return
            }
            else {
                this.setState({ playlist: res.data.playlist }, function () {
                    var image = this.state.playlist.songs[0].image;
                    var imageArray = [image, image, image, image];
                    for (var i = 0; i < this.state.playlist.songs.length; i++) {
                        imageArray[i] = this.state.playlist.songs[i].image;
                    }
                    this.setState({ playlistImages: imageArray });
                })
            }
            // let length = (this.state.friends).length;
            // var arr = Array(length).fill(false);
            // this.setState({ isLoading: false, checked: arr })
            if (this.state.user != null) {
                let temp = []
                let requests = this.getFriends(this.state.user);
                axios.all(requests).then(axios.spread((...responses) => {
                    for (var i = 0; i < responses.length; i++) {
                        temp.push(responses[i].data.user)
                    }
                    let length = temp.length;
                    var arr = Array(length).fill(false);
                    // return result
                    this.setState({ isLoading: false, checked: arr, friends: temp })
                })).catch(errors => {
                    console.log(errors)
                })
            }
        }).catch(err => {
            console.log(err)
        })
    }
    getFriends = (user) => {
        // console.log("getting friends")
        let requests = []

        var i = 0;
        for (i; i < user.friends.length; i++) {
            console.log(user.friends[i])
            requests.push(axios.post('/auth/getUser', { userId: user.friends[i].friendId }))
        }
        return requests

    }

    componentDidUpdate() {
        if (this.props.updated) {
            axios.post('/auth/getPlaylist', { playlistId: this.props.playlist }).then(res => {
                if (res.data.err) {
                    console.log("DELETED PLAYLIST CAUGHT")
                    return
                }
                this.setState({ playlist: res.data.playlist }, function () {
                    var image = this.state.playlist.songs[0].image;
                    var imageArray = [image, image, image, image];
                    for (var i = 0; i < this.state.playlist.songs.length; i++) {
                        imageArray[i] = this.state.playlist.songs[i].image;
                    }
                    this.setState({ playlistImages: imageArray });
                });
                let length = (this.state.friends).length;
                var arr = Array(length).fill(false);
                this.setState({ isLoading: false, checked: arr })
            }).catch(err => {
                console.log(err)
            })
            this.props.updateUpd();
        }
    }

    removeFromLibrary = (e) => {
        if (this.state.userId === this.state.playlist.userID) {
            // console.log("DELETING")
            this.handleModalD(e, true)
            return
        }

        console.log("in remove from library");
        this.state.library.splice(this.state.library.indexOf(this.state.playlist._id), 1);
        console.log(this.state.library, " new library")
        axios.post('/auth/removeAddedPlaylist', { userId: this.state.userId, library: this.state.library })
            .then(res => {
                console.log("removed from library")
                // console.log(res.data)
                sessionStorage.setItem('user', JSON.stringify(res.data.user))
                this.props.updateUser()
            })
            .catch(error => {
                console.log(error)
            });
        this.props.updateLibrary(this.state.library);
    }
    deletePlaylist = (e) => {
        e.preventDefault()

        var library = []
        Object.assign(library, this.state.user.library)
        library.splice(library.indexOf(this.state.playlist._id), 1)

        axios.post('/auth/deletePlaylist', { playlistId: this.state.playlist._id })
            .then(res => {

            })
            .catch(error => {
                console.log(error)
            });
        axios.post('/auth/removePlaylist', { userId: this.state.userId, library: library })
            .then(res => {
                sessionStorage.setItem('user', JSON.stringify(res.data.user))
                sessionStorage.removeItem("homeState");
                this.props.updateUser()
                this.props.deletePlaylistFromLibrary()
                this.props.updateLibrary()
                this.setState({ modalShowD: false })
            })
            .catch(error => {
                console.log(error)
            });

    }
    reloadUser=()=>{
        axios.post('/auth/getUser', { userId: this.state.user._id}).then(res => {
            sessionStorage.setItem('user', JSON.stringify(res.data.user))
            sessionStorage.removeItem("homeState")
            this.props.updateUser()
            this.setState({ user: res.data.user })
            }).catch(err => {
                console.log(err)
            })
    }
    changeVisibility = () => {
        if (this.state.userId !== this.state.playlist.userID) {
            return
        }

        let visibility = this.state.playlist.public;
        console.log(visibility, "is the current state")
        axios.post('/auth/playlistPublic', { playlistId: this.state.playlist._id, public: !visibility }).then((res) => {
            console.log(res.data.playlist)
            this.reloadUser()
            this.setState({ playlist: res.data.playlist }, () => {
                console.log(" we should hsave updated the state now")
            })
        }).catch((err) => {
            console.log(err)
        })
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
    handleModalD(e, value) {
        e.preventDefault();

        this.setState({ modalShowD: value })
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
            for(var i = 0; i < this.state.friends.length; i++) {
                if(friendId === this.state.friends[i]._id) {
                  var friend = this.state.friends[i]
                  if(friend.library.includes(this.state.playlist._id) || friend.addedPlaylists.includes(this.state.playlist._id)) {
                    break
                  }
                  else {
                    axios.post('/auth/addPlaylist', { userId: friendId, playlistId: this.state.playlist._id }).then(() => {
                      console.log("succesfully added to ", friendId)
                    }).catch()
                  }
                }
            }
        })
        console.log("we finished all of the friends list")
        this.setState({ modalShow: false, shareWith: [], checked: [] })

    }
    render() {
        if (this.state.isLoading) {
            return <div></div>;
        }
        let lock, linkTo;
        if (this.state.playlist.public) {
            lock = "fa fa-unlock";
            linkTo = `/publicPlayer/${this.state.playlist._id}`
        } else {
            lock = "fa fa-lock"
            linkTo = `/player/${this.state.playlist._id}`
        }
        var cursor, remove, opacity;
        if(this.state.userId !== this.state.playlist.userID) {
            console.log(this.state.playlist.userID)
            cursor = "not-allowed"
            opacity = "40%"
            remove = "fas fa-minus-circle"
        }
        else {
            cursor = "pointer"
            opacity = "100%"
            remove = "fas fa-trash-alt"
        }

        return (
            <div style={{ "margin-right": "100px" }}>
                <Link to={{ pathname: linkTo, state: { source: '/library' } }}>
                    <div id='library-container'>

                        <Card id='library-card-container'>
                            <div id='hover-container'>
                                <Link id="remove-link" onClick={(e) => this.removeFromLibrary(e)} style={{ textDecoration: 'none' }}>
                                    <i className={remove} style={{ "paddingRight": "1rem", "fontSize": "2rem", "color": "white" }}></i>
                                </Link>
                                <Link id="visibility-link" onClick={() => this.changeVisibility()} style={{ "textDecoration": 'none', "cursor":`${cursor}` }}>
                                    <i className={lock} style={{ "fontSize": "2rem", "color": "white", "opacity":`${opacity}`}}></i>
                                </Link>
                                <Link id="share-link" style={{ textDecoration: 'none' }}>
                                    <i onClick={(e) => { this.handleModal(e, true) }} className="fa fa-share-alt" style={{ "paddingLeft": "1.5rem", "fontSize": "2rem", "color": "white", display: "block", paddingTop: "1rem" }}></i>
                                </Link>
                            </div>
                            <Card className='library-card'>
                                <Card.Img src={this.state.playlistImages[0]} alt="Card image" />
                            </Card>
                            <Card className='library-card'>
                                <Card.Img src={this.state.playlistImages[1]} alt="Card image" />
                            </Card>
                            <Card className='library-card'>
                                <Card.Img src={this.state.playlistImages[2]} alt="Card image" />
                            </Card>
                            <Card className='library-card'>
                                <Card.Img src={this.state.playlistImages[3]} alt="Card image" />
                            </Card>
                        </Card>

                        <div id='playlist-title'>
                            {/* {this.props.playlist.name} */}
                            {this.state.playlist.name}
                        </div>

                    </div>
                </Link>
                <Modal
                    backdrop="static"
                    keyboard="false"
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

                <Modal
                    backdrop="static"
                    keyboard="false"
                    show={this.state.modalShowD}
                >
                    <Modal.Header>Are you sure?</Modal.Header>
                    <Modal.Body>
                        <h3>Are you sure you want to delete {this.state.playlist.name}?</h3>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="secondary" onClick={(e) => { this.deletePlaylist(e) }}>Delete</Button>
                        <Button className='secondary' onClick={(e) => this.handleModalD(e, false)} data-dismiss="modal">Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}
export default LibraryCard;