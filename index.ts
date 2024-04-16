import EventEmitter from 'events';

class Order {
  lineItems: OrderLineItem[];
  constructor() {
    this.lineItems = []
  }

  addLineItem(item: OrderLineItem) {
    this.lineItems.push(item)
  }

}

class OrderLineItem {
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

// facilitate completion of the order
abstract class FullFillmentRequest extends EventEmitter {
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

// manage execution of the orders by executing the fullfillment requests
class OrderManager {
  // plugin fr lookup table
  plugins: { [frName: string] : FullFillmentRequest };
  orders: Order[];

  constructor() {
    this.plugins = {};
    this.orders = [];
  }

  registerPlugin(plugin: FullFillmentRequest) {
    this.plugins[plugin.constructor.name] = plugin;
  }

  //process Order
  processOrder(order: Order) {
    //loop through the plugins to identify ones whose conditions are met
    const orderFrs = Object.keys(this.plugins).filter((frname) => this.plugins[frname].condition(order.lineItems));
    //sequence orders so that dependecies are executed first
    for(let fr in orderFrs){
      let request = this.plugins[fr];
      request.getDependecies().forEach(dep => {
        //if dependecy conditions were met
        if(orderFrs.includes(dep)){
          //add the dependecy to be awaited
          request.addAwaitedDependecy(dep)
          //add listener to notify children that it has completed
          this.plugins[dep].on('complete', () => {
            request.addCompletedDependecy(dep);
          })
        }
      })
    }

    //process frs without dependecies
    orderFrs.forEach((fr) => {
      let request = this.plugins[fr]
      let foundDeps = request.getDependecies().filter(dep => orderFrs.includes(dep));
      if(foundDeps.length === 0){
        request.process()
      }
    })

  }
}

