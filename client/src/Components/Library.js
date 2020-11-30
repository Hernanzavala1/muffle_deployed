import React from 'react';
import { Link } from 'react-router-dom';
import './css/Library.css';
import data from '../data.json'
import Card from 'react-bootstrap/Card';
import LibraryCard from '../Components/LibraryCard'
import SimpleLibraryList from './SimpleLibraryList'
import axios from 'axios';

class Library extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        userId: this.props.userId,
        user: null,
        isLoading: true
    }
  }

  componentDidMount() {
    document.getElementById("app").style.height = "calc(100vh - 90px)";
    axios.post('/auth/getUser', {userId:this.state.userId}).then(res=>{
        console.log(res.data.user)
        console.log(res.data.user.library)
        this.setState({user: res.data.user})
        this.setState({isLoading: false})
    }).catch(err=>{
        console.log(err)
    })
  }
 
  render() {

    if(this.state.isLoading){
        return <div>Loading...</div>;
    }
        return (
            <div id="container">
                <div id='scroll-container'>
                    <div className='playlists'>
                        <div id='label-container'>
                            <div>
                                <h2 className="library-labels">Your Playlists</h2>
                            </div>
                            <div style={{paddingRight: "100px"}}>
                                <Link to={'/createPlaylist'} style={{paddingRight: "100px", display: "flex", justifyContent: "space-between", textDecoration: 'none'}}>
                                    <i className="fas fa-plus-circle plus-button"></i>
                                    <h2 id="library-create">Create a New Playlist</h2>
                                </Link>
                            </div>
                        </div>
                        <div className='playlists-cards'>
                            <SimpleLibraryList list={this.state.user.library} userId={this.state.userId}></SimpleLibraryList>
                        </div>
                    </div>
                    <div className='playlists'>
                        <h2 className="library-labels">Added Playlists</h2>
                        <div className='playlists-cards'>
                            <SimpleLibraryList list={this.state.user.addedPlaylists} userId={this.state.userId}></SimpleLibraryList>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Library;