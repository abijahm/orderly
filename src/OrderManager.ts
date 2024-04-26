import { Order } from "./Order";
import type { FullFillmentRequest } from "./OrderManagerPlugin";
import EventEmitter from "events";

// manage execution of the orders by executing the fullfillment requests
export default class OrderManager extends EventEmitter {
  //store all plugins 
  plugins: { [frName: string]: typeof FullFillmentRequest };

  constructor() {
    super()
    this.plugins = {};
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
    this.plugins[Plugin.name] = Plugin
  }

  //process Order -> using events when a dependency completes it should notify others that depend on it
  processOrder(order: Order) {
    //Instantiate all frs required for this order
    const orderFrs = Object.entries(this.plugins)
    .filter((frname) => this.plugins[frname[0]].condition(order))
    .map(([_, val]) => new val());
    //find all frs which have dependecies and register to be notified on complete
    orderFrs.forEach((request) => {
      let dependencies = request.getDependencies(orderFrs);
      let awaitedDependenciesCount = dependencies.length;
      request.getDependencies(orderFrs).forEach(dep => {
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
      if(request.getDependencies(orderFrs).length === 0){
        request.process(order)
      }
    })
  }
}

