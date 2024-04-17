import type { OrderLineItem } from "./LineItem";

export class Order {
  lineItems: OrderLineItem[];
  constructor() {
    this.lineItems = []
  }

  addLineItem(item: OrderLineItem) {
    this.lineItems.push(item)
  }

}

