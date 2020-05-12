export const showCart = ( (show) => {
    return {
        type: 'SHOW_CART',
        show
    }
});

export const setProductsCart = (product, amount) => {    
    let t = { }
    t[product.sku] = {...product, amount}
    return {
        type: 'ADD_PRODUCTS_CART',
        product: t
    }
}
