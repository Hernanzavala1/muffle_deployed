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
class publicPlaylistPlayer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            playlist: null,
            modalShow: false,
            friends: [{ name: 'ryan Brener', id: "5faa29f181cddb09b45fcd81" }, { name: 'julia Furry', id: "5fac8c0341b6513ea83e9a12" }],
            shareWith: [],
            checked: []
        }

    }
    componentDidMount = () => {
        document.getElementById("app").style.height = "calc(100vh - 90 px)";
        // console.log(this.props.match.params.id , " is the id")
        let playlistId = this.props.match.params.id
        axios.post('/auth/getPlaylist', { playlistId }).then(res => {
            let length = (this.state.friends).length;
            var arr = Array(length).fill(false);
            this.setState({ playlist: res.data.playlist, checked: arr }, () => {
                console.log("we are updating the playlist from online")
                this.props.updatePlaylist(this.state.playlist);
            })
            if (this.state.playlist == null) {
                this.props.updatePlaylist(data.publicPlayer.publicPlaylist.playlist);
            }

        }).catch(err => {
            console.log(err)
        })

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
                    <Link to='/home' style={{ "display": "flex" }}>
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
                            <Link onClick={() => this.updateLikes(this.state.playlist.likes + 1)}><i className="fa fa-thumbs-up" aria-hidden="true" style={{ "fontSize": "2.5rem", "color": "white", "marginRight": "35px" }}></i></Link>
                            <Link onClick={() => this.updateLikes(this.state.playlist.likes - 1)}><i className="fa fa-thumbs-down" aria-hidden="true" style={{ "fontSize": "2.5rem", "color": "white" }}></i></Link>
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
                        <div className="container_chat" style={{ "minHeight": "50vh", "maxHeight": "50vh" }}>
                            <div style={{ "position": "absolute", "minHeight": "100%", "minWidth": "100%", "backgroundRepeat": "no-repeat", "backgroundPosition": "center", "opacity": "0.5", "backgroundImage":`url(${songs[0].image})`}}  ></div>
                            <div className="row">
                                <div id="tabs" className="col">
                                    <nav>
                                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                            <a className="nav-item nav-link active" id="nav-chat-tab" data-toggle="tab" href="#nav-chat" role="tab" aria-controls="nav-home" aria-selected="true">Chat</a>
                                            <a className="nav-item nav-link" id="nav-playlist-tab" data-toggle="tab" href="#nav-lyrics" role="tab" aria-controls="nav-profile" aria-selected="false">Lyrics</a>
                                        </div>
                                    </nav>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <ul id="ul_chat">
                                        <SimpleChatItem className={"received_chat"} text={data.publicPlayer.receivedChat}></SimpleChatItem>
                                        <SimpleChatItem className={"sent_chat"} text={data.publicPlayer.sentChat}></SimpleChatItem>
                                    </ul>
                                </div>
                            </div>
                            <div id="row_chat" className="row">
                                <div className="col">
                                    <input id="text_input" type="text"></input>
                                </div>
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