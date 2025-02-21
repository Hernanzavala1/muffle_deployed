
import React from 'react';
import { Link } from 'react-router-dom';
import './css/homeScreen.css'
import axios from 'axios';
import Playlist from '../Components/playlist'
import SimplePlaylistList from './SimplePlaylistList'

class homeScreen extends React.Component {
    constructor(props) {
        super(props);
        // var stored = JSON.parse(sessionStorage.getItem("homeState"))
        // if(stored){

        // }
        this.state =  {
            userId:this.props.userId, 
            playlists:[],
            popularPlaylists:[],
            recommendedPlaylists:[],
            undo:[],
            redo:[],
            islocalStorage:false
        }
        console.log(this.state)

        // window.onbeforeunload = (e)=>{
        //     console.log("we are about to refresh here ")
        //     this.saveState(e)
        //   }
      }
    undoCallback = (func) => {
        var temp = this.state.undo;
        temp.push(func);
        this.setState({undo: temp});
    }
    redoCallback = (func) => {
        var temp = this.state.redo;
        temp.push(func);
        this.setState({redo: temp});
    }
    undo = () => {
        if (this.state.undo === undefined || this.state.undo.length == 0) {
            return;
        }
        var temp = this.state.undo.pop();
        temp(true);
        //set undo, remove last element, push to redo, set state
        var undoTemp = this.state.undo;
        undoTemp.splice(undoTemp.length, 1);
        this.setState({undo: undoTemp});
    }
    redo() {
        if (this.state.redo === undefined || this.state.redo.length == 0) {
            return;
        }
        var temp = this.state.redo.pop();
        temp(false);
        var redoTemp = this.state.redo;
        redoTemp.splice(redoTemp.length, 1);
        this.setState({redo: redoTemp});
    }
    componentDidMount=()=> {
        document.getElementById("app").style.height = "calc(100vh - 90px)";
        console.log("before the post")
        var stored = JSON.parse(sessionStorage.getItem("homeState"))
        if(stored){
            this.setState(stored,()=>{
                console.log(this.state)
            })
            return;
        }
        axios.post('/auth/homePlaylists', {}).then(res=>{
            console.log("in the home screen ")
            // console.log(res.data.playlist)
            let temp = res.data.playlist.filter(function(playlist) {
                return playlist.public;
            })
            this.setState({playlists: temp,islocalStorage:true}, ()=>{
                 this.loadPopularPlaylist()
                 this.loadRecommendedPlaylist()
            })
        }).catch(err=>{
            console.log(err)
        })  
    
    }
    loadPopularPlaylist=()=>{
     var popularPlaylists = this.state.playlists.filter((playlist)=>{
        if( playlist.likes >= 100){
            return playlist;
        }
     })
     console.log(popularPlaylists)
     this.setState({popularPlaylists:popularPlaylists})
    }
    loadRecommendedPlaylist=()=>{
        var temp = []
        Object.assign(temp, this.state.playlists)
        for (var i = temp.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            [temp[i], temp[j]] = [temp[j], temp[i]];
        }
        this.setState({recommendedPlaylists: temp})
    }
    undoHandler = (e) => {
        if (e.keyCode === 90 && e.ctrlKey)
            this.undo();
    }
    redoHandler = (e) => {
        if (e.keyCode === 89 && e.ctrlKey)
            this.redo();
    }
    componentDidUpdate=()=> {
        console.log("we have updated the componernt")
        document.removeEventListener('keydown', this.undoHandler);
        document.addEventListener('keydown', this.undoHandler);
        document.removeEventListener('keydown', this.redoHandler);
        document.addEventListener('keydown', this.redoHandler);
        this.saveState()
    }
    saveState =()=>{
        console.log("we are refreshing ")
        sessionStorage.setItem("homeState",JSON.stringify(this.state))
      }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.redoHandler);
        document.removeEventListener('keydown', this.undoHandler);
    }
    render() {
        if(this.state.popularPlaylists.length ===0){
            return (<div></div>)
        }
        return (
            <div id="home-container">
                <div id="scroll-container">
                    <div id="recommendedRow" className="row align-items-start">
                        <div className="col">
                            <h2 className='library-labels'>Random Playlists</h2>
                        </div>
                        <div className="col">
                            <SimplePlaylistList updateUser={this.props.updateUser} list={this.state.recommendedPlaylists} userID={this.state.userId} undoCallback={this.undoCallback} redoCallback={this.redoCallback}></SimplePlaylistList>
                        </div>

                    </div>
                    <div id="playing_songs" className="row align-items-start">
                        <div className="col">
                            <h2 className='library-labels'>Popular Playlists</h2>
                        </div>
                        <div className="col">
                            <SimplePlaylistList updateUser={this.props.updateUser} list={this.state.popularPlaylists} userID={this.state.userId} undoCallback={this.undoCallback} redoCallback={this.redoCallback}></SimplePlaylistList>
                        </div>
                    </div>
                </div>
            </div>
        );

    }
}
export default homeScreen;
