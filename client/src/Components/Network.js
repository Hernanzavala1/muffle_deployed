
import React from 'react';
import { Link } from 'react-router-dom';
import './css/Network.css'
import data from '../data.json'
import SimpleList from './SimpleList'
import SimpleChatItem from './SimpleChatItem'
class Network extends React.Component {

    componentDidMount() {
        document.getElementById("app").style.height = "calc(100vh - 90px)";
      }
    
    render() {
        return (
            <div id="container">
                <div id='scroll-container'>
                    <div id="row1" className="row">
                        <div className="col"> <div className="Header_div"><h1 id="network_h1">Network</h1></div></div>
                        <div style={{paddingRight: "100px"}}>
                            <Link style={{paddingRight: "100px", display: "flex", justifyContent: "space-between", textDecoration: 'none'}}>
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
                                    <SimpleList className={"friend-item"} list={data.network.friends}></SimpleList>
                                </div>
                            </div>
                        </div>
                        <div className="col-3 text-start ">
                            <h4 style={{ "color": "white", "fontWeight": "bold" }}>Group Chats</h4>
                            <SimpleList className={"friend-item"} list={data.network.groupChats}></SimpleList>
                        </div>
                        <div className="col" style={{minWidth: "40%"}}>
                            <div className="container-chat">
                                <div className="row">
                                    <div id="tabs" className="col">
                                        <nav>
                                            <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                                <a className="nav-item nav-link active" id="nav-chat-tab" data-toggle="tab" href="#nav-chat" role="tab" aria-controls="nav-home" aria-selected="true">Chat</a>
                                                <a className="nav-item nav-link" id="nav-playlist-tab" data-toggle="tab" href="#nav-playlists" role="tab" aria-controls="nav-profile" aria-selected="false">Their Playlists</a>
                                            </div>
                                        </nav>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <ul id="ul_chat">
                                            <SimpleChatItem className={"received_chat"} text={data.network.receivedChat}></SimpleChatItem>
                                            <SimpleChatItem className={"sent_chat"} text={data.network.sentChat}></SimpleChatItem>
                                        </ul>
                                    </div>
                                </div>
                                <div id="row_chat" className="row">
                                    <div className="col">
                                    <input id="text_input" type="text"></input>
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