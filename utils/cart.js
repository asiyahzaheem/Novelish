class Cart {
  constructor(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
  }
  add(item, id) {
    let storedItem = this.items[id];
    if (!storedItem) {
      storedItem = { item, qty: 0, price: 0 };
      this.items[id] = storedItem;
    }
    storedItem.qty++;
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQty++;
    this.totalPrice += storedItem.item.price;
  }
  remove(id) {
    let storedItem = this.items[id];
    if (storedItem.qty === 1) {
      delete this.items[id];
    }
    storedItem.qty--;
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQty--;
    this.totalPrice -= storedItem.item.price;
  }
  removeItem(id) {
    let storedItem = this.items[id];
    this.totalQty -= storedItem.qty;
    this.totalPrice -= storedItem.price;
    delete this.items[id];
  }
  generateArray() {
    const arr = [];
    const ids = Object.keys(this.items);
    ids.forEach((id) => {
      arr.push(this.items[id]);
    });
    return arr;
  }
}

module.exports = Cart;
