import React from 'react';
import { Link } from 'react-router-dom';
import './css/Login.css'
//import axios from 'axios';
class Splash extends React.Component {

    constructor() {
        super();

    }

    componentDidMount() {
        document.getElementById("app").style.height = "100vh";
    }

    render() {
        // const { email, password, message } = this.state;
        return (
            <div id="container" style={{ height: "calc(100vh - 80px" }}>
                <div id="scroll-container">
                    <div>
                        <div style={{ display: "flex", justifyContent: "center", paddingTop: "200px", flexDirection: "column" }}>
                            <strong style={{ color: "#1d7add", fontSize: "8em", textAlign: "center" }}>Connecting through music</strong>
                            <div style={{ color: "#1d7add", fontSize: "2em", textAlign: "center", marginTop: "50px" }}>
                                Sign up now for free
                            </div>
                            <div className="row justify-content-center" style={{marginTop: "25px"}}>
                                <Link to={'/register'} style={{textDecoration: 'none'}}><button className="btn btn-lg btn-primary btn-block" type="submit">Register an account</button></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Splash;