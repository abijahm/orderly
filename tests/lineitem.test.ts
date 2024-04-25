import { expect, test, beforeEach, describe } from 'bun:test'
import type { OrderableItem } from '../src/orderable'
import { OrderLineItem } from '../src/LineItem'

describe("LineItem", () => {
  let mockItem: OrderableItem
  let lineItem: OrderLineItem

  beforeEach(() => {
    mockItem = {
      name: 'Honor',
      target: 'devices',
      id: 234,
      price: 23
    }

    lineItem = new OrderLineItem(mockItem, 2)
  })

  test('should initialize properly', () => {
    expect(lineItem.item).toEqual(mockItem)
    expect(lineItem.quantity).toEqual(2)
  })

  test('should set quantity', () => {
    lineItem.quantity = 5;
    expect(lineItem.quantity).toEqual(5)
  })

})

