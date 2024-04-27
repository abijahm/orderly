import { expect, test, describe, spyOn } from 'bun:test';
import { FullFillmentRequest } from "../src/OrderManagerPlugin";
import type { Order } from '../src/Order';

class testFr extends FullFillmentRequest {
  constructor() {
    super()
    this.addDependency(dependency)
  }
}

class dependency extends FullFillmentRequest {
}

describe("FullFillmentRequest", () => {

  let fr = new testFr()
  const spy = spyOn(fr, "emit")
  test('FullFillmentRequest should complete', () => {
    expect(spy).toHaveBeenCalledTimes(0)
    fr.process({} as Order)
    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('Return dependencies', () => {
    const availableFrs = [new testFr(), new dependency()]
    expect(fr.getDependencies(availableFrs).length).toBe(1)
    const availableFrs2 = [new testFr()]
    expect(fr.getDependencies(availableFrs2).length).toBe(0)
  })
})
