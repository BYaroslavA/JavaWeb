import type { ProductType } from "./ProductType";

export default interface ProductPageType {
    product: ProductType,
    recommended: Array<ProductType>,
}