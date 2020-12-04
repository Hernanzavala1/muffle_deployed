import React from 'react';
import '../App.css'
import Login from '../Components/Login'
import NavBar from '../Components/NavBar'
import Music_Player from '../Components/MusicPlayer'
import Register from '../Components/register'
import ProfileScreen from '../Components/profileScreen'
import Network from '../Components/Network'
import Playlist_player from '../Components/playlist_player'
import PublicPlaylistPlayer from '../Components/publicPlaylistPlayer'
import Create_playlist from '../Components/create_playlist'
import HomeScreen from '../Components/homeScreen'
import Library from '../Components/Library'
import Splash from '../Components/splashScreen'
import FriendResult from '../Components/FriendResult'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class MuffleParent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: "",
            currentPlaylist: "",
            currentSong: ""
        }
        this.musicPlayer= React.createRef();
    }
    playSong = (song) => {
        this.musicPlayer.current.playFromPlaylist(song);
    }
    updateCurrentPlaylist = (event) => {
        this.setState({ currentPlaylist: event });
    }
    updateSong = (event) => {
        this.setState({ currentSong: event});
    }
    updateUserID = (event) => {
        this.setState({ userID: event });
    }
    render() {
        return (
            <div className="container-fluid" style={{ minWidth: "1100px" }}>
                <div className="App" id="app">
                    <NavBar updateUserID={this.updateUserID} userID={this.state.userID}></NavBar>
                    <Route exact path={"/"} render={props => <Login {...props} updateID={this.updateUserID} />} />
                    <Route path="/profileScreen" render={props => <ProfileScreen {...props} userID={this.state.userID} />}></Route>
                    <Route path="/register" render={props => <Register {...props} updateID={this.updateUserID} />} />
                    <Route path="/network" render={props => <Network {...props} userId={this.state.userID} />}></Route>
                    <Route path="/player/:id" render={props => <Playlist_player {...props} playSong={this.playSong} updateSong={this.updateSong} updatePlaylist={this.updateCurrentPlaylist} currentPlaylist={this.state.currentPlaylist}  />}></Route>
                    <Route path="/edit/:id" render={props => <Create_playlist {...props}  />}></Route>
                    <Route path="/publicPlayer/:id" render={props => <PublicPlaylistPlayer {...props} userID={this.state.userID} updatePlaylist={this.updateCurrentPlaylist} updateSong={this.updateSong} playSong={this.playSong}/>}></Route>
                    {/* <Route path="/createPlaylist" component={Create_playlist}></Route> */}
                    <Route path="/createPlaylist" render={props => <Create_playlist {...props} userId={this.state.userID} />}></Route>
                    <Route path="/library" render={props => <Library {...props} userId={this.state.userID} />}></Route>
                    <Route path="/home" render={props => <HomeScreen {...props} userId={this.state.userID} />}></Route>
                    <Route path="/splash" component={Splash}></Route>
                    <Route path="/friendResult" render={props => <FriendResult {...props} />}></Route>
                </div>
                {/* <Route path={['/profileScreen', '/network', '/player', '/publicPlayer', '/createPlaylist', '/home', '/library']} component={Music_Player} currentPlaylist={this.state.currentPlaylist}></Route> */}
                <Route path={['/profileScreen', '/network', '/player', '/publicPlayer', '/createPlaylist', '/home', '/library', '/edit', '/friendResult']} render={props => <Music_Player {...props} ref={this.musicPlayer} currentPlaylist={this.state.currentPlaylist} currentSong={this.state.currentSong} />}></Route>
            </div>

        )
    }
}

export default MuffleParent