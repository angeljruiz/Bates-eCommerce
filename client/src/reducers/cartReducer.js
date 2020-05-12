const cartDefaultState = { show: false, products: {}, totalItems: 0 };

export default (state = cartDefaultState, {type, product, show}) => {    
    switch(type) {
        case 'SHOW_CART':
            return { ...state, show};
        case 'ADD_PRODUCTS_CART':
            let item = Object.keys(product)[0]
            if (state.products[item] !== undefined) product[item].amount += state.products[item].amount
            return { ...state, products: {...state.products, ...product}, totalItems: state.totalItems + product[item].amount - ((state.products[item] || {}).amount || 0) };
        default:
            return state
    }
}