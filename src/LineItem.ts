import type { OrderableItem } from "./orderable";

export class OrderLineItem {
  item: OrderableItem;
  _quantity: number;
  // properties will hold additional info
  properties: { [propertyName: string]: string | number }

  constructor(item: OrderableItem, quantity: number) {
    this.item = item;
    this._quantity = quantity;
    this.properties = {};
  }

  get quantity(){
    return this._quantity;
  }

  set quantity(count: number){
    this._quantity = count;
  }
}

