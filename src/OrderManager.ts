import { Order } from "./Order";
import { FullFillmentRequest } from "./OrderManagerPlugin";
import EventEmitter from "events";

// manage execution of the orders by executing the fullfillment requests
export default class OrderManager extends EventEmitter {
  //store all plugins 
  private plugins: Map<string, typeof FullFillmentRequest>;

  constructor() {
    super()
    this.plugins = new Map();
    this.handleNewOrders();
  }

  addOrder(order: Order) {
    this.emit('new_order', order)
    order.status = 'pending'
  }

  handleNewOrders() {
    this.on('new_order', (order) => {
      this.processOrder(order)
      order.status = 'complete'
    })
  }

  registerPlugin(Plugin: typeof FullFillmentRequest) {
    //ignore the class FullFillmentRequest and ensure only its child classes can be called
    if (Plugin === FullFillmentRequest) {
      return;
    }
    this.plugins.set(Plugin.name, Plugin)
  }
  
  getPlugin(pluginName: string): typeof FullFillmentRequest | undefined {
    return this.plugins.get(pluginName);
  }

  //process Order -> using events when a dependency completes it should notify others that depend on it
  processOrder(order: Order) {
    //Instantiate all frs required for this order
    const orderFrs = Array.from(this.plugins.entries())
      .filter(([_, val]) => val.condition(order))
      .map(([_, val]) => new val());
    //find all frs which have dependecies and register to be notified on complete
    orderFrs.forEach((request) => {
      let dependencies = request.getDependencies(orderFrs);
      let awaitedDependenciesCount = dependencies.length;
      dependencies.forEach((dep: FullFillmentRequest) => {
        //register to be notified once dependency executes
        dep.on('complete', (order: Order) => {
          awaitedDependenciesCount--;
          if (awaitedDependenciesCount === 0) {
            request.process(order)
          }
        })
      })
    })
    //execute frs without dependencies
    orderFrs.forEach((request) => {
      if (request.getDependencies(orderFrs).length === 0) {
        request.process(order)
      }
    })
  }
}

