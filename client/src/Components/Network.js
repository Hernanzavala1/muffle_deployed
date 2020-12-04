
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
import { Button, Modal } from 'react-bootstrap'
// import socketIOClient from "socket.io-client"
// const socket = socketIOClient("https://muffle-deployment1.herokuapp.com/");
import io from "socket.io"
var socket = io.connect("https://muffle-deployment1.herokuapp.com/");
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
            modalShow: false,
            isLoading: true
        }
    }

    componentDidMount = () => {
        document.getElementById("app").style.height = "calc(100vh - 90px)";

        axios.post('/auth/getUser', { userId: this.props.userId }).then(res => {
            this.setState({ user: res.data.user }, () => this.updateFriendsList())
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

    updateFriendsList = () => {
        console.log(this.state)
        var tempA = []
        Object.assign(tempA, this.state.friends)
        var tempP = []
        for (var i = 0; i < this.state.user.friends.length; i++) {
            tempP.push(axios.post('/auth/getUser', { userId: this.state.user.friends[i].friendId }))
        }

        axios.all(tempP).then(axios.spread((...responses) => {
            for (var i = 0; i < responses.length; i++) {
                tempA.push(responses[i].data.user)
            }
            // tempA.sort(this.compare)
            this.setState({ isLoading: false, friends: tempA })
        })).catch(errors => {
            console.log(errors)
        })
    }

    updateUser = () => {
        axios.post('/auth/getUser', { userId: this.state.userId }).then(res => {

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
        var tempA = []
        var requests=[]
        for (var i = 0; i < this.state.currentFriend.library.length; i++) {
            requests.push(axios.post('/auth/getPlaylist', { playlistId: this.state.currentFriend.library[i] }))
        }
        axios.all(requests).then(axios.spread((...responses) => {
            for (var i = 0; i < responses.length; i++) {
                tempA.push(responses[i].data.playlist)
            }
                this.setState({ theirPlaylists: tempA }, ()=> {document.getElementById("ul_chat").scrollTop = document.getElementById("ul_chat").scrollHeight;})
        })).catch(err=>{
            console.log(err)
        })

        this.setState({
            messageHistory: this.state.user.friends[this.state.currentFriendIndex].messageHistory,
            channel: this.state.user.friends[this.state.currentFriendIndex].socketId
        }, () => {
            socket.emit("joinChannel", {
                channel: this.state.channel
            })
        })

        document.getElementById("text_input").disabled = false
    }

    onClickFriend = (f, index) => {
        this.setState({ currentFriend: f, currentFriendIndex: index }, () => {
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

            this.setState({ messageHistory: tempA, message: "", user: res.data }, function() {document.getElementById("ul_chat").scrollTop = document.getElementById("ul_chat").scrollHeight;})
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

    onRemoveFriend = (e, cell, index) => {
        e.preventDefault()
        e.stopPropagation()
        console.log(this.state.friends)
        console.log(this.state.user)
        var friend = this.state.friends[index]
        var tempA = []
        Object.assign(tempA, this.state.user.friends)
        tempA.splice(index, 1);
        axios.post('/auth/removeFriend', { userId: this.state.userId, friendsList: tempA })
            .then(res => {
                console.log(res.data)
                this.setState({user: res.data.user, friends: []}, () => this.updateFriendsList())
            })
            .catch(error => {
                console.log(error)
        });

        for(var i = 0; i < friend.friends.length; i++) {
            if(friend.friends[i].friendId === this.state.userId) {
                index = i
                break
            }
        }
        Object.assign(tempA, friend.friends)
        tempA.splice(index, 1);
        axios.post('/auth/removeFriend', { userId: friend._id, friendsList: tempA })
            .then(res => {
                console.log(res.data)
            })
            .catch(error => {
                console.log(error)
        });
    }

    searchFriend = (e) => {
        e.preventDefault();

        var friendName = document.getElementById("friend_input").value

        this.setState({ modalShow: false })
        this.props.history.push({
            pathname: '/friendResult',
            state: { friendName: friendName, userId: this.props.userId }
          })
    }

    handleModal = (e, isOpen) => {
        e.preventDefault();

        if (!isOpen) {
            this.setState({ modalShow: isOpen }, () => {
                console.log("we are opening the modal? ", isOpen)
            })
        }
        else {
            this.setState({ modalShow: isOpen }, () => {
                console.log("we are opening the modal? ", isOpen)
            })
        }
    }

    render() {
        if (this.state.isLoading) {
            return <div>Loading...</div>;
        }

        return (
            <div>
                <div id="container">
                    <div id='scroll-container'>
                        <div id="row1" className="row">
                            <div className="col"> <div className="Header_div"><h1 id="network_h1">Network</h1></div></div>
                            <div style={{ paddingRight: "100px" }}>
                                <Link style={{ paddingRight: "100px", display: "flex", justifyContent: "space-between", textDecoration: 'none' }} onClick={e => this.handleModal(e, true)}>
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
                                        <SimpleList className={"friend-item"} list={this.state.friends} friendList={true} onClickFriend={this.onClickFriend} onRemoveFriend={this.onRemoveFriend}></SimpleList>
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
                                            <div id="row_chat" className="row">
                                                <div className="col">
                                                    <form onSubmit={this.sendMessage} autoComplete="off">
                                                        <input id="text_input" type="text" style={{ "width": "100%" }} value={this.state.message} onChange={this.onChangeMessage} disabled></input>
                                                    </form>
                                                </div>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="playlists" title="Their Playlists">
                                            <ul>
                                                <SimpleTheirPlaylists className={"friend-item"} playlists={this.state.theirPlaylists}></SimpleTheirPlaylists>
                                            </ul>
                                        </Tab>
                                    </Tabs>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    data-backdrop="static"
                    data-keyboard="false"
                    show={this.state.modalShow}
                >
                    <Modal.Header>Search for Friends</Modal.Header>
                    <Modal.Body>
                        <h4>Search with profile name:</h4>
                        <input id="friend_input" type="text" style={{ "width": "100%" }}></input>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="secondary" onClick={(e) => { this.searchFriend(e) }}>Search </Button>
                        <Button className='secondary' onClick={(e) => this.handleModal(e, false)} data-dismiss="modal">Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
export default Network;