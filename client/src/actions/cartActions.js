export const showCart = (show) => {
  return {
    type: "SHOW_CART",
    show,
  };
};

export const addProductCart = (product) => {
  let t = {};
  t[product.sku] = { ...product, amount: product.amount || 1 };
  return {
    type: "ADD_PRODUCT_CART",
    product: t,
  };
};

export const removeProductCart = (product) => {
  return {
    type: "REMOVE_PRODUCT",
    product,
  };
};

export const incrementProductCart = (product) => {
  let t = { ...product };
  t.amount = 1;
  return addProductCart(t);
};

export const decrementProductCart = (product) => {
  let t = { ...product };
  if (t.amount === 1) {
    return removeProductCart(t);
  } else {
    return addProductCart({ ...t, amount: -1 });
  }
};
