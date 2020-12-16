import React from 'react'
import './css/MusicPlayer.css'
import data from '../data.json'
import { Link } from 'react-router-dom';
import axios from 'axios'
import Script from 'react-load-script'
import qs from 'qs'


var player2;
var timeUpdate;
class MusicPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            play: false,
            currentSong: 0,
            currentName: "",
            currentArtist: "",
            length: 0,
            currentTime: 0,
            currentVolume: 0.2,
            playlist: data.playlistTest.list,
            playlistID: data.playlistTest._id,
            deviceID: null,
            token:this.props.accessToken
            // token: 'BQCJA1hWwHxgTJSB-N0R7PINl0dxd4R9QgpoE_L7HOdzQ8tp-Yq41e3_WovA9Nb4E01bZ2LkwizMp_-9gXBUl82GQItZQgoqImmDUa5ngzIoa6s11RWWWBkBEMy3ux1EkrlRenPKw5TbtZTF5eKsvSKNwUvTFWKMEv4xxXPaZSKUNCFBFaTfecwjvsJGK5Zq2idfnQziketp'
        }
    }
    handleScriptLoad = () => {
        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Muffle Spotify Player',
                getOAuthToken: cb => { cb(this.props.accessToken); },
                volume: 0.2
            });

            // Error handling
            player.addListener('initialization_error', ({ message }) => { console.error(message); });
            player.addListener('authentication_error', ({ message }) => { console.error(message); });
            player.addListener('account_error', ({ message }) => { console.error(message); });
            player.addListener('playback_error', ({ message }) => { console.error(message); });

            // Playback status updates
            player.addListener('player_state_changed', state => {
                if (state) {
                    console.log(state);
                    this.state.currentTime = state.position;
                    this.state.length = state.duration;
                    this.updateTimelineSpotify();
                }
            });

            // Ready
            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                this.setState({ deviceID: device_id });
            });

            // Not Ready
            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            // Connect to the player!
            player.connect();
            player2 = player;
        };
    }
    play = () => {
        if (this.props.currentPlaylist == "") {
            return;
        }
        //if spotify exists, play from sdk, if song already in play, resume
        if (this.props.accessToken) {
            if (this.state.length != 0) {
                player2.resume();
                timeUpdate = setInterval(() => { this.updateTimelineSpotify(1000) }, 1000);
            }
            else
                this.playFromSDK(this.state.playlist[this.state.currentSong].spotifyURI);
        }
        else if (this.state.length != 0) {
            this.song.play();
        }
        else {
            this.song = new Audio(this.state.playlist[this.state.currentSong].uri);
            this.song.play();
            this.song.volume = this.state.currentVolume;
            this.song.ontimeupdate = this.updateTimeline;
        }
        this.setState({ play: true });
        console.log(this.state.playlist);
        document.getElementById("pause-button").style.display = "block";
        document.getElementById("play-button").style.display = "none";
        this.setState({ currentName: this.state.playlist[this.state.currentSong].title, currentArtist: this.state.playlist[this.state.currentSong].artist, length: this.state.playlist[this.state.currentSong].duration }, () => {
            var songObj ={ currentName: this.state.currentName, currentArtist: this.state.currentArtist }
            sessionStorage.setItem('songName', JSON.stringify( songObj))
            this.props.updateCurrentSongInfo()
            var songUri ={song:this.state.playlist[this.state.currentSong].uri, songObj:this.state.playlist[this.state.currentSong]}
            sessionStorage.setItem('songInfo',  JSON.stringify(songUri));
            this.props.updateSong();
            // this.props.updateCurrentSongInfo({ currentName: this.state.currentName, currentArtist: this.state.currentArtist })
        });
    }
    playFromPlaylist = (song) => {
        if (this.props.accessToken) {
            player2.pause();
        }
        else if (this.state.play) {
            this.song.pause();
        }
        //if not same playlist and something playing
        this.setState({ currentPlaylist: this.props.currentPlaylist, playlist: this.props.currentPlaylist.songs, playlistID: this.props.currentPlaylist._id }, function () {
            for (var i = 0; i < this.state.playlist.length; i++) {
                if (song.uri === this.state.playlist[i].uri) {
                    this.setState({ currentSong: i }, () => {
                        //if spotify exists, play from sdk instead
                        if (this.props.accessToken) {
                            this.playFromSDK(song.spotifyURI);
                        }
                        else {
                            this.song = new Audio(this.state.playlist[this.state.currentSong].uri);
                            this.song.play();
                            this.setState({ play: true });
                            this.song.volume = this.state.currentVolume;
                            this.song.ontimeupdate = this.updateTimeline;
                        }
                        console.log(this.state.playlist);
                        document.getElementById("pause-button").style.display = "block";
                        document.getElementById("play-button").style.display = "none";
                        this.setState({ currentName: this.state.playlist[this.state.currentSong].title, currentArtist: this.state.playlist[this.state.currentSong].artist, length: this.state.playlist[this.state.currentSong].duration }, () => {
                            var songObj ={ currentName: this.state.currentName, currentArtist: this.state.currentArtist };
                            sessionStorage.setItem('songName', JSON.stringify( songObj));
                            this.props.updateCurrentSongInfo();
                            var songUri ={song:this.state.playlist[this.state.currentSong].uri, songObj:this.state.playlist[this.state.currentSong]}
                            sessionStorage.setItem('songInfo',  JSON.stringify(songUri));
                            this.props.updateSong();
                        });
                    })
                }
            }
        }
        );
    
    }
    pause = () => {
        //if spotify is enabled, pause the player instead
        if (this.props.accessToken) {
            player2.pause();
            clearInterval(timeUpdate);
        }
        else {
            this.song.pause();
        }
        this.setState({ play: false });
        document.getElementById("pause-button").style.display = "none";
        document.getElementById("play-button").style.display = "block";
    }
    next = () => {

        if (this.props.currentPlaylist == "") {
            return;
        }
        if (this.state.currentSong == this.state.playlist.length - 1) {
            this.state.currentSong = 0;
        }
        else {
            this.state.currentSong += 1;
        }
        //if spotify is enabled, play the next song using spotify's player (playfromsdk using next uri), else pause the current html song
        if (this.props.accessToken) {
            player2.pause();
            this.playFromSDK(this.state.playlist[this.state.currentSong].spotifyURI);
        }
        else {
            this.song.pause();
            this.song = new Audio(this.state.playlist[this.state.currentSong].uri);
            this.song.ontimeupdate = this.updateTimeline;
            this.song.volume = this.state.currentVolume;
            this.song.play();
        }

        this.setState({ currentName: this.state.playlist[this.state.currentSong].title, currentArtist: this.state.playlist[this.state.currentSong].artist, length: this.state.playlist[this.state.currentSong].duration }, () => {
            var songObj ={ currentName: this.state.currentName, currentArtist: this.state.currentArtist };
            sessionStorage.setItem('songName', JSON.stringify( songObj));
            this.props.updateCurrentSongInfo();
            var songUri ={song:this.state.playlist[this.state.currentSong].uri, songObj:this.state.playlist[this.state.currentSong]}
            sessionStorage.setItem('songInfo',  JSON.stringify(songUri));
            this.props.updateSong();
        });
        document.getElementById("pause-button").style.display = "block";
        document.getElementById("play-button").style.display = "none";
    }
    prev = () => {
        if (this.props.currentPlaylist == "") {
            return;
        }
        if (this.state.currentSong == 0) {
            this.state.currentSong = this.state.playlist.length - 1;
        }
        else {
            this.state.currentSong -= 1;
        }
        if (this.props.accessToken) {
            player2.pause();
            this.playFromSDK(this.state.playlist[this.state.currentSong].spotifyURI);
        }
        else {
            this.song.pause();
            this.song = new Audio(this.state.playlist[this.state.currentSong].uri);
            this.song.ontimeupdate = this.updateTimeline;
            this.song.volume = this.state.currentVolume;
            this.song.play();
        }

        this.setState({ currentName: this.state.playlist[this.state.currentSong].title, currentArtist: this.state.playlist[this.state.currentSong].artist, length: this.state.playlist[this.state.currentSong].duration }, () => {
            var songObj ={ currentName: this.state.currentName, currentArtist: this.state.currentArtist };
            sessionStorage.setItem('songName', JSON.stringify( songObj));
            this.props.updateCurrentSongInfo();
            var songUri ={song:this.state.playlist[this.state.currentSong].uri, songObj:this.state.playlist[this.state.currentSong]}
            sessionStorage.setItem('songInfo',  JSON.stringify(songUri));
            this.props.updateSong();
        });

        document.getElementById("pause-button").style.display = "block";
        document.getElementById("play-button").style.display = "none";
    }
    updateTimeline = () => {
        var progress = document.getElementsByClassName("progress-bar")[0];
        var percent = (this.song.currentTime / this.song.duration) * 100;
        if (progress != null)
            progress.style.width = percent + "%";
        if (percent == 100) {
            this.next();
        }
    }
    updateTimelineSpotify = (time) => {
        var temp = this.state.currentTime;
        if (time)
            temp += time;
        this.setState({ currentTime: temp });
        var progress = document.getElementsByClassName("progress-bar")[0];
        var percent = (temp / this.state.length) * 100;
        progress.style.width = percent + "%";
        console.log(percent);
        if (percent >= 99.9) {
            this.next();
        }
    }
    updateVolume = (event) => {
        //if spotify player, set volume for it.
        if (this.props.accessToken) {
            player2.setVolume(event.target.value / 100);
        }
        if (this.song == null) {
            this.state.currentVolume = event.target.value / 100;
        }
        else {
            this.song.volume = event.target.value / 100;
            this.state.currentVolume = this.song.volume;
        }
    }
    //todo: hook up player to my player, 
    playFromSDK = (uri) => {
        const data_post = {
            "uris": [uri] // replace with uri from playlist
        };
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + this.props.accessToken // NEEDS SCOPES: user-modify-playback-state, user-read-playback-state, possibly more
            }
        };
        axios.put(
            'https://api.spotify.com/v1/me/player/play?device_id=' + this.state.deviceID,
            data_post,
            headers
        ).then((response) => {
            console.log(response);
            clearInterval(timeUpdate);
            timeUpdate = setInterval(() => { this.updateTimelineSpotify(500) }, 500);
        }).catch(err => {
            console.log(err)
        })
        var songUri ={song:this.state.playlist[this.state.currentSong].uri, songObj:this.state.playlist[this.state.currentSong]}
        sessionStorage.setItem('songInfo',  JSON.stringify(songUri));
        this.props.updateSong();
    }
    componentDidMount = () => {
        console.log(this.props.currentPlaylist);
        const token = JSON.parse(sessionStorage.getItem("accessToken"));
        const playlist = JSON.parse(sessionStorage.getItem("playlistInfo"));
        const song = JSON.parse(sessionStorage.getItem("songInfo"));
        if (token) {
            var loadScript = function () {
                var script = document.createElement('script');
                script.src = "https://sdk.scdn.co/spotify-player.js";
                var body = document.getElementsByTagName('body')[0];
                body.appendChild(script);
            }
            loadScript();
            this.handleScriptLoad();
        }
        if (playlist !== null) {
            console.log("ASDASD");
            this.setState({currentPlaylist: playlist, playlist: playlist.songs});
        }
        if (song != null) {
            this.setState({currentName: song.songObj.title, currentArtist: song.songObj.artist});
            for (var i = 0; i < playlist.songs.length; i++) {
                if (song.songObj.uri === playlist.songs[i].uri) {
                    this.setState({currentSong: i});
                }
            }
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.accessToken !== this.props.accessToken) {
            var loadScript = function () {
                var script = document.createElement('script');
                script.src = "https://sdk.scdn.co/spotify-player.js";
                var body = document.getElementsByTagName('body')[0];
                body.appendChild(script);
            }
            loadScript();
            this.handleScriptLoad();
        }
    }
    componentDidUpdate =(prevProps, prevState, snapshot)=>{
        
    }
    componentWillUnmount() {
        if (this.props.accessToken) {
            player2.pause();
            clearInterval(timeUpdate);
        }
        else if (this.state.play) {
            this.song.pause();
        }
    }
    render() {
        let bool = this.props.currentPlaylist.public;
        let id = this.props.currentPlaylist._id;
        let image = this.state.playlist[this.state.currentSong];
        
        if (image == null)
            image = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
        else
            image = this.state.playlist[this.state.currentSong].image;
        var Child;
        if (id === undefined) {
            Child = (
                <Link to={{ pathname: '#', state: { source: '/home' } }} onClick={ (e) => e.preventDefault() } id="goBackLink" ><label id="playlist_back" style={{cursor: "default", color: "grey"}}>Back to Playlist</label></Link>
            )
        }
        else if (bool) {
            //    this.props.updateCurrentSongInfo({currentName: this.state.currentName, currentArtist: this.state.currentArtist})
            Child = (
                <Link to={{ pathname: `/publicPlayer/${id}`, state: { source: '/home' } }} id="goBackLink" ><label id="playlist_back">Back to Playlist</label></Link>
            )
        }
        else {
            Child = (
                <Link to={{ pathname: `/player/${id}`, state: { source: '/home' } }} id="goBackLink" ><label id="playlist_back">Back to Playlist</label></Link>
            )
        }
        return (
            <div className='player_box'>
                {/* <Script url="https://sdk.scdn.co/spotify-player.js" onLoad={this.handleScriptLoad}></Script> */}
                <div className="Song_info">
                    <div className='goBack'>
                        <i className="fas fa-arrow-left"></i>
                        {/* <Link id="goBackLink" ><label id="playlist_back">Back to Playlist</label></Link> */}
                        {Child}
                    </div>
                    <div className="info-wrapper">
                        <div id="song_label"><label>{this.state.currentName}</label></div>
                        <div id="artist_label"> <label>{this.state.currentArtist}</label></div>
                    </div>
                </div>
                <div className="Player_btns">
                    <input type="range" min="0" max="100" defaultValue = "20" class="slider" id="volume" onInput={this.updateVolume}></input>
                    <div className="progress">
                        <div className="progress-bar" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <div className="music_buttons">
                        <button id="prev-button" onClick={this.prev} className="btn-primary circle_button">
                            <svg >
                                <polygon points="18 2, 18 18, 9 10, 9 18, 0 10, 9 2, 9 10"></polygon>
                            </svg>
                        </button>
                        <button id="play-button" onClick={this.play} className="btn-primary circle_button">
                            <svg idviewBox="0 0 20 20">
                                <polygon id="play-poly" points="4 0, 4 18, 20 9"></polygon>
                            </svg>
                        </button>
                        <button id="pause-button" onClick={this.pause} className="btn-primary circle_button" style={{ display: "none" }}>
                            <svg idviewBox="0 0 20 20">
                                <polygon id="pause-poly" points="4 0, 4 20, 8 20, 8 0, 12 0, 12 20, 16 20, 16 0"></polygon>
                            </svg>
                        </button>
                        <button id="prev-button" onClick={this.next} className="btn-primary circle_button">
                            <svg viewBox="0 0 20 20">
                                <polygon points="20 10, 11 18, 11 10, 2 18, 2 2, 11 10, 11 2"></polygon>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="song_img">
                    <img className="album_img" src={image} onerror="this.onerror=null; this.src='data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='" />
                </div>
            </div>
        );
    }
}

export default MusicPlayer;