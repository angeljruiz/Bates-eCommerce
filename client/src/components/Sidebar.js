import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIgloo, faUserLock } from '@fortawesome/free-solid-svg-icons'
import { faPhoneSquareAlt } from '@fortawesome/free-solid-svg-icons';

import '../css/components/Sidebar.scss';
import { NavLink } from 'react-router-dom';

function Sidebar(props) {return(
    <aside className='Sidebar'>
        <hr  />
        <ul className='text-left'>
            { props.account.auth && <NavLink><li onClick={props.hide} 
                className='nav-link'
                to='/admin'
                key='admin'
                >
                    {/* <FontAwesomeIcon icon={faUserLock} size='lg' /> */}
                    <p>Admin</p>
            </li></NavLink> }
            { true && <NavLink
                className='nav-link'
                // onClick={props.logOut}
                to='/storeadmin'
                key='storeadmin'
                ><li onClick={props.hide} >
                    <FontAwesomeIcon icon={faUserLock} size='lg' />
                    <p>Admin</p>
            </li></NavLink> }
            <NavLink className='nav-link' to='/'><li onClick={props.hide} ><FontAwesomeIcon icon={faIgloo} size='lg' /><p>Home</p></li></NavLink>
            { props.account && <a
                className='nav-link'
                onClick={props.logOut}
                href={ process.env.REACT_APP_HOSTNAME + '/logout' }
                key='logout'
                ><li onClick={props.hide} >
                    <FontAwesomeIcon icon='user-circle' size='lg' />
                    <p>Sign out</p>
            </li></a> }
            { !props.account && <NavLink className='nav-link' activeClassName='active' to='/login' key='login'><li onClick={props.hide} >
                <FontAwesomeIcon icon='sign-in-alt' size='lg' />
                <p>Sign in</p>
            </li></NavLink> }
            <NavLink to='/contact' className='nav-link' activeClassName='active' key='contact'><li onClick={props.hide}><FontAwesomeIcon icon={faPhoneSquareAlt} size='lg' /><p>Contact us</p></li></NavLink>
        </ul>
    </aside>
)}

Sidebar.propTypes = {
    account: PropTypes.object,
    hide: PropTypes.func,
    logOut: PropTypes.func
}

export default Sidebar;