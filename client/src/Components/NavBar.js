import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'
import Form from 'react-bootstrap/Form';


class NavBar extends React.Component {
    constructor(props) {
        super(props);
    }
    logOut = () => {
        this.props.updateUserID("");
        this.props.updateUser(null);
        document.getElementById("log-out").textContent = "Log In"
        document.getElementById("splash-link").style.cursor = "pointer";
        document.getElementById("home-link").style.cursor = "default";
        document.getElementById("library-link").style.cursor = "default";
        document.getElementById("network-link").style.cursor = "default";
        document.getElementById("profile-link").style.cursor = "default";
        var ele = document.getElementsByClassName("Nav_item");
        sessionStorage.clear();
        this.props.clear()
    }
    componentDidUpdate(prevProps) {
        if(this.props.userID != "") {
            document.getElementById("log-out").textContent = "Log Out"
            document.getElementById("splash-link").style.cursor = "default";
            document.getElementById("home-link").style.cursor = "pointer";
            document.getElementById("library-link").style.cursor = "pointer";
            document.getElementById("network-link").style.cursor = "pointer";
            document.getElementById("profile-link").style.cursor = "pointer";
            var ele = document.getElementsByClassName("Nav_item");
            for (let item of ele) {
                item.style.color = "whitesmoke";
            }
        }
        else {
            var ele = document.getElementsByClassName("Nav_item");
            for (let item of ele) {
                item.style.color = "grey";
            }
        }
    }
    displayPicture = () => {
        if(this.props.user) {
            return (
                <img src={this.props.user.profilePicture} id="mini-pic"></img>
            )
        }
        else {
            return (
                <img src="data:image/png;base64,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" id="mini-pic"></img>
            )
        }
    }
    render() {
        return (
            <div className="NavBar">
                <ul className='Nav_list'>
                    <Link id="splash-link" to={this.props.userID == "" ? '/splash' : '#'} >
                        <div style={{display: "inline-block"}}>
                            <i id="logo-icon" className="fas fa-music"></i>
                            <strong id='muffle-text'>Muffle</strong>
                        </div>
                    </Link>
                    <Link id="home-link" to={this.props.userID != "" ? '/home' : '#'}>
                        <li className="Nav_item">Home</li>
                    </Link>
                    <Link id="library-link" to={this.props.userID != "" ? '/library' : '#'}>
                        <li className="Nav_item">Library</li>
                    </Link>
                    <Link id="network-link" to={this.props.userID != "" ? '/network' : '#'}>
                        <li className="Nav_item" style={{marginRight: "40px"}}>Network</li>
                    </Link>
                    <i className="fas fa-search" style={{color: "whitesmoke"}}></i>
                    <li className="Nav_item">
                        <Form>
                            <Form.Control type="text" placeholder="Search"/>
                        </Form>
                    </li>
                </ul>
                <div style={{height: "60px", marginRight: "100px",  alignContent: "center", justifyContent:"center", display:"flex", marginTop: "10px", flexShrink: 0}}>
                    {this.props.user && <label style={{"font-size":"1.5em", "color":"whitesmoke", "margin-right":"20px"}}>Welcome, {this.props.user.profileName}</label>}
                    <Link to={'/'}><button id="log-out" type="button" className="log_out_btn btn btn-primary" style={{marginRight: "10px", marginTop: "2px"}} onClick={this.logOut}>Log In</button></Link>
                    <Link id="profile-link" to={this.props.userID != "" ? '/profileScreen' : '#'}>
                        <div id="mini-image-container"> 
                            {/* <img src="/assets/logo.jpg" id="mini-pic"></img> */}
                            {/* {this.props.user && <img src={this.props.user.profilePicture} id="mini-pic"></img>} */}
                            {this.displayPicture()}
                        </div>
                    </Link>
                </div>
                
            </div>
        )
    }
}

export default NavBar