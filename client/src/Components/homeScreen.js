
import React from 'react';
import { Link } from 'react-router-dom';
import './css/homeScreen.css'
import axios from 'axios';
import Playlist from '../Components/playlist'
import SimplePlaylistList from './SimplePlaylistList'

class homeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          userId:this.props.userId, 
          playlists:[]

        }
      }
    
    componentDidMount() {
        document.getElementById("app").style.height = "calc(100vh - 90px)";
        console.log("before the post")
        axios.post('/auth/homePlaylists', {}).then(res=>{
            console.log("in the home screen ")
            console.log(res.data.playlist)
            let temp = res.data.playlist.filter(function(playlist) {
                return playlist.public;
            })
            this.setState({playlists: temp})
        }).catch(err=>{
            console.log(err)
        })
      }
    render() {
        return (
            <div id="home-container">
                <div id="scroll-container">
                    <div id="recommendedRow" className="row align-items-start">
                        <div className="col">
                            <h2 className='library-labels'> Recommended for You</h2>
                        </div>
                        <div className="col">
                            <SimplePlaylistList list={this.state.playlists} userID={this.props.userId}></SimplePlaylistList>
                        </div>

                    </div>
                    <div id="playing_songs" className="row align-items-start">
                        <div className="col">
                            <h2 className='library-labels'>Playing Right Now</h2>
                        </div>
                        <div className="col">
                            <SimplePlaylistList list={this.state.playlists} userID={this.props.userId}></SimplePlaylistList>
                        </div>
                    </div>
                </div>
            </div>
        );

    }
}
export default homeScreen;
