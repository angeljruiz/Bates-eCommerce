import { createStore, combineReducers } from 'redux';

import productsReducer from '../reducers/productsReducer';
import accountReducer from '../reducers/accountReducer';

export default () => {
    return createStore( combineReducers({products: productsReducer, account: accountReducer}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
}