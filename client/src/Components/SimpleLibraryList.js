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
        this.setState({library: this.props.list});
        this.setState({updated: true});
    }
    updateUpd = () => {
        this.setState({updated: false});
    }
    render(){
        return (
            this.state.library.map((p, index) => (<LibraryCard playlist={p} updated={this.state.updated} updateUpd={this.updateUpd} userId={this.props.userId} library={this.state.library} updateLibrary={this.updateLibrary}></LibraryCard>))
        )
    }
}
export default SimpleLibraryList;