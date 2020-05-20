import React from 'react';
import PropTypes from 'prop-types';

import Header from '../components/Header.js';
import Footer from '../components/Footer.js';

function Layout (props) {
    return (
        <div style={{paddingBottom: '5rem'}}>
            <Header />
            <main>
                {props.children}
            </main>
            <Footer />
        </div>
    )
}

Layout.propTypes = {
    children: PropTypes.any
}

export default Layout;