import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import './css/Login.css'
class Login extends React.Component {

  constructor(props) {
    super(props);
    // axios.defaults.baseURL= "http://localhost:5000"
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
        email: '',
        password: '',
        message: '', 
        token: null
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
    this.setState({
      password: e.target.value
    });
  }
    getAuth = async () => {
    
    const headers = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        "Authorization": "Basic NDIyMmI5M2FiYjY5NDdkZWE3YzMxODlmOWFkMGQwNGM6ZjQ2MWY0NDQ0M2FiNDk5Mzg1MTU3YjM3YzBiOTcyMjM"
      }
    };
    const data = {
      grant_type: 'client_credentials',
    };
  
    try {
     return await axios.post(
        'https://accounts.spotify.com/api/token',
        qs.stringify(data),
        headers
      );
      // console.log(response.data.access_token , "in login axios");
      // return response.data.access_token;
    } catch (error) {
      console.log(error);
    }
  };

  onSubmit(e) {
    e.preventDefault();
    

      const user = {
        email: this.state.email,
        password: this.state.password
      }

      const { email, password } = this.state;

      axios.post('/auth/login', { email, password })
            .then(res => {
              console.log("in login ")
              console.log(res.data)
              this.setState({ message: ''})
              // TODO: ID DOESNT UPDATE
              this.props.updateID(res.data.userId);
               this.props.history.push({
                pathname: '/home',
                state: { userId: res.data.userId}
              })
             })
            .catch(error => {
              console.log(error)
              if(error.response.status === 401) {
                this.setState({ message: 'Login failed. Username or password do not match.'})
              }
            });
  }

  render() {
    // const { email, password, message } = this.state;
    return (
      <div className="container">
        <div id="scroll-container">
          <form id="register_form" onSubmit={this.onSubmit}>
            {this.state.message !== '' &&
            <div className="alert alert-warning alert-dismissible" role="alert">
              { this.state.message }
              </div>
            }
            <div className='row justify-content-center'>
              <h2 className="labels">Please sign in</h2>
            </div>
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
              <input type="password" className="form-control" required value={this.state.password} onChange={this.onChangePassword} placeholder="Password" name="password" />
            </div>
            <div className='row justify-content-center'  style={{paddingTop: "20px"}}>
              <div className="col ">
                <Link>
                  Password reset?
                </Link>
              </div>
              <div className="col">
              <button className="btn btn-lg btn-primary btn-block" type="submit">Login</button>
              </div>
            </div>

            <div className="row justify-content-center">
                  <label className='labels'>Dont have an account?</label>
            </div>
            <div className="row justify-content-center">
          <Link to={'/register'}><button className="btn btn-lg btn-primary btn-block" type="submit">Register an account</button></Link> 
            </div>
          </form>
        </div>
      </div>


    );


  }



}

export default Login;