import React from 'react';
import { Link } from 'react-router-dom';
import './css/Network.css'

class SimpleList extends React.Component {
    render() {
        if(this.props.friendList == true) {
            return (
                <ul>
                    {
                        this.props.list.map((f, index) => (<Link className="friend-link" style={{ textDecoration: "none" }} onClick={() => this.props.onClickFriend(f, index)} >
                                                        <li className={this.props.className}>{f.profileName}</li>
                                                        <div id='friend-options'>
                                                            <i className="fas fa-minus-circle" style={{ "paddingRight": "1rem", "fontSize": "2rem", "color": "white" }}></i>
                                                        </div>
                                                    </Link>))
                    }
                </ul>
            )
        }
        else {
            return (
                <ul>
                    {
                        this.props.list.map((f) => (<Link className="friend-link" style={{ textDecoration: "none" }}>
                                                        <li className={this.props.className}>{f}</li>
                                                        <div id='friend-options'>
                                                            <i className="fas fa-minus-circle" style={{ "paddingRight": "1rem", "fontSize": "2rem", "color": "white" }}></i>
                                                        </div>
                                                    </Link>))
                    }
                </ul>
            )
        }
    }
}
export default SimpleList;