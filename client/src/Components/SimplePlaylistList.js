import React from 'react';
import { Link } from 'react-router-dom';
import './css/homeScreen.css'
import Playlist from '../Components/playlist'

class SimplePlaylistList extends React.Component{
    constructor(props){
        super(props)
    }
 
    // render(){
    //     return (
    //         <ul id="playlist-list">
    //             {
    //                 this.props.list.map((p) => (<li onClick={()=>{this.props.updatePlaylist(p)}} className="li_playlists"><Link  to={`/publicPlayer/${p._id}`}><Playlist   playlist={p} userID={this.props.userID}></Playlist></Link></li>))
    //             }
    //         </ul>
    //     )
    // }
    render(){
        return (
            <ul id="playlist-list">
                {
                    this.props.list.map((p) => (<li className="li_playlists"><Playlist playlist={p} userID={this.props.userID}></Playlist></li>))
                    // this.props.list.map((p) => (<li className="li_playlists"><Link  to={`/publicPlayer/${p._id}`}><Playlist   playlist={p} userID={this.props.userID}></Playlist></Link></li>))
                }
            </ul>
        )
    }
}
export default SimplePlaylistList;