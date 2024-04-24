import { expect, test, describe, spyOn } from 'bun:test';
import { FullFillmentRequest } from "../src/OrderManagerPlugin";
import type { Order } from '../src/Order';

describe("FullFillmentRequest", ()=>{
  class testFr extends FullFillmentRequest {
    constructor(){
      super()
    }
    completeCalled(){
    }
  }

  let fr = new testFr()
  const spy = spyOn(fr, "completeCalled")
  fr.on('complete', fr.completeCalled)
  test('FullFillmentRequest should complete', () => {
    expect(spy).toHaveBeenCalledTimes(0)
    fr.process({} as Order)
    expect(spy).toHaveBeenCalledTimes(1)
  })
})
