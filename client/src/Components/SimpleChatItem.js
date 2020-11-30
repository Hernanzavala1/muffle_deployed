import React from 'react';
import { Link } from 'react-router-dom';
import './css/Network.css'

class SimpleLabel extends React.Component{
    render(){
        return (
            <li className={this.props.className}>
                {
                    <label>{this.props.text}</label>
                }
            </li>
        )
    }
}
export default SimpleLabel;