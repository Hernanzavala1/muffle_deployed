
import React from 'react';
import { Link } from 'react-router-dom';
import './css/Network.css'
import data from '../data.json'
import SimpleList from './SimpleList'
import SimpleChatItem from './SimpleChatItem'
import SimpleTheirPlaylists from './SimpleTheirPlaylists'
import axios from 'axios'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import socketIOClient from "socket.io-client"
const socket = socketIOClient("localhost:5000");

class Network extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            userId: this.props.userId,
            user: null,
            friends: [],
            currentFriend: null,
            currentFriendIndex: 0,
            messageHistory: [],
            theirPlaylists: [],
            message: "",
            channel: "",
            isLoading: true
        }
    }

    componentDidMount=() =>{
        document.getElementById("app").style.height = "calc(100vh - 90px)";

        axios.post('/auth/getUser', { userId: this.props.userId }).then(res => {
            this.setState({ user: res.data.user })
            var tempA = []
            Object.assign(tempA, this.state.friends)
            var tempP = []
            for (var i = 0; i < this.state.user.friends.length; i++) {
                tempP.push(axios.post('/auth/getUser', { userId: this.state.user.friends[i].friendId }))
            }

            axios.all(tempP).then(axios.spread((...responses) => {
                for(var i = 0; i < responses.length; i++) {
                    tempA.push(responses[i].data.user)
                }
                // tempA.sort(this.compare)
                this.setState({ isLoading: false, friends: tempA })
              })).catch(errors => {
                console.log(errors)
              })
        }).catch(err => {
            console.log(err)
        })

        var tempA = []
        socket.on('message', data => {
            if (data.channel == this.state.channel) {
                var mObj = {
                    message: data.message,
                    senderId: this.state.currentFriend._id
                }

                Object.assign(tempA, this.state.messageHistory)
                tempA.push(mObj)
                this.setState({ messageHistory: tempA }, this.updateUser)
            }
        });
    }
    updateUser=()=>{
        axios.post('/auth/getUser', { userId: this.state.userId}).then(res => {
          
            this.setState({ user: res.data.user }, this.setChannel)

        }).catch(err => {
            console.log(err)
        })
    }

    compare = (a, b) => {
        if (a.profileName < b.profileName) {
            return -1;
        }
        if (a.profileName > b.profileName) {
            return 1;
        }
        return 0;
    }

    setChannel = () => {
        this.setState({ messageHistory: this.state.user.friends[this.state.currentFriendIndex].messageHistory, 
            channel: this.state.user.friends[this.state.currentFriendIndex].socketId }, () => {
            socket.emit("joinChannel", {
                channel: this.state.channel
            })
        })

        var tempA = []
        for (var i = 0; i < this.state.currentFriend.library.length; i++) {
            axios.post('/auth/getPlaylist', { playlistId: this.state.currentFriend.library[i] }).then(res => {
                tempA.push(res.data.playlist)
                this.setState({ theirPlaylists: tempA })
            }).catch(err => {
                console.log(err)
            })
        }

        document.getElementById("text_input").disabled = false
    }

    onClickFriend = (f, index) => {
        this.setState({ currentFriend: f,  currentFriendIndex: index},()=>{
            this.updateUser()
             
             
        })
    }

    onChangeMessage = (e) => {
        this.setState({
            message: e.target.value
        });
    }

    sendMessage = (e) => {
        e.preventDefault()

        var mObj = {
            message: this.state.message,
            senderId: this.state.userId
        }

        var tempA = []
        Object.assign(tempA, this.state.messageHistory)
        tempA.push(mObj)

        axios.post('/auth/addMessage', { userId: this.state.userId, friendId: this.state.currentFriend._id, message: mObj }).then(res => {
            console.log("user", res.data)

            this.setState({ messageHistory: tempA, message: "", user: res.data })
        }).catch(err => {
            console.log(err)
        })
        axios.post('/auth/addMessage', { userId: this.state.currentFriend._id, friendId: this.state.userId, message: mObj }).then(res => {
            console.log("friend", res.data)
        }).catch(err => {
            console.log(err)
        })

        socket.emit('chat', {
            channel: this.state.channel,
            message: this.state.message
        });


    }

    render() {
        if (this.state.isLoading) {
            return <div>Loading...</div>;
        }

        return (
            <div id="container">
                <div id='scroll-container'>
                    <div id="row1" className="row">
                        <div className="col"> <div className="Header_div"><h1 id="network_h1">Network</h1></div></div>
                        <div style={{ paddingRight: "100px" }}>
                            <Link style={{ paddingRight: "100px", display: "flex", justifyContent: "space-between", textDecoration: 'none' }}>
                                <i className="fas fa-plus-circle plus-button"></i>
                                <h2 className="search_label">Search for Friends</h2>
                            </Link>

                        </div>
                    </div>
                    <div id="row2" className="row ">
                        <div className="col-3 text-start">
                            <h4 style={{ "color": "white", "fontWeight": "bold" }}>Friends</h4>
                            <div id='mini-container'>
                                <div id='scroll-container'>
                                    <SimpleList className={"friend-item"} list={this.state.friends} friendList={true} onClickFriend={this.onClickFriend}></SimpleList>
                                </div>
                            </div>
                        </div>
                        <div className="col-3 text-start ">
                            <h4 style={{ "color": "white", "fontWeight": "bold" }}>Group Chats</h4>
                            <SimpleList className={"friend-item"} list={data.network.groupChats}></SimpleList>
                        </div>
                        <div className="col" style={{ minWidth: "40%" }}>
                            <div className="container-chat">
                                <Tabs id="uncontrolled-tab-example">
                                    <Tab eventKey="chat" title="Chat">
                                        <ul id="ul_chat">
                                            <SimpleChatItem messageHistory={this.state.messageHistory} userId={this.state.userId}></SimpleChatItem>
                                        </ul>
                                    </Tab>
                                    <Tab eventKey="playlists" title="Their Playlists">
                                        <ul>
                                            <SimpleTheirPlaylists className={"friend-item"} playlists={this.state.theirPlaylists}></SimpleTheirPlaylists>
                                        </ul>
                                    </Tab>
                                </Tabs>
                                <div id="row_chat" className="row">
                                    <div className="col">
                                        <form onSubmit={this.sendMessage} autoComplete="off">
                                            <input id="text_input" type="text" style={{ "width": "100%" }} value={this.state.message} onChange={this.onChangeMessage} disabled></input>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Network;