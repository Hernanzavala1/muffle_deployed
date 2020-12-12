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
        console.log(this.props.userID)
        axios.post('/auth/getUser', { userId: this.props.userID }).then(res => {
            this.setState({ user: res.data.user }, () => {console.log(this.state.user)})
        }).catch(err => {
            console.log(err)
        })

        document.getElementById("app").style.height = "calc(100vh - 90px)";
    }

    updateName = (fieldToUpdate) => {
        axios.post('/auth/updateProfileName', { userId: this.state.userId, newName: fieldToUpdate }).then(res => {
            this.setState({ modalShow: false, modalMessage: "", field: "", alertMessage: `Profile name updated to ${res.data.user.profileName}.`, alertShow: true }, () => {
                this.props.updateUser(res.data.user)
            })
        }).catch(err => {
            console.log(err)
            this.setState({ modalShow: false, modalMessage: "", field: "", alertMessage: "That profile name is already taken!", alertShow: true })
        })
    }

    updatePassword = (fieldToUpdate) => {
        axios.post('/auth/updatePassword', { userId: this.state.userId, password: fieldToUpdate }).then(res => {
            this.setState({ modalShow: false, modalMessage: "", field: "", alertMessage: "Password updated.", alertShow: true })
        }).catch(err => {
            console.log(err)
        })
    }

    updateEmail = (fieldToUpdate) => {
        axios.post('/auth/updateEmail', { userId: this.state.userId, email: fieldToUpdate }).then(res => {
            this.setState({ modalShow: false, modalMessage: "", field: "", alertMessage: `Email updated to ${res.data.user.email}.`, alertShow: true })
        }).catch(err => {
            console.log(err)
            this.setState({ modalShow: false, modalMessage: "", field: "", alertMessage: "That email is already taken!", alertShow: true })
        })
    }

    updatePicture = (newPicture) => {
        axios.post('/auth/updatePicture', { userId: this.state.userId, picture: newPicture }).then(res => {
            this.setState({ modalShow: false, modalMessage: "", field: "", alertMessage: "Profile picture updated!", alertShow: true }, () => {
                this.props.updateUser(res.data.user)
            })
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
        this.setState({ alertShow: false, alertMessage: ""})
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

    render() {
        return (
            <div>
                <Alert id="alert-box" show={this.state.alertShow} variant="primary" >
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
                                {this.state.user && <img id="pro_pic" src={this.state.user.profilePicture}style={{"border":"5px solid", "width":"220px", "height":"238px"}}></img>}
                                <form onSubmit={this.changeImage}>
                                    <div className="row" style={{"align-items":"center"}}>
                                        <label for="img" style={{"color":"#007bff", "font-size":"1.5rem", "padding-right":"20px"}}>Select image:</label>
                                        <input type="file" id="img" name="img" accept="image/*" style={{"color":"#007bff", "padding-right":"20px"}}></input>
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
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    data-backdrop="static"
                    data-keyboard="false"
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