import EventEmitter from 'events';
import type { Order } from './Order';
// facilitate completion of the order
export abstract class FullFillmentRequest extends EventEmitter {
  awaitedDependencies: Set<string> = new Set();
  dependencies: Set<string> = new Set();
  completedDependencies: Set<string> = new Set();
  //conditions on which the fr will be loaded 
  condition(order: Order): boolean {
    return order.lineItems != undefined;
  }
  //other frs that should be executed before this, if conditions are not met proceed anyway
  addDependency(dependency: FullFillmentRequest): void {
    this.dependencies.add(dependency.constructor.name);
  }
  //return fr names to lookup on the OrderManger plugin lookup table
  getDependencies(): string[] {
    return new Array(...this.dependencies);
  }
  //add awaitedDependecy
  addAwaitedDependency(fr: string): void {
    this.awaitedDependencies.add(fr);
  }
  // add completed dependency
  addCompletedDependency(fr: string): void {
    this.completedDependencies.add(fr);
  }

  checkAllDependenciesDone(): boolean {
    return (this.awaitedDependencies.size === this.completedDependencies.size);
  }

  //process should receive an order
  process(order: Order): void {
    //fullfill the orders requests
    this.emit('complete')
  }
}

