import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Cart from './Cart';

import { logout } from '../actions/accountActions';
import { showCart } from '../actions/cartActions';

import '../css/components/Header.scss';

class Header extends React.Component {
    render() {         
        let loggedIn = this.props.loggedIn        
        return (
            <header>
                <nav className='navbar fixed-top'>
                    <ul className='navbar-nav'>
                        <NavLink to='/' className='navbar-brand'>Be</NavLink>
                        <button 
                            className='nav-link ml-auto mr-3'
                            onClick={ this.props.toggleCart(!this.props.show) }
                            onMouseDown={ e => e.preventDefault() }
                            key='cart'
                            >
                                <FontAwesomeIcon icon='shopping-cart' />
                                 { (this.props.show && this.props.totalItems > 0) && <Cart /> }
                                 { this.props.totalItems > 0 && <span className='ml-2 total-items'>{this.props.totalItems}</span>}
                        </button>
                        { loggedIn && <a
                            className='nav-link'
                            onClick={this.logOut.bind(this)}
                            href={ process.env.REACT_APP_HOSTNAME + '/logout' }
                            key='logout'
                            >
                                <FontAwesomeIcon icon='user-circle' />
                        </a> }
                        { !loggedIn && <NavLink 
                            className='nav-link'
                            activeClassName='active' 
                            to='/login'
                            key='login'
                            >
                                <FontAwesomeIcon icon='sign-in-alt' />
                        </NavLink> }
                    </ul>
                </nav>
            </header>
    )}

    logOut(e) {
        this.props.dispatch(logout())
    }
}

const mapStateToProps = ({ cart: { show, totalItems }, account: {loggedIn}}) => {
    return {
        show,
        loggedIn,
        totalItems
    }
};

const mapDispatchToProps = dispatch => {
    return {
        toggleCart: (show) => {
            return function(e) {
                dispatch(showCart(show));
            }
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)