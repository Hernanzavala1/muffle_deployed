
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
        document.getElementById("log-out").textContent = "Log In"
        document.getElementById("splash-link").style.cursor = "pointer";
        document.getElementById("home-link").style.cursor = "default";
        document.getElementById("library-link").style.cursor = "default";
        document.getElementById("network-link").style.cursor = "default";
        var ele = document.getElementsByClassName("Nav_item");
    }
    componentDidUpdate(prevProps) {
        if(this.props.userID != "") {
            document.getElementById("log-out").textContent = "Log Out"
            document.getElementById("splash-link").style.cursor = "default";
            document.getElementById("home-link").style.cursor = "pointer";
            document.getElementById("library-link").style.cursor = "pointer";
            document.getElementById("network-link").style.cursor = "pointer";
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
                    <Link to={'/'}><button id="log-out" type="button" className="log_out_btn btn btn-primary" style={{marginRight: "10px", marginTop: "2px"}} onClick={this.logOut}>Log In</button></Link>
                    <Link to={'/profileScreen'}>
                        <div id="mini-image-container"> 
                            <img src="/assets/logo.jpg" id="mini-pic"></img>
                        </div>
                    </Link>
                </div>
                
            </div>
        )
    }
}

export default NavBar