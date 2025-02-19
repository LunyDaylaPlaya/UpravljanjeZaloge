import { Product } from "./product"
import { Warehouse } from "./warehouse"

export interface InventoryRecord {
    id: number
    productId: number
    warehouseId: number
    quantity: number
    unit: string
    dateAdded: Date
    pricePerPiece: number

    product: Product
    warehouse: Warehouse
}