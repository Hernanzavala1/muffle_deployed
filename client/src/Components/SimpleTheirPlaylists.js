import React from 'react';
import { Link } from 'react-router-dom';
import './css/Network.css'
import axios from 'axios'

class SimpleTheirPlaylists extends React.Component {
    render() {
        // console.log(this.props.playlists)
        return (
            this.props.playlists.map((p) => (
                <li className="playlist-link">
                    <img src={p.songs[0].image}></img>
                    <Link to={{pathname: `/publicPlayer/${p._id}`, state: {source: '/network'}}} className="friend-link" style={{ textDecoration: "none", display: "inline-block", paddingLeft: "25px", fontSize: "1.5rem " }}>
                        {p.name}
                    </Link>
                </li>
            )
        ))
    }
}
export default SimpleTheirPlaylists;