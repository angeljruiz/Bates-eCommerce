import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import { logout } from '../actions/accountActions'

import '../css/components/Header.scss'


class Header extends React.Component {
    render() { 
        let logged = this.props.account.logged
        return (
            <header>
                <NavLink className='rounded' to='/'>
                    <img className='micon' alt='Main icon' />
                </NavLink>
                <nav className='navbar bg-light'>
                    <ul className='navbar-nav'>
                        <NavLink 
                            className='nav-link ml-auto mr-3'
                            activeClassName='active' 
                            to='/cart'
                            key='cart'
                            >
                                Cart
                        </NavLink>
                        { logged === 'true' && <a
                            className='nav-link'
                            // activeClassName='active' 
                            onClick={this.logOut.bind(this)}
                            href='/logout'
                            key='logout'
                            >
                                Logout
                        </a>}
                        { logged === 'false' && <NavLink 
                            className='nav-link'
                            activeClassName='active' 
                            to='/login'
                            key='login'
                            >
                                Log in
                        </NavLink>}
                        {/* <li className='nav-item ml-auto'>
                            <NavLink className='nav-link' activeClassName='active' to='/cart'>Cart</NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink className='nav-link' activeClassName='active' to={true ? '/login' : '/logout'}>Sign in</NavLink>
                        </li> */}
                    </ul>
                </nav>
            </header>
    )}

    logOut(e) {
        this.props.dispatch(logout())
    }
}

const mapStateToProps = state => {
    return {
        ...state
    }
};

export default connect(mapStateToProps)(Header)