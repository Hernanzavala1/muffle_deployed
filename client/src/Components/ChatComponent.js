// import React from 'react';
// import { Link } from 'react-router-dom';
// import './css/Network.css'
// import socketIOClient from "socket.io-client"
// const socket = socketIOClient("localhost:5000");
// console.log("rendered")

// class ChatComponent extends React.Component{
//     constructor(props) {
//         super(props);
//     }
//     componentDidMount() {
//         socket.on('message', message => {
//             console.log("Client receives " + message);
//             this.appendMessage(message);
//             document.getElementById("message-box").scrollTop = document.getElementById("message-box").scrollHeight;
//         });
//         console.log("renderedsuper");
//     }
//     textSend = (e) => {
//         e.preventDefault();
//         socket.emit('chat', e.target.elements.chat.value);
//         console.log(e);
//     }
//     appendMessage(message) {
//         const div = document.createElement('div');
//         div.classList.add('message');
//         div.innerHTML = `<p> ${message}</p>`;
//         document.getElementById("message-box").appendChild(div);
//     }
//     render(){
//         return (
//             <div>
//                 <div id="message-box">
//                     <div className="message">Hello</div>
//                 </div>
//                 <form onSubmit={this.textSend}>
//                     <input id="chat" type="text"></input>
//                 </form>
//             </div>
//         )
//     }
// }
// export default ChatComponent;