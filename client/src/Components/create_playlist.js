
import React from 'react';
import { Link } from 'react-router-dom';
import './css/playlist_player.css'
import data from '../data.json'
import axios from 'axios'
import qs from 'qs'
import SimplePlaylistTable from './SimplePlaylistTable'

const data_post = {
    grant_type: 'client_credentials',
};
const headers = {
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        "Authorization": "Basic NDIyMmI5M2FiYjY5NDdkZWE3YzMxODlmOWFkMGQwNGM6ZjQ2MWY0NDQ0M2FiNDk5Mzg1MTU3YjM3YzBiOTcyMjM"
    }
};
class create_playlist extends React.Component {
    constructor(props) {
        super(props)

        this.onAddToPlaylist = this.onAddToPlaylist.bind(this)
        this.onRemoveFromPlaylist = this.onRemoveFromPlaylist.bind(this)
        this.onMoveSongUp = this.onMoveSongUp.bind(this)
        this.onMoveSongDown = this.onMoveSongDown.bind(this)
        this.savePlaylist = this.savePlaylist.bind(this)

        this.state = {
            userId: this.props.userId,
            access_token: null,
            tracks: [],
            artistId: null,
            songName: '',
            results: [],
            playlistSongs: [],
            playlistName: '',
            edit: false,
            playlist: null

        }
    }
    componentDidMount() {
        document.getElementById("app").style.height = "calc(100vh - 90 px)";
        let playlistId = this.props.match.params.id
        if (playlistId != undefined) {
            axios.post('/auth/getPlaylist', { playlistId }).then(res => {
                this.setState({ playlist: res.data.playlist, playlistSongs: res.data.playlist.songs, playlistName: res.data.playlist.name, edit: true }, () => {
                    console.log("editing the playlist")
                })
            }).catch(err => {
                console.log(err)
            })
 
        }
        // document.querySelector("table[id='search-table'] i.fa-minus-circle").classList.add("fa-plus-circle");
        // document.querySelector("table[id='search-table'] i.fa-minus-circle").classList.remove("fa-minus-circle");
        axios.post(
            'https://accounts.spotify.com/api/token',
            qs.stringify(data_post),
            headers
        ).then((response) => {
            this.setState({ access_token: response.data.access_token })
        }).catch(err => {
            console.log(err)
        })

        document.getElementById("save-playlist-container").childNodes[0].style.color='#0056b3'
    }

    updateSongName = (e) => {
        console.log(e.target.value, "is the new text");
        this.setState({ songName: e.target.value })
    }

    updatePlaylistName = (e) => {
        this.setState({ playlistName: e.target.value })

        if(e.target.value.length > 0 && this.state.playlistSongs.length > 0) {  // Enable
            document.getElementById("save-playlist-container").style.pointerEvents='auto'
            document.getElementById("save-playlist-container").childNodes[0].style.color='#007bff'
            document.getElementById("save-playlist-container").childNodes[1].style.color='#007bff'
        }
        else {  // Disable
            document.getElementById("save-playlist-container").style.pointerEvents='none'
            document.getElementById("save-playlist-container").childNodes[0].style.color='#0056b3'
            document.getElementById("save-playlist-container").childNodes[1].style.color='#0056b3'
        }
    }

