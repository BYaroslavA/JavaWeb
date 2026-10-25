import type { HomePageSection } from "../../../features/section_card/types/section";
import type { SectionType } from "../model/SectionType";

export default class SectionDao {
    static cacheSections: Array<HomePageSection> | undefined;

    static getSections() {
        return new Promise<Array<HomePageSection>>((resolve) => {
            fetch("http://localhost:8080/java231web/section")
                .then(r => {
                    if (r.ok) return r.json();
                    throw new Error("HTTP " + r.status);
                })
                .then(j => {
                    const data = Array.isArray(j) ? j : (j && Array.isArray(j.data) ? j.data : null);
                    if (data && data.length > 0) {
                        resolve(data);
                    } else {
                        SectionDao.getSectionsMock().then(resolve);
                    }
                })
                .catch(() => {
                    fetch("https://localhost:7015/api/sections")
                        .then(r => r.json())
                        .then(j => {
                            const data = Array.isArray(j) ? j : (j && Array.isArray(j.data) ? j.data : null);
                            if (data && data.length > 0) {
                                resolve(data);
                            } else {
                                SectionDao.getSectionsMock().then(resolve);
                            }
                        })
                        .catch(() => {
                            SectionDao.getSectionsMock().then(resolve);
                        });
                });
        });
    }

    static getSectionsMock() {
        return new Promise<Array<HomePageSection>>((resolve) => {
            if (typeof SectionDao.cacheSections !== 'undefined') {
                resolve(SectionDao.cacheSections);
            } else {
                setTimeout(() => {
                    SectionDao.cacheSections = [
                        {
                            imageUrl: "/img/Frame-8full.png.webp",
                            title: "Смартфони",
                            slug: "android"
                        },
                        {
                            imageUrl: "/img/wide-garminfull.png.webp",
                            title: "Garminfull",
                            slug: "garminfull"
                        },
                        {
                            imageUrl: "/img/image24full.png.webp",
                            title: "Телевізори",
                            slug: "tv"
                        },
                        {
                            imageUrl: "/img/big-ps5full.png.webp",
                            title: "Консолі",
                            slug: "consoles",
                            children: [
                                {
                                    imageUrl: "/img/big-ps5full.png.webp",
                                    title: "Ігрові консолі",
                                    slug: "consoles"
                                },
                                {
                                    imageUrl: "/img/gaming-micefull.png.webp",
                                    title: "Клавіатури",
                                    slug: "gaming-kb"
                                },
                                {
                                    imageUrl: "/img/gaming-acsfull.png.webp",
                                    title: "Джойстики",
                                    slug: "gaming-joystick"
                                },
                                {
                                    imageUrl: "/img/headphonesfull.png.webp",
                                    title: "Навушники",
                                    slug: "headphones"
                                }
                            ]
                        },
                        {
                            imageUrl: "/img/wide-applefull.png.webp",
                            title: "Apple",
                            slug: "apple"
                        },
                        {
                            imageUrl: "/img/wide-dysonfull.png.webp",
                            title: "Dyson",
                            slug: "dyson"
                        },
                        {
                            imageUrl: "/img/wide-noutfull.png.webp",
                            title: "Ноутбуки",
                            slug: "notebooks"
                        },
                        {
                            imageUrl: "/img/wide-photoofull.png.webp",
                            title: "Фото",
                            slug: "photo"
                        }
                    ];
                    resolve(SectionDao.cacheSections);
                }, 50);
            }
        });
    }

    static getSection(slug: string) {
        return new Promise<SectionType>((resolve, reject) => {
            fetch("http://localhost:8080/java231web/section/" + slug)
                .then(r => {
                    if (r.ok) return r.json();
                    throw new Error("HTTP " + r.status);
                })
                .then(j => {
                    const section = j && j.data ? j.data : j;
                    if (section && (section.products || section.children)) {
                        resolve(section);
                    } else {
                        SectionDao.getSectionMock(slug).then(resolve).catch(reject);
                    }
                })
                .catch(() => {
                    fetch("https://localhost:7015/api/sections/" + slug)
                        .then(r => r.json())
                        .then(j => {
                            const section = j && j.data ? j.data : j;
                            if (section && section.products) {
                                resolve(section);
                            } else {
                                SectionDao.getSectionMock(slug).then(resolve).catch(reject);
                            }
                        })
                        .catch(() => {
                            SectionDao.getSectionMock(slug).then(resolve).catch(reject);
                        });
                });
        });
    }

