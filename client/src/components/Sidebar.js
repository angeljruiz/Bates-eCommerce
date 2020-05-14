import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIgloo } from '@fortawesome/free-solid-svg-icons'
import { faPhoneSquareAlt } from '@fortawesome/free-solid-svg-icons';

import '../css/components/Sidebar.scss';
import { NavLink } from 'react-router-dom';

export default (props) => {return(
    <aside className='sidebar'>
        <hr  />
        <ul className='text-left'>
            <li onClick={props.hide} ><NavLink className='nav-link' to='/'><FontAwesomeIcon icon={faIgloo} size='lg' /><p>Home</p></NavLink></li>
            { props.loggedIn && <li onClick={props.hide} ><a
                className='nav-link'
                onClick={this.logOut.bind(this)}
                href={ process.env.REACT_APP_HOSTNAME + '/logout' }
                key='logout'
                >
                    <FontAwesomeIcon icon='user-circle' />
                    <p>Sign out</p>
            </a></li> }
            { !props.loggedIn && <li onClick={props.hide} ><NavLink 
                className='nav-link'
                activeClassName='active' 
                to='/login'
                key='login'
                >
                    <FontAwesomeIcon icon='sign-in-alt' size='lg' />
                    <p>Sign in</p>
            </NavLink></li> }
            <li onClick={props.hide}><NavLink to='/contact' className='nav-link' activeClassName='active' key='contact'><FontAwesomeIcon icon={faPhoneSquareAlt} size='lg' /><p>Contact us</p></NavLink> </li>
        </ul>
    </aside>
)}