import type { ProductType } from "../../product/model/ProductType";
import type { SectionType } from "../../section/model/SectionType";

export default interface ISearchResult {
    products: Array<ProductType>,
    sections: Array<SectionType>,
}
