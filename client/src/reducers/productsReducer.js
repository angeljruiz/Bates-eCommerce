const productsDefaultState = [];

export default (state = productsDefaultState, action) => {
    switch(action.type) {
        case 'ADD_PRODUCTS':
            return [...state, ...action.products];
        default:
            return state
    }
}