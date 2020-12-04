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
            modalMessage: "",
            field: "",
            modalShow: false,
            alertShow: false,
            alertMessage: ""
        }
    }

    componentDidMount() {
        document.getElementById("app").style.height = "calc(100vh - 90px)";
    }

    updateName = (fieldToUpdate) => {
        axios.post('/auth/updateProfileName', { userId: this.state.userId, newName: fieldToUpdate }).then(res => {
            this.setState({ modalShow: false, modalMessage: "", field: "", alertMessage: `Profile name updated to ${res.data.user.profileName}`, alertShow: true })
        }).catch(err => {
            console.log(err)
        })
    }

    updatePassword = (fieldToUpdate) => {
        axios.post('/auth/updatePassword', { userId: this.state.userId, password: fieldToUpdate }).then(res => {
            this.setState({ modalShow: false, modalMessage: "", field: "", alertMessage: "Password updated!", alertShow: true })
        }).catch(err => {
            console.log(err)
        })
    }

    updateEmail = (fieldToUpdate) => {
        axios.post('/auth/updateEmail', { userId: this.state.userId, email: fieldToUpdate }).then(res => {
            this.setState({ modalShow: false, modalMessage: "", field: "", alertMessage: `Email updated to ${res.data.user.email}`, alertShow: true })
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

    render() {
        return (
            <div>
                <Alert id="alert-box" show={this.state.alertShow} variant="primary" style={{"backgroundColor":"#007bff"}}>
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
                                <img src="/assets/logo.jpg" id="pro_pic"></img>
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