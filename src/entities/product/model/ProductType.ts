export type ProductVersionType = {
    id: string;
    productId?: string;
    title?: string;
    titleAddon?: string;
    description?: string;
    descriptionAddon?: string;
    slug?: string;
    slugAddon?: string;
    price: number;
    discount?: number | null;
    imageUrl?: string;
    stock?: number;
    orderInPrice?: number;
};

export type ProductType = {
    id: string;
    title: string;
    description?: string;
    price: number;
    discount?: number | null;
    imageUrl: string;
    rating?: number | null;
    slug: string | undefined;
    stock?: number;
    versions?: Array<ProductVersionType>;
};
