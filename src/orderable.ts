export interface OrderableItem {
  //represents an item that can be ordered 
  id: number
  name: string
  // target can hold table holding the orderable item
  target: string
  price: number
}
