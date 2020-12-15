
import React from 'react';
import { Link } from 'react-router-dom';
import './css/playlist_player.css'
import data from '../data.json'
import axios from 'axios'
import SimplePlaylistTable from './SimplePlaylistTable'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import { Button, Modal } from 'react-bootstrap'
class playlist_player extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            user: this.props.user,
            playlist: this.props.currentPlaylist,
            isLoading: true,
            modalShow: false,
            friends: [],
            shareWith: [],
            checked: []
        }
    }
 
    componentDidMount () {
        console.log("we have mounteed the component !!!")
        let playlistId = this.props.match.params.id
           if( this.reloadState(playlistId)){
               return;
           }
        
        document.getElementById("app").style.height = "calc(100vh - 90 px)";
        axios.post('/auth/getPlaylist', { playlistId: playlistId }).then(res => {
            // this.setState({ playlist: res.data.playlist })
            if (this.state.user != null) {
                console.log("")
                let temp = []
                let requests = this.getFriends(this.state.user);
                axios.all(requests).then(axios.spread((...responses) => {
                    for (var i = 0; i < responses.length; i++) {
                        temp.push(responses[i].data.user)
                    }
                    let length = temp.length;
                    var arr = Array(length).fill(false);
                    sessionStorage.setItem('playlistInfo', JSON.stringify(res.data.playlist))
                    this.props.updatePlaylist();
                    this.setState({ isLoading: false, checked: arr, friends: temp, playlist: res.data.playlist })
                })).catch(errors => {
                    console.log(errors)
                })
            }

        }).catch(err => {
            console.log(err)
        })

    }
    reloadState=()=>{
        const userInfo =sessionStorage.getItem("user");
        const playlistInfo = sessionStorage.getItem("playlistInfo")
        const playlistId = this.props.match.params.id
        console.log(playlistId)
        if(userInfo && playlistInfo){
            const foundUser = JSON.parse(userInfo);
            const playlist = JSON.parse(playlistInfo);
            console.log(playlist._id)
            if(playlistId != playlist._id){
                return false;
            }
            let temp = []
            let requests = this.getFriends(foundUser);
            axios.all(requests).then(axios.spread((...responses) => {
                for (var i = 0; i < responses.length; i++) {
                    temp.push(responses[i].data.user)
                }
                let length = temp.length;
                var arr = Array(length).fill(false);
                this.setState({ user: foundUser, playlist: playlist, isLoading: false, checked: arr, friends: temp },()=>{
                    return true;
                })
            })).catch(errors => {
                console.log(errors)
            })
            
        }
        else{
            return false;
        }
           return true;
    }

    
    getFriends = (user) => {
        // console.log("getting friends")
        let requests = []

        var i = 0;
        for (i; i < user.friends.length; i++) {
            requests.push(axios.post('/auth/getUser', { userId: user.friends[i].friendId }))
        }
        return requests

    }
    handleModal(e, value) {
        e.preventDefault();
        // W3C model
        let length = (this.state.friends).length;
        var arr = Array(length).fill(false);
        if (!value) {
            this.setState({ modalShow: value, shareWith: [], checked: arr }, () => {
                // console.log("we are opening the modal? ", value)
            })
        }
        else {
            this.setState({ modalShow: value }, () => {
                // console.log("we are opening the modal? ", value)
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
                // console.log("the state should have been updated by now")

            })
        }
        else {
            // console.log("deleting it from the array")
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
        if (this.state.isLoading) {
            return <div>Loading...</div>;
        }
        var playlist = this.state.playlist;

        return (
            <div className="player_container">
                <div id="row1_player" className="row height:10%">
                    <Link to='/library' style={{ "display": "flex" }}>
                        <div><i className="fas fa-long-arrow-alt-left" style={{ "color": "White", "textAlign": "center" }}></i></div>
                        <div> <label style={{ "color": "White", "textAlign": "center", "fontWeight": "bold", "margin-left": "5px", "cursor": "pointer" }}>Back</label></div>
                    </Link>
                </div>
                <div style={{ "margin": "20px", "marginBottom": "25px" }} className="row height:15% ">
                    <div className="col">
                        <h3 style={{ "color": "white" }} >{playlist.name}</h3>
                    </div>
                    <div className="col justify-content:space-between">
                        <div id="playlist-options">
                            <Link to={`/edit/${playlist._id}`}> <i style={{ "fontSize": "2.5rem", "color": "white", "marginRight": "35px" }} className="fas fa-pen-square"></i></Link>
                            <Link onClick={(e) => { this.handleModal(e, true) }} style={{ textDecoration: 'none' }}> <i className="fa fa-share-alt" style={{ "fontSize": "2.5rem", "color": "white" }}></i></Link>
                        </div>
                    </div>
                </div>
                <div className="row height:70%">
                    <div className='col-5' >
                        <div className="table-wrapper-scroll-y my-custom-scrollbar height:inherit" style={{ "minHeight": "60vh", "maxHeight": "60vh" }}>
                            <table scope="col" className="table table-dark table-fixed ">
                                <thead>
                                    <tr>
                                        <th id="column_title" scope="col">Title</th>
                                        <th id="column_title" scope="col">Artist</th>
                                        <th id="column_title" scope="col">Time</th>
                                    </tr>
                                </thead>
                                <SimplePlaylistTable updateSong={this.props.updateSong} playSong={this.props.playSong} playlists={playlist.songs}></SimplePlaylistTable>
                            </table>
                        </div>
                    </div>
                    <div className="col text-center">
                        <div>
                            <img alt={"No playlist image"} src={playlist.songs[0].image} height="300px"></img>
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
        );
    }
}
export default playlist_player;