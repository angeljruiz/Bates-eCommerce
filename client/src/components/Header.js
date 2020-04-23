import React from 'react';
import { NavLink } from 'react-router-dom';

import '../css/components/Header.scss'

const navLinks =[{path: '/cart', text: 'Cart'}, {path: '/login', text: 'Sign In'}];

export default () => (
    <header>
        <NavLink className='rounded' to='/'>
            <img className='micon' alt='Main icon' />
        </NavLink>
        <nav className='navbar bg-light'>
            <ul className='navbar-nav'>
                { navLinks.map( ({ path, text }, index) => (
                    <NavLink 
                        className={'nav-link' + (index !== navLinks.length-1 ? ' ml-auto mr-3' : '')}
                        activeClassName='active' 
                        to={path}
                        key={index}
                        >
                            {text}
                        </NavLink>
                ))}
                {/* <li className='nav-item ml-auto'>
                    <NavLink className='nav-link' activeClassName='active' to='/cart'>Cart</NavLink>
                </li>
                <li className='nav-item'>
                    <NavLink className='nav-link' activeClassName='active' to={true ? '/login' : '/logout'}>Sign in</NavLink>
                </li> */}
            </ul>
        </nav>
    </header>
);
