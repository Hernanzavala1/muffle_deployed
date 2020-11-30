import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './css/Login.css'
class register extends React.Component{

  constructor(props) {
    super(props);

    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);
    this.onChangeProfileName = this.onChangeProfileName.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
        email: '',
        password: '',
        confirmPassword: '',
        profileName: '',
        message: ''
    }
  }

  componentDidMount() {
    document.getElementById("app").style.height = "100vh";
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  onChangePassword(e) {
    var password = document.getElementById("password"), confirm_password = document.getElementById("confirm_password");
    confirm_password.setCustomValidity('');

    this.setState({
      password: e.target.value
    });

    if(password.value != confirm_password.value) {
      document.getElementById("confirm_password").setCustomValidity("Passwords Don't Match");
    }
  }

  onChangeConfirmPassword(e) {
    var password = document.getElementById("password"), confirm_password = document.getElementById("confirm_password");
    confirm_password.setCustomValidity('');

    this.setState({
      confirmPassword: e.target.value
    });

    if(password.value != confirm_password.value) {
      document.getElementById("confirm_password").setCustomValidity("Passwords Don't Match");
    }
  }

  onChangeProfileName(e) {
    this.setState({
      profileName: e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();

      const user = {
        email: this.state.email,
        password: this.state.password,
        profileName: this.state.profileName
      }

      const { email, password, profileName } = this.state;

      axios.post('/auth/register', { email, password, profileName })
            .then(res => {
              console.log(res.data)
              this.setState({ message: ''})
              this.props.history.push('/home')
            })
            .catch(error => {
              if(error.response.status === 401) {
                this.setState({ message: 'Registration failed.'})
              }
            });
  }

      render() {
        return (
          <div className="container">
            <div id="scroll-container">
              <div> 
                <Link to={'/'}>
                  Back to login
                </Link>
              </div>
              <div className='row justify-content-center'>
                <h2 className="labels">Create Account</h2>
              </div>
              <form id="register_form" onSubmit={this.onSubmit}>
                {this.state.message !== '' &&
                <div className="alert alert-warning alert-dismissible" role="alert">
                  { this.state.message }
                  </div>
                }
                <div className='row justify-content-center'>
                  <label className="labels" >Email address</label>
                </div>
                <div className='row justify-content-center'>
                  <input type="email" className="form-control" required value={this.state.email} onChange={this.onChangeEmail} placeholder="Email address" name="email" />
                </div>
                <div className='row justify-content-center'>
                  <label className="labels">Password</label>
                </div>
                <div className='row justify-content-center'>
                  <label for="inputPassword" className="sr-only">Password</label>
                </div>
                <div className='row justify-content-center'>
                  <input id="password" type="password" className="form-control" required value={this.state.password} onChange={this.onChangePassword} placeholder="Password" name="password" />
                </div>
                <div className='row justify-content-center'>
                  <label className="labels">Confirm password</label>
                </div>
                <div className='row justify-content-center'>
                  <label for="inputPassword" className="sr-only">Confirm password</label>
                </div>
                <div className='row justify-content-center'>
                  <input id="confirm_password" type="password" className="form-control" required value={this.state.confirmPassword} onChange={this.onChangeConfirmPassword} placeholder="Confirm Password" name="password" />
                </div>
                <div className='row justify-content-center'>
                  <label className="labels" >Profile name</label>
                </div>
                <div className='row justify-content-center'>
                  <input type="text" className="form-control" required value={this.state.profileName} onChange={this.onChangeProfileName} placeholder="Profile name" name="profile_name " />
                </div>
                <div className="row justify-content-center">
                  <button id="register_btn" className="btn btn-lg btn-primary btn-block" type="submit">Register</button>
                </div>
              </form>
            </div>
          </div>
    
    
        );
    
    
      }

}
export default register;