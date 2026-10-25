import type { ProductType } from "../../product/model/ProductType";
import type { HomePageSection } from "../../../features/section_card/types/section";

type SectionType = {
    title?: string;
    slug?: string;
    imageUrl?: string;
    products: Array<ProductType>;
    children?: Array<HomePageSection>;
};

export type { SectionType };
