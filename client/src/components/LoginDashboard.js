import React from 'react';
import { Link } from 'react-router-dom';

import '../css/components/LoginDashboard.scss'

export default class LoginDashboard extends React.Component {
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
                                <a className='btn btn-primary form-control googleLogin mb-2' href={ process.env.REACT_APP_HOSTNAME + '/auth/google' }>Google</a>
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