    searchMusic = () => {
        var searchInstance = axios.create({
            baseURL: 'https://api.spotify.com/v1',
            timeout: 1000,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': "Bearer " + String(this.state.access_token)
            }
        });
        if (this.state.songName == '') {
            console.log("empty song name")
            return
        }
        let artistName = this.state.songName;
        // artistName = artistName.replace(" ", "+")
        let type = 'artist,track,album'
        let x = searchInstance.get('/search', { params: { q: artistName, type: type } })
        x.then(res => {
            console.log("all the response")
            console.log(res)

            if(res.data.tracks.items.length <= 0) {
                this.setState({ results: [] })
                return
            }

            this.setState({ tracks: res.data.tracks.items[0].id })
            // return searchInstance.get(`/artists/${artistId}/top-tracks`, {params:{country:'US'}})

            var duration, timeMin, timeSec
            this.setState({ results: [] })
            for (var i = 0; i < res.data.tracks.items.length; i++) {
                timeMin = Math.floor(res.data.tracks.items[i].duration_ms / 60000)
                timeSec = ((res.data.tracks.items[i].duration_ms % 60000) / 1000).toFixed(0)
                duration = timeMin + ":" + (timeSec < 10 ? '0' : '') + timeSec
                this.state.results.push({
                    title: res.data.tracks.items[i].name, artist: res.data.tracks.items[i].artists[0].name,
                    duration: duration, uri: res.data.tracks.items[i].preview_url, image: res.data.tracks.items[i].album.images[0].url
                })
            }
            this.setState({ songName: "" })
            console.log(this.state.results)

        }).catch(err => {
            console.log(err)
        })
    }

    onAddToPlaylist(cell) {
        if(this.state.playlistName.length > 0) {    // Enable
            document.getElementById("save-playlist-container").style.pointerEvents='auto'
            document.getElementById("save-playlist-container").childNodes[0].style.color='#007bff'
            document.getElementById("save-playlist-container").childNodes[1].style.color='#007bff'
        }

        this.state.playlistSongs.push(cell)
        this.setState({ songName: "" })
    }

    onRemoveFromPlaylist(cell) {
        var tempA = this.state.playlistSongs
        var index = tempA.indexOf(cell)
        tempA.splice(index, 1)
        this.setState({ playlistSongs: tempA })

        if(this.state.playlistSongs.length <= 0) {  // Disable
            document.getElementById("save-playlist-container").style.pointerEvents='none'
            document.getElementById("save-playlist-container").childNodes[0].style.color='#0056b3'
            document.getElementById("save-playlist-container").childNodes[1].style.color='#0056b3'
        }
    }
    
    updatePlaylist = () => {
        let playlistId = this.props.match.params.id
        axios.post('/auth/updatePlaylist', { playlistId: playlistId, playlistName: this.state.playlistName, songs: this.state.playlistSongs }).then((res) => {
            console.log(res.data.playlist);
            this.props.history.push('/library')
        }).catch((err) => {
            console.log(err)
        })
    }

    onMoveSongUp(cell) {
        var bottomIndex = this.state.playlistSongs.indexOf(cell)
        var topIndex = bottomIndex - 1
        var tempA = this.state.playlistSongs

        if(topIndex < 0)
            topIndex = tempA.length - 1

        var swap = tempA[topIndex]
        tempA[topIndex] = tempA[bottomIndex]
        tempA[bottomIndex] = swap

        this.setState({playlistSongs: tempA})
    }

    onMoveSongDown(cell) {
        var topIndex = this.state.playlistSongs.indexOf(cell)
        var bottomIndex = topIndex + 1
        var tempA = this.state.playlistSongs

        if(bottomIndex > (tempA.length - 1))
            bottomIndex = 0

        var swap = tempA[topIndex]
        tempA[topIndex] = tempA[bottomIndex]
        tempA[bottomIndex] = swap
        
        this.setState({playlistSongs: tempA})
    }

    savePlaylist() {
        if (this.state.edit) {
            this.updatePlaylist()
            return
        }
        console.log("in save playlist")
        console.log(this.state.playlistName)
        axios.post('/auth/createPlaylist', { songs: this.state.playlistSongs, userId: this.state.userId, public: false, name: this.state.playlistName, likes: 0 })
            .then(res => {
                console.log(res.data)

                axios.post('/auth/addPlaylist', { userId: this.state.userId, playlistId: res.data.playlist._id })
                    .then(res => {
                        console.log(res.data)
                        this.props.history.push({
                            pathname: '/library',
                            state: { userId: res.data.user._id}
                          })
                    })
                    .catch(error => {
                        console.log(error)
                    });
            }).catch(err => {
                console.log(err)
            })
    }

    render() {
        if (this.state.result != null) {
            console.log('in the render method')
            console.log(this.state.result)
        }

        return (
            <div id="container">
                <div id='scroll-container'>
                    <div id="row1_player" className="row height:10%">
                        <Link to='/library' style={{ "display": "flex" }}>
                            <div><i className="fas fa-long-arrow-alt-left" style={{ "color": "White", "textAlign": "center" }}></i></div>
                            <div> <label style={{ "color": "White", "textAlign": "center", "fontWeight": "bold", "margin-left": "5px", "cursor": "pointer" }}>Back</label></div>
                        </Link>
                    </div>
                    <div style={{ "margin": "20px", "marginBottom": "25px" }} className="row height:15% ">
                        <div className="col" style={{ "minHeight": "42px", "maxHeight": "65px", "overflowY": "overlay" }}>
                            {/* <h3 contentEditable="true" style={{ "color": "white", "overflow-wrap": "anywhere" }} onChange={(e)=>this.updatePlaylistName(e)}>{this.state.playlistName}</h3> */}
                            <input id="playlist_name" type="text" onChange={(e) => this.updatePlaylistName(e)} value={this.state.playlistName} placeholder={"Enter playlist name here..."}></input>
                        </div>
                        <div id="save-playlist-container" onClick={this.savePlaylist}>
                            <i className="fas fa-check-circle" style={{ "fontSize": "2rem", "color": "white", marginRight: "10px", "color": "#007bff" }}></i>
                            <strong id='add-text'>Save Playlist</strong>
                        </div>
                        <div className="col justify-content:space-between">
                            <div id="playlist-options">
                                <div  id="opt-container" onClick={this.searchMusic}>
                                    <i className="fas fa-plus-circle" style={{ "fontSize": "2rem", "color": "white", marginRight: "10px", "color": "#007bff" }}></i>
                                    <strong id='add-text'>Search Songs</strong>
                                    {/* </Link> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row align-items-center justify-content-around ">
                        <div className="table-wrapper-scroll-y my-custom-scrollbar " style={{ "minHeight": "50vh", "maxHeight": "50vh", "maxWidth": "45vw", "width": "95%" }}>
                            <table scope="col" className="table table-dark table-fixed " id="playlist-table">
                                <thead>
                                    <tr>
                                        <th id="column_title" scope="col">Title</th>
                                        <th id="column_title" scope="col">Artist</th>
                                        <th id="column_title" scope="col">Time</th>
                                    </tr>
                                </thead>
                                <SimplePlaylistTable playlists={this.state.playlistSongs} onRemoveFromPlaylist={this.onRemoveFromPlaylist} onMoveSongUp={this.onMoveSongUp} onMoveSongDown={this.onMoveSongDown} isResult={false}></SimplePlaylistTable>
                            </table>
                        </div>
                        <div className="col-6 justify-content-center ">
                            <div className="search_container d-flex  align-items-center   ">
                                <input id="search_input" type="text" placeholder="Search by Song, Lyrics or Artist" onChange={(e) => this.updateSongName(e)} value={this.state.songName}></input>
                                <div className="table-wrapper-scroll-y my-custom-scrollbar height:inherit" style={{ "minHeight": "40vh", "maxHeight": "50vh", "width": "95%" }}>
                                    <table scope="col" className="table table-dark table-fixed" id="search-table" >
                                        <thead>
                                            <tr>
                                                <th id="column_title" scope="col">Title</th>
                                                <th id="column_title" scope="col">Artist</th>
                                                <th id="column_title" scope="col">Time</th>
                                            </tr>
                                        </thead>
                                        <SimplePlaylistTable playlists={this.state.results} onAddToPlaylist={this.onAddToPlaylist} isResult={true}></SimplePlaylistTable>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default create_playlist;