import React from 'react';
import { Link } from 'react-router-dom';

import GoogleLogin from 'react-google-login';
// import FacebookLogin from 'react-facebook-login';

import '../css/components/LoginDashboard.scss'

// const facebookLogin = (response) => {
//     console.log(response);
//     fetch('/auth/facebook/redirect').then( data => console.log(data));
//   }

export default class LoginDashboard extends React.Component {
    googleLogin = (e) => {
        console.log(JSON.stringify(e.accessToken));
        localStorage.setItem('accessToken', e.accessToken)
        fetch('/auth/google/redirect', { headers: authHeaders()}).then(d => console.log(d.body));
    }
    handleSubmit = (e) => {
        e.preventDefault();
    }
    handleLogin = () => {
        
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
                                <a className='btn btn-primary form-control googleLogin mb-2' href='/auth/google'>Google</a>
                                {/* <FacebookLogin
                                    cssClass='facebookLogin'
                                    appId="797038567358898"
                                    fields="name,email,picture"
                                    callback={facebookLogin} 
                                />                                 */}
                                <GoogleLogin
                                    clientId='1071517499996-t319p34m8es21hn9mrj2bmnrg8ck8j77.apps.googleusercontent.com'
                                    buttonText="Login"
                                    onSuccess={this.googleLogin}
                                    onFailure={this.googleLogin}
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

function authHeaders() {
    console.log(localStorage.getItem('accessToken'))
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
}