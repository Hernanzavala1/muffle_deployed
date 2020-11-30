import React from 'react';
import { Link } from 'react-router-dom';
import './css/profile.css'

class profileScreen extends React.Component{
    
    componentDidMount() {
        document.getElementById("app").style.height = "calc(100vh - 90px)";
      }
render(){
    return (
        <div id="container">
            <div id="profile-container">
                <div className="row">
                    <div className="header">
                        <h1 className="library-labels">Profile Page</h1>
                    </div>
                </div>
                <div id="profile-options-container">
                        <div id="image-container"> 
                            <img src="/assets/logo.jpg" id="pro_pic"></img>
                        </div>
                    <div id="profile-options">
                        <div> <Link id ="User_actions">Change Profile Name</Link></div>
                        <div> <Link id ="User_actions">Change Password</Link></div>
                        <div> <Link id ="User_actions">Change Email</Link></div>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}
export default profileScreen;