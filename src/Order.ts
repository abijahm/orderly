import type { OrderLineItem } from "./LineItem";

export class Order {
  id: number;
  lineItems: OrderLineItem[];
  _status: string;

  constructor(id: number) {
    this.lineItems = []
    this.id = id;
    this._status = 'created';
  }

  addLineItem(item: OrderLineItem) {
    this.lineItems.push(item)
  }

  set status(status: string){
    this._status = status;
  }

  get status(): string {
    return this._status;
  }

}

