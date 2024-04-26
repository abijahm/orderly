import EventEmitter from 'events';
import type { Order } from './Order';
// facilitate completion of the order
export class FullFillmentRequest extends EventEmitter {
  dependencies: Set<string> = new Set();

  constructor(){
    super();
  }
  //conditions on which the fr will be loaded 
  static condition(order: Order): boolean {
    return order.lineItems != undefined;
  }
  //other frs that should be executed before this, if conditions are not met proceed anyway
  addDependency(dependency: typeof FullFillmentRequest): void {
    this.dependencies.add(dependency.name);
  }

  getDependencies(availableFrs: FullFillmentRequest[]): FullFillmentRequest[] {

    const availableNames = availableFrs.map(fr => fr.constructor.name);
    
    return availableFrs.filter(fr => {
      return this.dependencies.has(fr.constructor.name) &&
             availableNames.includes(fr.constructor.name);
    });
  
  }
  
  //process should receive an order
  process(order: Order): void {
    //fullfill the orders requests
    this.emit('complete', order)
  }
}

