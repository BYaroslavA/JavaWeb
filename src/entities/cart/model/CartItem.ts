import type { ProductType } from "../../product/model/ProductType";

export default interface CartItem {
    product: ProductType,
    quantity: number,
    price: number
}