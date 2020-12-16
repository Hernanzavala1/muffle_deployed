import React from 'react';
import { Link } from 'react-router-dom';
import './css/Library.css';
import LibraryCard from '../Components/LibraryCard'
import axios from 'axios';
class SimpleLibraryList extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            library: this.props.list,
            updated: false
        }
    }
  
    updateLibrary = () => {
        this.setState({library: this.props.list, updated: true});
        // this.setState({updated: true});
    }
    updateUpd = () => {
        this.setState({updated: false});
    }
    render(){
        console.log("we are rendering here")
        return (
            this.props.list.map((p, index) => (<LibraryCard updateUser={this.props.updateUser} playlist={p} user={this.props.user} updated={this.state.updated} updateUpd={this.updateUpd} userId={this.props.userId} library={this.state.library} updateLibrary={this.updateLibrary} deletePlaylist={this.props.deletePlaylist} deletePlaylistFromLibrary ={this.props.deletePlaylistFromLibrary}></LibraryCard>))
        )
    }
}
export default SimpleLibraryList;