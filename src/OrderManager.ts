import { Order } from "./Order";
import type { FullFillmentRequest } from "./OrderManagerPlugin";
import EventEmitter from "events";

// manage execution of the orders by executing the fullfillment requests
export default class OrderManager extends EventEmitter {
  // plugin fr lookup table
  plugins: { [frName: string]: FullFillmentRequest };
  orders: { [idx: number]: Order };

  constructor() {
    super()
    this.plugins = {};
    this.orders = {};
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

  registerPlugin<T extends FullFillmentRequest>(Plugin: new () => T) {
    this.plugins[Plugin.name] = new Plugin()
  }

  //process Order -> should be async to allow multiple orders to be processed at the same time
  processOrder(order: Order) {
    order.status = 'processing'
    //loop through the plugins to identify ones whose conditions are met
    const orderFrs = Object.keys(this.plugins).filter((frname) => this.plugins[frname].condition(order));
    //sequence orders so that dependecies are executed first
    orderFrs.forEach(fr => {
      let request = this.plugins[fr];
      request.getDependencies().forEach(dep => {
        //if dependecy conditions were met
        if (orderFrs.includes(dep)) {
          //add the dependecy to be awaited
          request.addAwaitedDependency(dep)
          //add listener to notify children that it has completed
          this.plugins[dep].on('complete', (ord) => {
            request.addCompletedDependency(dep);
            //if all request's dependecies have completed process it
            if (request.checkAllDependenciesDone()) {
              request.process(ord);
            }
          })
        }
      })
    })

    //process frs without dependecies
    orderFrs.forEach((fr) => {
      let request = this.plugins[fr]
      let foundDeps = request.getDependencies().filter(dep => orderFrs.includes(dep));
      if (foundDeps.length === 0) {
        request.process(order)
      }
    })

  }
}

