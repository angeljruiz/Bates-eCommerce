import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Cart from './Cart';
import Sidebar from './Sidebar';

import { logout } from '../actions/accountActions';
import { showCart } from '../actions/cartActions';

import '../css/components/Header.scss';

class Header extends React.Component {
    constructor(props) {
        super(props)

        this.showSidebar = false;
    }

    render() {         
        return (
            <header>
                <nav className='navbar fixed-top'>
                    <ul className='navbar-nav'>
                        { this.showSidebar && <Sidebar account={this.props.account} hide={this.props.showSidebar(false).bind(this)} logout={this.logOut.bind(this)} />}
                        <button onClick={this.props.showSidebar(!this.showSidebar).bind(this)} onMouseDown={ e => e.preventDefault() } className={'navbar-brand main-scheme ' + (this.showSidebar ? 'move-over' : '')}>Be</button>
                        <button 
                            className='nav-link ml-auto mr-3'
                            onClick={ this.props.toggleCart(!this.props.show, this.props.totalItems) }
                            onMouseDown={ e => e.preventDefault() }
                            key='cart'
                            >
                                <FontAwesomeIcon icon='shopping-cart' />
                                { this.props.totalItems > 0 && <span className='ml-2 total-items'>{this.props.totalItems}</span>}
                        </button>
                        { this.props.show && <div className='underlay' onClick={this.props.toggleCart(false).bind(this)}/>}
                        { (this.props.show && this.props.totalItems > 0) && <Cart products={this.props.products} totalItems={this.props.totalItems} hide={this.props.toggleCart(false).bind(this)} /> }
                    </ul>
                </nav>
            </header>
    )}

    logOut(e) {
        this.props.dispatch(logout())
    }
}

const mapStateToProps = ({ cart: { show, totalItems, products }, account: {account}}) => {
    return {
        show,
        account,
        totalItems,
        products
    }
};

const mapDispatchToProps = dispatch => {
    return {
        toggleCart: (show, totalItems) => {
            return function(e) {
                if (totalItems <= 0) return;
                dispatch(showCart(show));
            }
        },

        showSidebar: show => {
            return function(e) {                                
                this.showSidebar = show;
                if (show) dispatch(showCart(false));             
                this.forceUpdate();
            }
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)