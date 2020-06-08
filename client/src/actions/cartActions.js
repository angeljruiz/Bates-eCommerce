export const showCart = ( (show) => {
    return {
        type: 'SHOW_CART',
        show
    }
});

export const addProductCart = (product, amount) => {    
    let t = { }
    t[product.sku] = {...product, amount}
    return {
        type: 'ADD_PRODUCT_CART',
        product: t
    }
}

export const removeProduct = (product) => {
    return { 
        type: 'REMOVE_PRODUCT',
        product
    }
}
