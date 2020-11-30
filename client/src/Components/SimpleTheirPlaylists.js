import React from 'react';
import { Link } from 'react-router-dom';
import './css/Network.css'
import axios from 'axios'

class SimpleTheirPlaylists extends React.Component {
    render() {
        // console.log(this.props.playlists)
        return (
            this.props.playlists.map((p) => (
                <li>
                    <Link to={{pathname: `/publicPlayer/${p._id}`, state: {source: '/network'}}} className="friend-link" style={{ textDecoration: "none" }}>
                        {p.name}
                    </Link>
                </li>
            )
        ))
    }
}
export default SimpleTheirPlaylists;