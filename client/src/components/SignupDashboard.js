import React from 'react';
import { Link } from 'react-router-dom';

import '../css/components/SignupDashboard';

export default class SignupDashboard extends React.Component {
    render = () => {
        return (
            <main>
                <div className='card mx-3 mt-3'>
                    <div className='card-header'>
                        Signup
                    </div>
                    <div className='card-body'>
                        <form action='/login' method='POST' id='login'>
                            <div className='form-group mb-4'>
                                <div className='row'>
                                    <div className='col-6 pr-1'>
                                        <input type='text' className='form-control mb-3' name='fn' placeholder='First name' />
                                    </div>
                                    <div className='col-6 pl-1'>
                                        <input type='text' className='form-control' name='ln' placeholder='Last name' />
                                    </div>
                                </div>
                                <input type='text' className='form-control mb-3' name='username' placeholder='Email' />
                                <input type='password' className='form-control' name='password' placeholder='Password' />
                            </div>
                            <div className='form-group'>
                                <button className='btn btn-primary form-control mb-2'>Register</button>
                            </div>
                            <hr />
                            <p>Have an <Link to='/login' >account</Link>?</p>
                        </form>
                    </div>
                </div>
            </main>
        )
    }
}