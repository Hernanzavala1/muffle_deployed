import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'
import { Button, Modal } from 'react-bootstrap'
import Alert from 'react-bootstrap/Alert'
import './css/profile.css'

class profileScreen extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            userId: this.props.userID,
            user: null,
            modalMessage: "",
            field: "",
            modalShow: false,
            alertShow: false,
            alertMessage: ""
        }
    }

    componentDidMount() {
        this.parseURL()
        console.log(this.props.userID)
        document.getElementById("app").style.height = "calc(100vh - 90px)";
        const loggedInUser = sessionStorage.getItem("user");
        if (loggedInUser) {
            const foundUser = JSON.parse(loggedInUser);
            this.setState({userId:foundUser._id, user:foundUser})
            return;
        }
            axios.post('/auth/getUser', { userId: this.props.userID }).then(res => {
                this.setState({ user: res.data.user }, () => { console.log(this.state.user) })
            }).catch(err => {
                console.log(err)
            })

        }
        parseURL = () => {
            var url = window.location.href
    
            if(url.includes("access_token")) {
                var temp = url.split("&")
                var temp2 = temp[0].split("=")
                var accessToken = temp2[1]
                sessionStorage.setItem('accessToken', JSON.stringify(accessToken));
                this.props.updateAccessToken(accessToken)
                return
            }
            sessionStorage.setItem('accessToken', JSON.stringify(""));
            this.props.updateAccessToken("")
        }

        updateName = (fieldToUpdate) => {
            fieldToUpdate = fieldToUpdate.trim()
            if (fieldToUpdate == "") {
                this.setState({ modalShow: false, modalMessage: "", field: "", alertMessage: "You must enter a valid profile name!", alertShow: true })
                return
            }
            axios.post('/auth/updateProfileName', { userId: this.state.userId, newName: fieldToUpdate }).then(res => {
                sessionStorage.setItem('user', JSON.stringify(res.data.user))
                this.props.updateUser(res.data.user)
                this.setState({ modalShow: false, modalMessage: "", field: "", alertMessage: `Profile name updated to ${res.data.user.profileName}.`, alertShow: true })
            }).catch(err => {
                console.log(err)
                this.setState({ modalShow: false, modalMessage: "", field: "", alertMessage: "That profile name is already taken!", alertShow: true })
            })
        }


        
    updatePassword = (fieldToUpdate) => {
        if (fieldToUpdate.trim() == "") {
            this.setState({ modalShow: false, modalMessage: "", field: "", alertMessage: "You must enter a valid password!", alertShow: true })
            return
        }
        axios.post('/auth/updatePassword', { userId: this.state.userId, password: fieldToUpdate }).then(res => {
            sessionStorage.setItem('user', JSON.stringify(res.data.user))
                this.props.updateUser(res.data.user)
            this.setState({ modalShow: false, modalMessage: "", field: "", alertMessage: "Password updated.", alertShow: true })
        }).catch(err => {
            console.log(err)
        })
    }

    updateEmail = (fieldToUpdate) => {
        if (fieldToUpdate == "") {
            this.setState({ modalShow: false, modalMessage: "", field: "", alertMessage: "You must enter a valid email!", alertShow: true })
            return
        }
        if (!this.validateEmail(fieldToUpdate)) {
            this.setState({ modalShow: false, modalMessage: "", field: "", alertMessage: "You must enter a valid email!", alertShow: true })
            return
        }
        axios.post('/auth/updateEmail', { userId: this.state.userId, email: fieldToUpdate }).then(res => {
            sessionStorage.setItem('user', JSON.stringify(res.data.user))
            this.props.updateUser(res.data.user)
            this.setState({ modalShow: false, modalMessage: "", field: "", alertMessage: `Email updated to ${res.data.user.email}.`, alertShow: true })
        }).catch(err => {
            console.log(err)
            this.setState({ modalShow: false, modalMessage: "", field: "", alertMessage: "That email is already taken!", alertShow: true })
        })
    }

        updatePicture = (newPicture) => {
            axios.post('/auth/updatePicture', { userId: this.state.userId, picture: newPicture }).then(res => {
                sessionStorage.setItem('user', JSON.stringify(res.data.user))
                this.props.updateUser(res.data.user)
                this.setState({ modalShow: false, modalMessage: "", field: "", alertMessage: "Profile picture updated!", alertShow: true })
            }).catch(err => {
                console.log(err)
            })
        }

        updateField = (e) => {
            e.preventDefault();

            var fieldToUpdate = document.getElementById("updated_field").value

            if (this.state.field === "name") {
                this.updateName(fieldToUpdate)
            }
            else if (this.state.field === "password") {
                this.updatePassword(fieldToUpdate)
            }
            else if (this.state.field === "email") {
                this.updateEmail(fieldToUpdate)
            }
        }

        handleModal = (e, isOpen, field) => {
            e.preventDefault();

            if (field === "name") {
                this.setState({ modalShow: isOpen, modalMessage: "Enter new profile name:", field: "name" })
            }
            else if (field === "password") {
                this.setState({ modalShow: isOpen, modalMessage: "Enter new password:", field: "password" })
            }
            else if (field === "email") {
                this.setState({ modalShow: isOpen, modalMessage: "Enter new email:", field: "email" })
            }
            else {
                this.setState({ modalShow: isOpen, modalMessage: "", field: "" })
            }
        }

        setShow = (isOpen) => {
            this.setState({ alertShow: false, alertMessage: "" })
        }
        changeImage = (e) => {
            e.preventDefault()

            const preview = document.getElementById('pro_pic');
            const file = document.getElementById('img').files[0];
            const reader = new FileReader();

            if (file) {
                reader.readAsDataURL(file);

                reader.onload = () => {
                    preview.src = reader.result;
                    this.updatePicture(reader.result)
                }
            }
        }

    validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

   

    render() {
        const spotifyURL = "https://accounts.spotify.com/authorize?client_id=4222b93abb6947dea7c3189f9ad0d04c&response_type=token&redirect_uri=http://localhost:3000/profileScreen&scope=user-modify-playback-state%20user-read-playback-state%20streaming%20user-read-email%20user-read-private"
        return (
            <div>
                <Alert id="alert-box" show={this.state.alertShow} variant="primary" style={{ "backgroundColor": "#007bff" }}>
                    <Alert.Heading>{this.state.alertMessage}</Alert.Heading>
                    <hr />
                    <div className="d-flex justify-content-end">
                        <Button id="alert-button" onClick={() => this.setShow(false)} variant="outline-light">
                            Close
                        </Button>
                        </div>
                    </Alert>
                    <div id="container">
                        <div id="profile-container">
                            <div className="row">
                                <div className="header">
                                    <h1 className="library-labels">Profile Page</h1>
                                </div>
                            </div>
                            <div id="profile-options-container">
                                <div id="image-container">
                                    {/* <img src="/assets/logo.jpg" id="pro_pic"></img> */}
                                    {/* {this.state.user && <img id="pro_pic" alt="Girl in a jacket" src={this.state.user.profilePicture} style={{ "border": "5px solid", "width": "220px", "height": "238px" }}></img>} */}
                                    <form onSubmit={this.changeImage}>
                                        <div className="row" style={{ "align-items": "center" }}>
                                            <label for="img" style={{ "color": "#007bff", "font-size": "1.5rem", "padding-right": "20px" }}>Select image:</label>
                                            <input type="file" id="img" name="img" accept="image/*" style={{ "color": "#007bff", "padding-right": "20px" }}></input>
                                        </div>
                                        <div className="row">
                                            <button type="submit">Upload</button>
                                        </div>
                                    </form>
                                </div>
                                <div id="profile-options">
                                    <div> <Link onClick={(e) => { this.handleModal(e, true, "name") }} id="User_actions">Change Profile Name</Link></div>
                                    <div> <Link onClick={(e) => { this.handleModal(e, true, "password") }} id="User_actions">Change Password</Link></div>
                                    <div> <Link onClick={(e) => { this.handleModal(e, true, "email") }} id="User_actions">Change Email</Link></div>
                                    <div> <a href={spotifyURL} id="User_actions">Connect to Spotify</a></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Modal
                        backdrop="static"
                        keyboard="false"
                        show={this.state.modalShow}
                    >
                        <Modal.Header>Update Profile</Modal.Header>
                        <Modal.Body>
                            <h4>{this.state.modalMessage}</h4>
                            <input id="updated_field" type="text" style={{ "width": "100%" }}></input>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button className="secondary" onClick={(e) => { this.updateField(e) }}>Update </Button>
                            <Button className='secondary' onClick={(e) => this.handleModal(e, false, "")} data-dismiss="modal">Close</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            );
        }
    }
    export default profileScreen;