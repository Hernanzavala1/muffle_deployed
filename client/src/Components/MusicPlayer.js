import React from 'react'
import './css/MusicPlayer.css'
import data from '../data.json'
import { Link } from 'react-router-dom';
import axios from 'axios'
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
            currentVolume : 0.5,
            playlist: data.playlistTest.list
        }
        console.log(this.state.playlist);
      
    }
    play = () => {
        if (this.props.currentPlaylist != "") {
            this.state.playlist = this.props.currentPlaylist.songs;
        }
        if (this.state.length != 0) {
            this.song.play();
        }
        else{
            this.song = new Audio(this.state.playlist[this.state.currentSong].uri);
            this.song.play();
            this.song.volume = this.state.currentVolume;
            this.song.ontimeupdate = this.updateTimeline;
        }
        this.setState({ play: true });
        console.log(this.state.playlist);
        document.getElementById("pause-button").style.display = "block";
        document.getElementById("play-button").style.display = "none";
        this.setState({ currentName: this.state.playlist[this.state.currentSong].title, currentArtist: this.state.playlist[this.state.currentSong].artist, length: this.state.playlist[this.state.currentSong].duration});
    }
    playFromPlaylist = (song) => {
        if (this.props.currentPlaylist != "") {
            this.state.playlist = this.props.currentPlaylist.songs;
        }
        if (this.state.play) {
            this.song.pause();
        }
        //if not same song as current song and something playing
        if((song.uri !== this.state.playlist[this.state.currentSong].uri)) {
            for (var i = 0; i < this.state.playlist.length; i++) {
                if (song.uri === this.state.playlist[i].uri) {
                    this.setState({currentSong: i}, () => {this.song = new Audio(this.state.playlist[this.state.currentSong].uri);
                        this.song.play();
                        this.setState({play: true});
                        this.song.volume = this.state.currentVolume;
                        this.song.ontimeupdate = this.updateTimeline;
                        console.log(this.state.playlist);
                        document.getElementById("pause-button").style.display = "block";
                        document.getElementById("play-button").style.display = "none";
                        this.setState({ currentName: this.state.playlist[this.state.currentSong].title, currentArtist: this.state.playlist[this.state.currentSong].artist, length: this.state.playlist[this.state.currentSong].duration});});
                }
            }
        }
        else {
            this.song = new Audio(this.state.playlist[this.state.currentSong].uri);
            this.song.play();
            this.setState({play: true});
            this.song.volume = this.state.currentVolume;
            this.song.ontimeupdate = this.updateTimeline;
            console.log(this.state.playlist);
            document.getElementById("pause-button").style.display = "block";
            document.getElementById("play-button").style.display = "none";
            this.setState({ currentName: this.state.playlist[this.state.currentSong].title, currentArtist: this.state.playlist[this.state.currentSong].artist, length: this.state.playlist[this.state.currentSong].duration});
        }
    }
    pause = () => {
        this.setState( {play: false });
        this.song.pause();
        document.getElementById("pause-button").style.display = "none";
        document.getElementById("play-button").style.display = "block";
    }
    next = () => {
        this.song.pause();
        if (this.state.currentSong == this.state.playlist.length - 1) {
            this.state.currentSong = 0;
        }
        else {
            this.state.currentSong += 1;
        }
        this.song = new Audio(this.state.playlist[this.state.currentSong].uri);
        this.song.ontimeupdate = this.updateTimeline;
        this.setState({ currentName: this.state.playlist[this.state.currentSong].title, currentArtist: this.state.playlist[this.state.currentSong].artist, length: this.state.playlist[this.state.currentSong].duration});
        this.song.volume = this.state.currentVolume;
        this.song.play();
        document.getElementById("pause-button").style.display = "block";
        document.getElementById("play-button").style.display = "none";
    }
    prev = () => {
        this.song.pause();
        if (this.state.currentSong == 0) {
            this.state.currentSong = this.state.playlist.length - 1;
        }
        else {
            this.state.currentSong -= 1;
        }
        this.song = new Audio(this.state.playlist[this.state.currentSong].uri);
        this.song.ontimeupdate = this.updateTimeline;
        this.setState({ currentName: this.state.playlist[this.state.currentSong].title, currentArtist: this.state.playlist[this.state.currentSong].artist, length: this.state.playlist[this.state.currentSong].duration});
        this.song.volume = this.state.currentVolume;
        this.song.play();
        document.getElementById("pause-button").style.display = "block";
        document.getElementById("play-button").style.display = "none";
    }
    updateTimeline = () => {
        var progress = document.getElementsByClassName("progress-bar")[0];
        var percent = (this.song.currentTime / this.song.duration) * 100;
        progress.style.width = percent + "%";
        if (percent == 100) {
            this.next();
        }
    }
    updateVolume = (event) => {
        this.song.volume = event.target.value / 100;
        this.state.currentVolume = this.song.volume;
    }
    componentDidMount = () => {
        console.log(this.props.currentPlaylist);

    }

    render() {
       let bool = this.props.currentPlaylist.public;
       let id = this.props.currentPlaylist._id;
       console.log(this.state.playlist )
       console.log(this.props.currentPlaylist)
       var Child;
       if(bool){
           console.log("we re in the public playlist ")
         Child =(
            <Link to={`/publicPlayer/${id}`} id="goBackLink" ><label id="playlist_back">Back to Playlist</label></Link>
          )
    }
    else{
        console.log("we re in the private  playlist ")
         Child = (
            <Link to={`/player/${id}`} id="goBackLink" ><label id="playlist_back">Back to Playlist</label></Link>
          )
    }
        return (
            <div className='player_box'>
                <div className="Song_info">
                    <div className='goBack'>
                        <i className="fas fa-arrow-left"></i>
                        {/* <Link id="goBackLink" ><label id="playlist_back">Back to Playlist</label></Link> */}
                        {Child}
                    </div>
                    <div className = "info-wrapper">
                        <div id="song_label"><label>{this.state.currentName}</label></div>
                        <div id="artist_label"> <label>{this.state.currentArtist}</label></div>
                    </div>
                </div>
                <div className="Player_btns">
                <input type="range" min="0" max="100" class="slider" id="volume" onInput={this.updateVolume}></input>
                    <div className="progress">
                        <div className="progress-bar" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <div className="music_buttons">
                        <button id="prev-button" onClick={this.prev} className="btn-primary circle_button">
                            <svg >
                                <polygon points = "18 2, 18 18, 9 10, 9 18, 0 10, 9 2, 9 10"></polygon>
                            </svg>
                        </button>
                        <button id="play-button" onClick={this.play} className="btn-primary circle_button">
                            <svg idviewBox="0 0 20 20">
                                <polygon id="play-poly" points = "4 0, 4 18, 20 9"></polygon>
                            </svg>
                        </button>
                        <button id="pause-button" onClick={this.pause} className="btn-primary circle_button" style={{display: "none"}}>
                            <svg idviewBox="0 0 20 20">
                                <polygon id="pause-poly" points = "4 0, 4 20, 8 20, 8 0, 12 0, 12 20, 16 20, 16 0"></polygon>
                            </svg>
                        </button>
                        <button id="prev-button" onClick={this.next} className="btn-primary circle_button">
                            <svg viewBox="0 0 20 20">
                                <polygon points = "20 10, 11 18, 11 10, 2 18, 2 2, 11 10, 11 2"></polygon>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="song_img">
                    <img className="album_img" src={data.musicPlayer.image} alt="true"/>
                </div>
            </div>

        );
    }
}

export default MusicPlayer;