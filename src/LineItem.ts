export class OrderLineItem {
  name: string;
  quantity: number;
  operation: string;
  properties: { [propertyName: string]: string | number }

  constructor(name: string, quantity: number, operation: string) {
    this.name = name;
    this.quantity = quantity;
    this.operation = operation;
    this.properties = {};
  }
}

