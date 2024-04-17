import EventEmitter from 'events';
import type { OrderLineItem } from './LineItem';
// facilitate completion of the order
export abstract class FullFillmentRequest extends EventEmitter {
  awaitedDependecies: Set<string> = new Set();
  dependecies: Set<string> = new Set();
  completedDependecies: Set<string> = new Set();
  //conditions on which the fr will be loaded 
  condition(items: OrderLineItem[]): boolean{
    return items != undefined;
  }
  //other frs that should be executed before this, if conditions are not met proceed anyway
  addDependecy(dependecy: FullFillmentRequest): void{
    this.dependecies.add(dependecy.constructor.name);
  }
  //return fr names to lookup on the OrderManger plugin lookup table
  getDependecies(): string[]{
    return new Array(...this.dependecies);
  }
  //add awaitedDependecy
  addAwaitedDependecy(fr: string): void{
    this.awaitedDependecies.add(fr);
  }
  // add completed dependency
  addCompletedDependecy(fr: string): void{
    this.completedDependecies.add(fr);
    this.checkDependecies();
  }

  private checkDependecies(): void {
    if(this.awaitedDependecies.size === this.completedDependecies.size){
      this.process()
    }
  }

  process(): void {
    this.emit('complete')
  }
}

