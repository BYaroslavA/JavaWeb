import BaseDao from "../../config/BaseDao";
import type ProductPageType from "../model/ProductPageType";
import type { ProductType } from "../model/ProductType";

const p1: ProductType = { 
    id: "1", 
    title: "Apple iPhone 17 Pro Max", 
    slug: "apple-iphone-17-pro-max-256gb-orange",
    price: 73499, discount: 6050, rating: 5, 
    imageUrl: "/img/CosmicOrange-1397x1397.png.webp",
    stock: 10,
    versions: [
        {
            id: "v1",
            titleAddon: "256GB (Cosmic Orange)",
            descriptionAddon: "Модель з накопичувачем 256GB у яскравому кольорі Cosmic Orange",
            slugAddon: "256gb-orange",
            price: 73499,
            discount: 6050,
            stock: 10,
            imageUrl: "/img/CosmicOrange-1397x1397.png.webp"
        },
        {
            id: "v2",
            titleAddon: "512GB (Deep Blue)",
            descriptionAddon: "Модель з накопичувачем 512GB у глибокому синьому кольорі Deep Blue",
            slugAddon: "512gb-dark-blue",
            price: 83699,
            discount: 13050,
            stock: 3,
            imageUrl: "/img/deepBlue-(4)-1397x1397.png.webp"
        },
        {
            id: "v3",
            titleAddon: "1TB (Titanium Silver)",
            descriptionAddon: "Максимальна версія з 1TB пам'яті у витонченому сріблястому титані",
            slugAddon: "1tb-titanium-silver",
            price: 94999,
            discount: 0,
            stock: 0,
            imageUrl: "/img/CosmicOrange-1397x1397.png.webp"
        }
    ]
};
const p2: ProductType = { 
    id: "2", title: "Навушники Apple AirPods Pro 3 (MFHP4) (2025)", 
    slug: "navushnyky-apple-airpods-pro-3",
    price: 11899, discount: 2200, rating: 5, 
    imageUrl: "/img/vbfbg-1397x1397.png.webp",
    stock: 3
};
const p3: ProductType = { 
    id: "814897", title: "Apple iPhone 15 256GB (Pink)", 
    slug: "apple-iphone-15-256gb--pink-",
    price: 37999, discount: 2800, rating: 5, 
    imageUrl: "/img/pink (1)-1397x1397.jpeg.webp",
    stock: 0
};
const p4: ProductType = { 
    id: "842447", title: "MacBook Air 13 Retina, Midnight, 256GB, 10 CPU / 8 GPU, 16GB RAM with Apple M4 (2025) (MW123)", 
    slug: "macbook-air-13-retina-midnight-256gb-8-cpu--10-gpu-16gb-ram-with-apple-m4-2025-mw123",
    price: 41999, discount: 8000, rating: 1, 
    imageUrl: "/img/midnight-1-1397x1397.png.webp",
    stock: 10
};
const p5: ProductType = { 
    id: "855417", title: "Apple iPhone 17 Pro Max 512GB (Deep Blue)", 
    slug: "apple-iphone-17-pro-max-512gb-dark-blue",
    price: 83699, discount: 13050, rating: 3, 
    imageUrl: "/img/deepBlue-(4)-1397x1397.png.webp",
    stock: 3
};
const p6: ProductType = { 
    id: "842247", title: "Apple iPad 11 128GB, Wi-Fi (Silver) (2025) (MD3Y4)", 
    slug: "apple-ipad-11-128gb-wi-fi-silver-2025-md3y4",
    price: 17199, discount: 1300, rating: 5, 
    imageUrl: "/img/ipad-2022-hero-silver-wifi-selec-1397x1397.jpg.webp",
    stock: 10
};

export default class ProductDao {
    static getProduct(slugOrId:string): Promise<ProductPageType> {
        return new Promise((resolve, reject) => {
            BaseDao.request("api://product/" + slugOrId)
            .then(r => r.json())
            .then(j => {
                if(j?.meta?.dataType === 'object') {
                    if (j.data?.product) {
                        resolve(j.data);
                    } else if (j.data) {
                        resolve({
                            product: j.data,
                            recommended: []
                        });
                    } else {
                        reject(j);
                    }
                }
                else {
                    ProductDao.getProductMock(slugOrId).then(resolve).catch(reject);
                }
            })
            .catch(() => {
                ProductDao.getProductMock(slugOrId).then(resolve).catch(reject);
            });
        });
    }

    static getProductMock(slugOrId:string): Promise<ProductPageType> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const allProducts = [p1, p2, p3, p4, p5, p6];
                let p = allProducts.find(x => x.slug === slugOrId || x.id === slugOrId);
                // Also check if slugOrId matches any version's slugAddon
                if (!p) {
                    p = allProducts.find(x => x.versions?.some(v => v.slugAddon === slugOrId || v.slug === slugOrId));
                }
                if(!p) {
                    reject("Not Found: " + slugOrId);
                }
                else {
                    resolve({
                        product: p,
                        recommended: allProducts.filter(x => x.id !== p.id)
                    });
                }                
            }, 300);
        });
    }
}
