import type { Order } from "./Order";
import type { FullFillmentRequest } from "./OrderManagerPlugin";

// manage execution of the orders by executing the fullfillment requests
export default class OrderManager {
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

