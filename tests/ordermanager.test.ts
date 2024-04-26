import { describe, test, expect, spyOn, beforeEach, mock, jest } from 'bun:test'
import { Order } from '../src/Order';
import { FullFillmentRequest } from '../src/OrderManagerPlugin';
import OrderManager from '../src/OrderManager';

class testFr extends FullFillmentRequest {
}
class testFr1 extends FullFillmentRequest {
}
class dependency extends FullFillmentRequest {
}

describe('OrderManger', () => {
  let om: OrderManager
  beforeEach(() => {
    om = new OrderManager()
  })

  test('Plugin Registration', () => {
    om.registerPlugin(testFr)
    expect(om.plugins['testFr']).toBe(testFr)
  })

  test('Execution of plugins without dependencies', () => {
    let spy = spyOn(testFr.prototype, 'process')
    let spy2 = spyOn(testFr1.prototype, 'process')
    let mockCondition = spyOn(testFr1, 'condition')
    mockCondition.mockReturnValue(false)
    om.registerPlugin(testFr)
    om.registerPlugin(testFr1)
    const order = new Order(2)
    om.addOrder(order)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy2).not.toHaveBeenCalled()
  })

  test.only('Execution of plugins with dependencies', () => {
    class tetsFrDep extends FullFillmentRequest {
      constructor(){
        super()
        this.addDependency(dependency)
      }
    }

    let spy = spyOn(tetsFrDep.prototype, 'process')
    let spy2 = spyOn(dependency.prototype, 'process')
    let eventSpy = spyOn(dependency.prototype, 'on')
    om.registerPlugin(dependency)
    om.registerPlugin(tetsFrDep)
    const order = new Order(2)
    om.addOrder(order)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(eventSpy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
  })

})

