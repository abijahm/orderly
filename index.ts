//examples
import { Order } from "./src/Order";
import { OrderLineItem } from "./src/LineItem";
import OrderManager from "./src/OrderManager";
import { FullFillmentRequest } from "./src/OrderManagerPlugin";

//create some FullFillmentRequest classes
class ProcessPaymentFr extends FullFillmentRequest {
    constructor() {
        super()
    }

    process(order: Order): void {

        setTimeout(() => {
            console.log('payment recieved');
            this.emit('complete', order);
        }, 2000);
    }
}

class notifyRadiusFr extends FullFillmentRequest {
    constructor() {
        super()
        this.addDependency(ProcessPaymentFr)
    }

    process(order: Order): void {
        console.log('radius notified awaiting response')
        setTimeout(() => {
            console.log('radius response recieved');
            this.emit('complete', order);
        }, 2000);
    }
}

let order = new Order(1);
order.addLineItem(new OrderLineItem({
    id: 1,
    name: 'Product A',
    target: 'phone',
    price: 10.99
}, 2))

order.addLineItem(new OrderLineItem({
    id: 2,
    name: 'Product B',
    target: 'tablet',
    price: 19.99
}, 1))

order.addLineItem(new OrderLineItem({
    id: 3,
    name: 'Product C',
    target: 'laptop',
    price: 29.99
}, 1))


let order2 = new Order(2);

order2.addLineItem(new OrderLineItem({
    id: 4,
    name: 'Product D',
    target: 'desktop',
    price: 39.99
}, 1));

order2.addLineItem(new OrderLineItem({
    id: 5,
    name: 'Product E',
    target: 'phone',
    price: 49.99
}, 3));

let om = new OrderManager();

om.registerPlugin(ProcessPaymentFr);
om.registerPlugin(notifyRadiusFr);

om.addOrder(order);
om.addOrder(order2);