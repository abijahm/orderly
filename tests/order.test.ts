import { test, describe, expect } from 'bun:test';
import { Order } from '../src/Order';
import { OrderLineItem } from '../src/LineItem';

describe('Order', () => {

  let order = new Order(1);

  let lineItem: OrderLineItem = new OrderLineItem({
    name: 'Honor',
    target: 'devices',
    id: 234,
    price: 499.99
  }, 2)

  test('should initialize properly', () => {
    expect(order.id).toEqual(1)
    expect(order.status).toEqual('created')
  })

  test('should set status', () => {
    order.status = 'pending'
    expect(order.status).toEqual('pending')
  })

  test('should add a line item', () => {
    expect(order.lineItems.length).toEqual(0)
    order.addLineItem(lineItem)
    expect(order.lineItems.length).toEqual(1)
    expect(order.lineItems[0]).toEqual(lineItem)
  })
})
