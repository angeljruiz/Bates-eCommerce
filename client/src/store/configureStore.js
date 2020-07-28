import { createStore, combineReducers } from "redux";

import productsReducer from "../reducers/productsReducer";
import accountReducer from "../reducers/accountReducer";
import cartReducer from "../reducers/cartReducer";
import sidebarReducer from "../reducers/sidebarReducer";

export default () => {
  return createStore(
    combineReducers({
      products: productsReducer,
      account: accountReducer,
      cart: cartReducer,
      sidebar: sidebarReducer,
    }),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
};
