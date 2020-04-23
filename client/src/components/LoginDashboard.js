import React from 'react';
import { Link, Redirect } from 'react-router-dom';

import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';

import '../css/components/LoginDashboard.scss'

const responseGoogle = (response) => {
    console.log(response);
};

const responseFacebook = (response) => {
    console.log(response);
  }

export default class LoginDashboard extends React.Component {
    googleLogin = () => {
        window.location = '/auth/google';
    }
    handleSubmit = (e) => {
        e.preventDefault();
    }
    render = () => {
        return (
            <main>
                <div className='card mx-3 mt-3'>
                    <div className='card-header'>
                        Login
                    </div>
                    <div className='card-body'>
                        <form action='/login' method='POST' id='login' onSubmit={this.handleSubmit}>
                            <div className='form-group mb-4'>
                                <input type='text' className='form-control mb-3' name='username' placeholder='Email' />
                                <input type='password' className='form-control' name='password' placeholder='Password' />
                            </div>
                            <div className='form-group'>
                                <button className='btn btn-primary form-control mb-2'>Login</button>
                                <FacebookLogin
                                    cssClass='facebookLogin'
                                    appId="797038567358898"
                                    fields="name,email,picture"
                                    callback={responseFacebook} 
                                />                                
                                <GoogleLogin
                                    cssClass='facebookLogin'
                                    clientId='1071517499996-c009vtm561n2bhvlhqg9s4drgdctt6d4.apps.googleusercontent.com'
                                    buttonText="Login"
                                    onSuccess={responseGoogle}
                                    onFailure={responseGoogle}
                                    cookiePolicy={'single_host_origin'}
                                />
                            </div>
                            <hr />
                            <p>Need to <Link to='/register' >register</Link>?</p>
                        </form>
                    </div>
                </div>
            </main>
        )
    }
}