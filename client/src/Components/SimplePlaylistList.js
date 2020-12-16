import React from 'react';
import { Link } from 'react-router-dom';
import './css/homeScreen.css'
import Playlist from '../Components/playlist'

class SimplePlaylistList extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return (
            <ul id="playlist-list">
                {
                    this.props.list.map((p) => (<li className="li_playlists"><Playlist updateUser={this.props.updateUser} playlist={p} userID={this.props.userID} undoCallback={this.props.undoCallback} redoCallback={this.props.redoCallback}></Playlist></li>))
                }
            </ul>
        )
    }
}
export default SimplePlaylistList;