    static getSectionMock(slug: string) {
        return new Promise<SectionType>((resolve) => {
            setTimeout(() => {
                switch (slug) {
                    case 'consoles':
                        resolve({
                            title: "Консолі",
                            slug: "consoles",
                            children: [
                                {
                                    imageUrl: "/img/gaming-acsfull.png.webp",
                                    title: "Джойстики",
                                    slug: "gaming-joystick"
                                },
                                {
                                    imageUrl: "/img/gaming-micefull.png.webp",
                                    title: "Клавіатури",
                                    slug: "gaming-kb"
                                },
                                {
                                    imageUrl: "/img/headphonesfull.png.webp",
                                    title: "Навушники",
                                    slug: "headphones"
                                }
                            ],
                            products: [
                                {
                                    id: "ps5-pro",
                                    title: "Ігрова приставка Sony PlayStation 5 Pro 2TB",
                                    slug: "sony-playstation-5-pro-2tb",
                                    price: 34999,
                                    rating: 5,
                                    discount: null,
                                    imageUrl: "/img/big-ps5full.png.webp"
                                },
                                {
                                    id: "switch-2",
                                    title: "Ігрова консоль Nintendo Switch 2",
                                    slug: "nintendo-switch-2",
                                    price: 18999,
                                    rating: 4,
                                    discount: null,
                                    imageUrl: "/img/vbfbg-1397x1397.png.webp"
                                },
                                {
                                    id: "steam-deck",
                                    title: "Ігрова консоль Valve Steam Deck OLED 512GB",
                                    slug: "valve-steam-deck-oled-512gb",
                                    price: 27999,
                                    rating: 5,
                                    discount: 1000,
                                    imageUrl: "/img/Frame-8full.png.webp"
                                }
                            ]
                        });
                        break;
                    case 'gaming-joystick':
                    case 'joysticks':
                        resolve({
                            title: "Джойстики",
                            slug: "gaming-joystick",
                            products: [
                                {
                                    id: "joy-white",
                                    title: "Геймпад бездротовий білий",
                                    slug: "joystick-white",
                                    price: 2499,
                                    rating: 4,
                                    discount: null,
                                    imageUrl: "/img/gaming-acsfull.png.webp"
                                },
                                {
                                    id: "joy-dualsense",
                                    title: "Геймпад DualSense Red",
                                    slug: "joystick-dualsense-red",
                                    price: 2999,
                                    rating: 5,
                                    discount: 200,
                                    imageUrl: "/img/gaming-acsfull.png.webp"
                                },
                                {
                                    id: "joy-pink",
                                    title: "Геймпад Pink Edition",
                                    slug: "gamepad-pink",
                                    price: 2799,
                                    rating: 4,
                                    discount: null,
                                    imageUrl: "/img/pink (1)-1397x1397.jpeg.webp"
                                }
                            ]
                        });
                        break;
                    case 'gaming-kb':
                    case 'keyboards':
                        resolve({
                            title: "Клавіатури",
                            slug: "gaming-kb",
                            products: [
                                {
                                    id: "kb-1",
                                    title: "Клавіатура механічна ігрова RGB",
                                    slug: "kb-gaming-rgb",
                                    price: 3199,
                                    rating: 5,
                                    discount: null,
                                    imageUrl: "/img/gaming-micefull.png.webp"
                                }
                            ]
                        });
                        break;
                    case 'apple':
                        resolve({
                            title: "Apple",
                            slug: "apple",
                            products: [
                                {
                                    id: "1",
                                    title: "Apple iPhone 17 Pro Max 256GB (Cosmic Orange)",
                                    slug: "apple-iphone-17-pro-max-256gb-orange",
                                    price: 73499,
                                    discount: 6050,
                                    rating: 5,
                                    imageUrl: "/img/CosmicOrange-1397x1397.png.webp"
                                },
                                {
                                    id: "2",
                                    title: "Apple AirPods Pro 3 (MFHP4) (2025)",
                                    slug: "navushnyky-apple-airpods-pro-3",
                                    price: 11899,
                                    discount: 2200,
                                    rating: 5,
                                    imageUrl: "/img/big-center-airpods-2025full.png.webp"
                                }
                            ]
                        });
                        break;
                    default:
                        resolve({
                            title: slug,
                            slug: slug,
                            products: [
                                {
                                    id: "1",
                                    title: "Товар розділу " + slug,
                                    slug: slug + "-item-1",
                                    price: 1999,
                                    discount: 200,
                                    rating: 5,
                                    imageUrl: "/img/gaming-micefull.png.webp"
                                }
                            ]
                        });
                }
            }, 50);
        });
    }
}
