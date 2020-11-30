import React from 'react';
import { Link } from 'react-router-dom';
import './css/Network.css'

class SimpleLabel extends React.Component{
    renderMessage(m) {
        if(this.props.publicPlayer) {
            if(m.senderId === this.props.userId) {
                return (
                    <li className="sent_chat">
                        {
                            <label>{m.message}</label>
                        }
                    </li>
                )
            }
            else {
                return (
                    <li className="received_chat">
                        {
                            <label>{m.profileName + ": " + m.message}</label>
                        }
                    </li>
                )
            }
        }
        if(m.senderId === this.props.userId) {
            return (
                <li className="sent_chat">
                    {
                        <label>{m.message}</label>
                    }
                </li>
            )
        }
        else {
            return (
                <li className="received_chat">
                    {
                        <label>{m.message}</label>
                    }
                </li>
            )
        }
    }

    render(){
        return (
            this.props.messageHistory.map((m) => this.renderMessage(m))
        )
    }
}
export default SimpleLabel;