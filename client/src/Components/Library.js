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
        user: this.props.user,
        isLoading: true
    }
  }

  componentDidMount=()=> {
    console.log("rendering library again")
    document.getElementById("app").style.height = "calc(100vh - 90px)";
    const loggedInUser = sessionStorage.getItem("user");
    if (loggedInUser) {
        const foundUser = JSON.parse(loggedInUser);
        this.setState({ user:foundUser,isLoading: false })
        
    }
  }


  deletePlaylist = (playlist) => {
      var addedPlaylists = []
      Object.assign(addedPlaylists, this.state.user.addedPlaylists)
      addedPlaylists.splice(addedPlaylists.indexOf(playlist), 1)

      axios.post('/auth/updateAddedPlaylists', {userId: this.state.user._id, addedPlaylists: addedPlaylists}).then(res=>{
            sessionStorage.setItem('user', JSON.stringify(res.data.user))
            this.props.updateUser()
        }).catch(err=>{
            console.log(err)
        })
  }
  deletePlaylistFromLibrary= ()=>{
    this.setState({user:this.props.user, isLoading:false},()=>{
        console.log("done re rendering library")
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
                            <SimpleLibraryList deletePlaylistFromLibrary ={this.deletePlaylistFromLibrary} updateUser={this.props.updateUser} list={this.state.user.library} user={this.state.user} userId={this.state.userId}></SimpleLibraryList>
                        </div>
                    </div>
                    <div className='playlists'>
                        <h2 className="library-labels">Added Playlists</h2>
                        <div className='playlists-cards'>
                            <SimpleLibraryList updateUser={this.props.updateUser} list={this.state.user.addedPlaylists} user={this.state.user} userId={this.state.userId} deletePlaylist={this.deletePlaylist}></SimpleLibraryList>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Library;