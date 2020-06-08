import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import '../css/components/AdminPage.scss';

class AdminPage extends React.Component {
    render() {         
        return (
            <article>
                hi
            </article>
    )}
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminPage)