interface OrderPlugin {
  _dependecies: OrderPlugin[]
  run(order: Order): Promise<void>
}

class HandlePayment implements OrderPlugin {
  _dependecies: OrderPlugin[]
  constructor() {
    this._dependecies = []
  }

  async run(order: Order): Promise<void> {
    order.status = 'awaiting payment'
    console.log('handling payments')
  }

  set dependecies(plugin: OrderPlugin){
    this._dependecies.push(plugin)
  }

  get dependecies(): OrderPlugin[]{
    return this._dependecies
  }
}

class AllocateResources implements OrderPlugin {
  _dependecies: OrderPlugin[]
  constructor() {
    this._dependecies = []
  }

  async run(order: Order): Promise<void> {
    order.status = 'allocating'
    console.log('Allocating resources')
  }

  set dependecies(plugin: OrderPlugin){
    this._dependecies.push(plugin)
  }

  get dependecies(): OrderPlugin[]{
    return this._dependecies
  }
}

class VerifyAccount implements OrderPlugin {
  _dependecies: OrderPlugin[]
  constructor() {
    this._dependecies = []
  }

  async run(order: Order): Promise<void> {
    order.status = 'Verifying'
    console.log('Verifying accounts')
  }

  set dependecies(plugin: OrderPlugin){
    this._dependecies.push(plugin)
  }

  get dependecies(): OrderPlugin[]{
    return this._dependecies
  }
}

class Order {
  status: string;
  sequencedPlugins: OrderPlugin[];
  plugins: OrderPlugin[];
  constructor() {
    this.sequencedPlugins = []
    this.status = "created"
    this.plugins = []
  }

  sequence(){
    const visited = new Set();
    let sorted:OrderPlugin[] = [];
    function visit(plugin: OrderPlugin){
      if(!visited.has(plugin)){
        visited.add(plugin);
        const deps = plugin._dependecies || [];
        deps.forEach((dep) => visit(dep));
        sorted.push(plugin)
      }
    }
    this.plugins.forEach((plugin) => visit(plugin));
    this.sequencedPlugins = sorted;
  }

  async process() {
    this.sequence()
    for (let plugin in this.sequencedPlugins) {
      await this.sequencedPlugins[plugin].run(this);
    }
  }

  addPlugin(plugin: OrderPlugin){
    this.plugins.push(plugin);
  }

  get pluginss(): OrderPlugin[]{
    return this.plugins
  }
}

let ord = new Order();
let pay = new HandlePayment();
let alloc = new AllocateResources();
let ver = new VerifyAccount();
alloc.dependecies = pay;
alloc.dependecies = ver;
pay.dependecies = ver;

ord.addPlugin(pay)
ord.addPlugin(alloc)
ord.addPlugin(ver)
ord.process()
