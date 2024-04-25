import { describe, test, expect, spyOn, beforeEach } from 'bun:test'
import { OrderLineItem } from '../src/LineItem';
import { Order } from '../src/Order';
import type { OrderableItem } from '../src/orderable';
import { FullFillmentRequest } from '../src/OrderManagerPlugin';
import OrderManager from '../src/OrderManager';

//create OrderableItem
class SmartPhone implements OrderableItem {
  name: string
  launchDate: Date
  operatingSystem: string
  price: number
  target: string = 'smartphone';
  id: number;
  constructor(id: number, name: string, launchDate: Date, operatingSystem: string, price: number) {
    this.name = name;
    this.launchDate = launchDate;
    this.operatingSystem = operatingSystem;
    this.price = price;
    this.id = id;
  }
}

//create a FullFillmentRequest 
class PaymentFr extends FullFillmentRequest {
  constructor() {
    super()
  }
  condition(order: Order): boolean {
    return order.price > 0;
  }
  process(order: Order): void {
    this.emit('complete', order)
  }
}

class NotifyWarrantyFr extends FullFillmentRequest {
  constructor() {
    super()
    this.addDependency(PaymentFr)
  }

  condition(order: Order): boolean {
    return order.lineItems.find((lineItem) => lineItem.item.name == 'Iphone' || lineItem.item.name == 'xiaomi') !== undefined;
  }

  process(order: Order): void {
    let withWarranty = order.lineItems.filter((lineItem) => lineItem.item.name == 'Iphone' || lineItem.item.name == 'xiaomi');
    withWarranty.forEach(lineItem => {
      //handle sending warranties 
    })
    this.emit('complete', order)
  }
}

describe("OrderManager", () => {
  let order = new Order(0)
  order.addLineItem(
    new OrderLineItem(
      new SmartPhone(1, 'Honor', new Date(), 'Android', 700),
      2
    )
  )

  order.addLineItem(
    new OrderLineItem(
      new SmartPhone(2, 'xiaomi', new Date(), 'Android', 1200),
      1
    )
  )

  order.addLineItem(
    new OrderLineItem(
      new SmartPhone(3, 'Iphone', new Date(), 'ios', 999),
      4
    )
  )

  let order2 = new Order(1);

  order2.addLineItem(
    new OrderLineItem(
      new SmartPhone(1, 'Honor', new Date(), 'Android', 700),
      2
    )
  )

  let om: OrderManager
  beforeEach(() => {
    om = new OrderManager()
    om.registerPlugin(PaymentFr)
    om.registerPlugin(NotifyWarrantyFr)
  })

  test('processOrder should be called', () => {
    let spy = spyOn(om, 'processOrder')
    expect(spy).toHaveBeenCalledTimes(0)
    om.addOrder(order)
    expect(spy).toHaveBeenCalledTimes(1)
    om.addOrder(order2)
    expect(spy).toHaveBeenCalledTimes(2)
  })

  test('Fr process should be called correct amount of times', () => {
    let frSpy = spyOn(om.plugins['NotifyWarrantyFr'], 'process')
    expect(frSpy).toHaveBeenCalledTimes(0)
    om.addOrder(order)
    expect(frSpy).toHaveBeenCalledTimes(1)
    om.addOrder(order)
    expect(frSpy).toHaveBeenCalledTimes(1)
  })
})
