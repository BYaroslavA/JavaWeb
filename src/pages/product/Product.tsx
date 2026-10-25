import { useParams } from "react-router-dom";
import "./ui/Product.css";
import { useContext, useEffect, useState, useRef, type MouseEventHandler } from "react";
import ProductDao from "../../entities/product/api/ProductDao";
import { AppContext } from "../../features/app_context/AppContext";
import type ProductPageType from "../../entities/product/model/ProductPageType";
import type { ProductVersionType } from "../../entities/product/model/ProductType";
import ProductCard from "../../entities/product/ui/ProductCard";

export default function Product() {
    const { setBusy, isBusy } = useContext(AppContext);
    const { slug } = useParams<string>();
    const [pageData, setPageData] = useState<ProductPageType | null>(null);
    const [selectedVersion, setSelectedVersion] = useState<ProductVersionType | null>(null);

    useEffect(() => {
        if (slug) {
            setBusy(true);
            ProductDao
                .getProduct(slug)
                .then((data) => {
                    setPageData(data);
                    if (data?.product?.versions && data.product.versions.length > 0) {
                        const matched = data.product.versions.find(
                            (v) => v.slugAddon === slug || v.slug === slug
                        );
                        setSelectedVersion(matched || data.product.versions[0]);
                    } else {
                        setSelectedVersion(null);
                    }
                })
                .catch((err) => {
                    setPageData(null);
                    setSelectedVersion(null);
                    console.error(err);
                })
                .finally(() => setBusy(false));
        }
    }, [slug]);

    if (pageData === undefined) return <h1>Loading...</h1>;
    if (isBusy) return <></>;
    if (pageData === null) return <h1>Not Found</h1>;

    const { product } = pageData;
    const versions = product.versions;
    const hasMultipleVersions = Boolean(versions && versions.length > 1);

    const activeVersion = selectedVersion || (versions && versions.length > 0 ? versions[0] : null);

    return (
        <div className="product-page-container">
            {hasMultipleVersions && activeVersion ? (
                /* Д.З. Якщо у товару є декілька версій:
                   - спільну для всіх назву один раз заголовком сторінки
                   - різні версії відображати тільки з додатками (Addon) */
                <div className="product-multiple-versions-layout">
                    {/* Спільна назва для всіх один раз як заголовок сторінки */}
                    <div className="product-common-header">
                        <h1 className="product-common-title">{product.title}</h1>
                        <span className="product-versions-count-badge">
                            {versions!.length} версії в наявності
                        </span>
                    </div>

                    <div className="row product-main-row">
                        <div className="col col-5 product-image-col">
                            <img
                                className="w-100 product-hero-img"
                                src={activeVersion.imageUrl || product.imageUrl}
                                alt={activeVersion.titleAddon || activeVersion.title || product.title}
                            />
                        </div>
                        <div className="col col-7 product-info">
                            {/* Відображення активної версії ТІЛЬКИ з додатком (Addon) */}
                            <div className="version-active-badge">Версія товару:</div>
                            <h2 className="product-version-addon-title">
                                {activeVersion.titleAddon || activeVersion.title}
                            </h2>

                            {activeVersion.descriptionAddon && (
                                <p className="product-version-desc">
                                    {activeVersion.descriptionAddon}
                                </p>
                            )}

                            <div>
                                <div className="product-rating">★★★★★ ({product.rating ?? 5})</div>
                                {activeVersion.stock === 0 ? (
                                    <div className="product-unavailable">Передзамовлення</div>
                                ) : activeVersion.stock && activeVersion.stock > 0 && activeVersion.stock < 5 ? (
                                    <div className="product-low-stock">
                                        Залишилось мало ({activeVersion.stock} шт.)
                                    </div>
                                ) : (
                                    <div className="product-available">У наявності</div>
                                )}
                            </div>

                            <div className="product-prices-block">
                                {(activeVersion.discount ?? product.discount ?? 0) > 0 && (
                                    <div className="product-old-price">
                                        {activeVersion.price + (activeVersion.discount ?? product.discount ?? 0)} ₴
                                    </div>
                                )}
                                <div className="product-new-price">{activeVersion.price} ₴</div>
                            </div>

                            {/* Перемикач версій з відображенням ТІЛЬКИ додатків (Addon) */}
                            <div className="product-addons-selector">
                                <div className="addons-selector-title">
                                    Оберіть модифікацію (Addon):
                                </div>
                                <div className="addons-chips-list">
                                    {versions!.map((ver) => (
                                        <button
                                            key={ver.id}
                                            type="button"
                                            className={`addon-chip-btn ${ver.id === activeVersion.id ? "active" : ""}`}
                                            onClick={() => setSelectedVersion(ver)}
                                        >
                                            <span className="addon-chip-title">
                                                {ver.titleAddon || ver.title}
                                            </span>
                                            <span className="addon-chip-price">
                                                {ver.price} ₴
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Перелік усіх версій тільки з додатками (Addon) */}
                    <div className="product-versions-detail-block">
                        <h3 className="versions-detail-heading">Всі доступні версії товару:</h3>
                        <div className="versions-cards-grid">
                            {versions!.map((ver) => (
                                <div
                                    key={ver.id}
                                    className={`version-summary-card ${ver.id === activeVersion.id ? "active" : ""}`}
                                    onClick={() => setSelectedVersion(ver)}
                                >
                                    {ver.imageUrl && (
                                        <img
                                            src={ver.imageUrl}
                                            alt={ver.titleAddon || ver.title}
                                            className="version-summary-img"
                                        />
                                    )}
                                    <div className="version-summary-info">
                                        <div className="version-summary-addon">
                                            {ver.titleAddon || ver.title}
                                        </div>
                                        <div className="version-summary-price">
                                            {ver.price} ₴
                                        </div>
                                        <div className={`version-summary-stock ${ver.stock === 0 ? "out" : (ver.stock && ver.stock < 5 ? "low" : "in")}`}>
                                            {ver.stock === 0
                                                ? "Передзамовлення"
                                                : ver.stock && ver.stock < 5
                                                ? "Залишилось мало"
                                                : "У наявності"}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="version-summary-select-btn"
                                    >
                                        {ver.id === activeVersion.id ? "Обрано" : "Вибрати"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                /* Д.З. Якщо версія одна, то лишити структуру БЕЗ ЗМІН */
                <div className="row">
                    <div className="col col-5">
                        <img className="w-100" src={product.imageUrl} alt={product.title} />
                    </div>
                    <div className="col col-7 product-info">
                        <h1>{product.title}</h1>
                        <div>
                            <div className="product-rating">★★★★★ ({product.rating ?? 5})</div>
                            {product.stock === 0 ? (
                                <div className="product-unavailable">Передзамовлення</div>
                            ) : product.stock && product.stock > 0 && product.stock < 5 ? (
                                <div className="product-low-stock">Залишилось мало</div>
                            ) : (
                                <div className="product-available">У наявності</div>
                            )}
                        </div>
                        <div className="product-old-price">
                            {product.price + (product.discount ?? 0)}
                        </div>
                        <div className="product-new-price">{product.price}</div>
                    </div>
                </div>
            )}

            <br />
            <Recommended pageData={pageData} />
        </div>
    );
}

function Recommended({ pageData }: { pageData: ProductPageType }) {
    const scrollRightRef = useRef<HTMLDivElement>(null);

    const scrollRightClick: MouseEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        scrollRightRef.current?.scrollBy({
            left: 150,
            behavior: "smooth",
        });
    };
    const scrollLeftClick: MouseEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        scrollRightRef.current?.scrollBy({
            left: -150,
            behavior: "smooth",
        });
    };

    return (
        <div className="recommended-box">
            <div className="recommended-container" ref={scrollRightRef}>
                <div className="recommended-row">
                    {pageData?.recommended?.map((prod) => (
                        <ProductCard product={prod} key={prod.id} />
                    ))}
                </div>
            </div>

            <div className="scroll-left" role="button" onClick={scrollLeftClick}>
                &lt;
            </div>
            <div className="scroll-right" role="button" onClick={scrollRightClick}>
                &gt;
            </div>
        </div>
    );
}
