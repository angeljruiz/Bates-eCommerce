import React from 'react';

import Header from '../components/Header.js';
import Footer from '../components/Footer.js';

export default function Layout (props) {
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