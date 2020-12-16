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
var lyrics = require("apiseeds-lyrics");

class MuffleParent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: "",
            user: null,
            currentPlaylist: "",
            currentSong: "",
            currentSongInfo: null,
            accessToken: ""
        }
        this.musicPlayer = React.createRef();
    }
    playSong = (song) => {
        const song_info = sessionStorage.getItem("songInfo");
        if (song_info) {
            const foundSong = JSON.parse(song_info);
            this.musicPlayer.current.playFromPlaylist(foundSong.songObj);
        }
    }
    updateCurrentPlaylist = () => {
        const music_info = sessionStorage.getItem("playlistInfo");
        if (music_info) {
            const foundPlaylist = JSON.parse(music_info);
            this.setState({ currentPlaylist: foundPlaylist });
        }
        // this.setState({ currentPlaylist: event });
    }
    updateSong = (event) => {
        const song_info = sessionStorage.getItem("songInfo");
        if (song_info) {
            const foundSong = JSON.parse(song_info);
            this.setState({ currentSong: foundSong.song });
        }
        // this.setState({ currentSong: event});
    }
    updateUserID = () => {
        const loggedInUser = sessionStorage.getItem("user");
        if (loggedInUser) {
            const foundUser = JSON.parse(loggedInUser);
            console.log("updating muflle from sesh", foundUser)
            this.setState({ userID: foundUser._id, user: foundUser });
        }
    }
    componentDidMount = () => {
        var newState = {
            userID: "",
            user: null,
            currentPlaylist: "",
            currentSong: "",
            currentSongInfo: null,
            accessToken: "",
            lyrics: ""
        };
        const loggedInUser = sessionStorage.getItem("user");
        const song_info = sessionStorage.getItem("songInfo");
        const music_info = sessionStorage.getItem("playlistInfo");
        const song_Name = sessionStorage.getItem("songName");
        const token = sessionStorage.getItem("accessToken");
        if (loggedInUser) {
            const foundUser = JSON.parse(loggedInUser);
            newState.userID = foundUser._id;
            newState.user = foundUser;
        }
        if (song_info) {
            const foundSong = JSON.parse(song_info);
            newState.currentSong = foundSong.song;
        }
        if (music_info) {
            const foundPlaylist = JSON.parse(music_info);
            newState.currentPlaylist = foundPlaylist
        }
        if (song_Name) {
            const songName = JSON.parse(song_Name);
            newState.currentSongInfo = songName
        }
        if (token) {
            newState.accessToken = JSON.parse(token);
        }
        this.setState(newState);
    }
    updateCurrentSongInfo = () => {
        const song_Name = sessionStorage.getItem("songName");
        if (song_Name) {
            console.log(song_Name)
            const songName = JSON.parse(song_Name);
            this.getLyrics(songName)
            this.setState({ currentSongInfo: songName });
        }
        // this.setState({ currentSongInfo: song });
    }
    getLyrics = (songName) => {
        // if(key === "lyrics") {
          const apikey = 'eL5ELopUmowHW0l8rznCjMQYiTeYeoGjmUnXdV4RFJlTh45t3UQ4BAGREKmkIgrp';
              lyrics.getLyric(apikey, songName.currentArtist, songName.currentName, (response,headers) => {
              if(response.result) {
                var lyrics = response.result.track.name + " - " + response.result.artist.name + "\n\n" + response.result.track.text
                this.setState({ lyrics: lyrics})
              }
              else {
                this.setState({ lyrics: "Unable to find lyrics for " + songName.currentName})
              }
            });
        // }
      }
    clearState = () => {
        let empty = {
            userID: "",
            user: null,
            currentPlaylist: "",
            currentSong: "",
            currentSongInfo: null
        }
        this.setState(empty)
    }
    updateUser = () => {
        console.log("updating the user")
        const loggedInUser = sessionStorage.getItem("user");
        if (loggedInUser) {
            const foundUser = JSON.parse(loggedInUser);

            this.setState({ user: foundUser });
        }
    }
    updateAccessToken = () => {
        const token = sessionStorage.getItem("accessToken");
        if (token) {
            const access = JSON.parse(token);
            this.setState({ accessToken: access })
        }

    }
    render() {
        return (
            <div className="container-fluid" style={{ minWidth: "1100px" }}>
                <div className="App" id="app">
                    <NavBar updateUserID={this.updateUserID} clear={this.clearState} updateUser={this.updateUser} userID={this.state.userID} user={this.state.user}></NavBar>
                    <Route exact path={"/"} render={props => <Login {...props} updateID={this.updateUserID} updateUser={this.updateUser} />} />
                    <Route path="/profileScreen" render={props => <ProfileScreen {...props} userID={this.state.userID} updateUser={this.updateUser} updateAccessToken={this.updateAccessToken} />}></Route>
                    <Route path="/register" render={props => <Register {...props} updateUser={this.updateUser} updateID={this.updateUserID} />} />
                    <Route path="/network" render={props => <Network {...props} userId={this.state.userID} updateUser={this.updateUser} />}></Route>
                    <Route path="/player/:id" render={props => <Playlist_player {...props} user={this.state.user} playSong={this.playSong} updateSong={this.updateSong} updatePlaylist={this.updateCurrentPlaylist} currentPlaylist={this.state.currentPlaylist}  />}></Route>
                    <Route path="/edit/:id" render={props => <Create_playlist {...props} updateUser={this.updateUser} updatePlaylist={this.updateCurrentPlaylist} userId={this.state.user._id} />}></Route>
                    <Route path="/publicPlayer/:id" render={props => <PublicPlaylistPlayer {...props} userID={this.state.userID} updatePlaylist={this.updateCurrentPlaylist} updateSong={this.updateSong} playSong={this.playSong} currentSongInfo={this.state.currentSongInfo} lyrics={this.state.lyrics}/>}></Route>
                    <Route path="/createPlaylist" render={props => <Create_playlist {...props} updateUser={this.updateUser} userId={this.state.user._id} />}></Route>
                    <Route path="/library" render={props => <Library {...props} user = {this.state.user} userId={this.state.userID} updateUser={this.updateUser}  />}></Route>
                    <Route path="/home" render={props => <HomeScreen {...props} userId={this.state.userID} updateUser={this.updateUser} />}></Route>
                    <Route path="/splash" component={Splash}></Route>
                    <Route path="/friendResult" render={props => <FriendResult {...props} />}></Route>
                </div>
                {/* <Route path={['/profileScreen', '/network', '/player', '/publicPlayer', '/createPlaylist', '/home', '/library']} component={Music_Player} currentPlaylist={this.state.currentPlaylist}></Route> */}
                <Route path={['/profileScreen', '/network', '/player', '/publicPlayer', '/createPlaylist', '/home', '/library', '/edit', '/friendResult']} render={props => <Music_Player {...props} ref={this.musicPlayer} accessToken={this.state.accessToken} currentPlaylist={this.state.currentPlaylist} currentSong={this.state.currentSong} updateCurrentSongInfo={this.updateCurrentSongInfo} updateSong={this.updateSong} />}></Route>
            </div>

        )
    }
}

export default MuffleParent