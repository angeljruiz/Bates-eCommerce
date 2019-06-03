class Cart {
  constructor() {
    this.items = [];
    this.amount = [];
    this.total = 0;
  }

  static addItem(cart, item, amount) {
    cart.items.push(item);
    cart.amount.push(amount);
  }

  static getTotal(cart) {
    let total = 0;
    for(let i=0;i<cart.items.length;i++) {
      total += cart.items[i].price * 1 * cart.amount[i];
      console.log(total);
    }
    cart.total = total;
  }
}

module.exports = Cart
