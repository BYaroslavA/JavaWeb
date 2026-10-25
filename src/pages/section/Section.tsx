import { useParams, Link } from "react-router-dom";
import './ui/Section.css';
import { useEffect, useState } from "react";
import type { SectionType } from "../../entities/section/model/SectionType";
import SectionDao from "../../entities/section/api/SectionDao";
import ProductCard from "../../entities/product/ui/ProductCard";
import SubSectionCard from "../../features/section_card/SubSectionCard";

export default function Section() {
    const {slug} = useParams<string>();
    const [pageData, setPageData] = useState<SectionType|null>(null);

    useEffect(() => {
        if(typeof(slug) != 'undefined') {
            SectionDao.getSection(slug).then(setPageData);
        }        
    }, [slug]);

    const hasSubgroups = Boolean(pageData?.children && pageData.children.length > 0);

    return (
        <div className="section-page">
            <div className="section-page-header">
                <nav className="section-breadcrumbs">
                    <Link to="/" className="breadcrumb-link">Головна</Link>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">{pageData?.title || slug}</span>
                </nav>
                <h1 className="section-main-title">
                    Розділ: <span className="highlight-title">{pageData?.title || slug}</span>
                </h1>
            </div>

            {hasSubgroups && (
                <section className="section-subgroups-wrapper">
                    <div className="section-subgroups-header">
                        <h2 className="section-subgroups-heading">
                            <span className="heading-icon">📁</span> Підгрупи товарної групи
                        </h2>
                        <span className="subgroups-badge">{pageData!.children!.length} підкатегорій</span>
                    </div>
                    <div className="section-subgroups-grid">
                        {pageData!.children!.map(child => (
                            <div className="subgroup-card-wrapper" key={child.slug}>
                                <SubSectionCard section={child} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section className="section-products-wrapper">
                {hasSubgroups && (
                    <h2 className="section-products-heading">
                        <span className="heading-icon">📦</span> Товари групи
                    </h2>
                )}
                {pageData?.products && pageData.products.length > 0 ? (
                    <div className="products-container">
                        {pageData.products.map(product => (
                            <ProductCard product={product} key={product.id} />
                        ))}
                    </div>
                ) : (
                    <div className="section-empty-box">
                        <p>У цьому розділі наразі немає прямих товарів.</p>
                        {hasSubgroups && <p className="hint">Оберіть одну з підгруп вище для перегляду товарів.</p>}
                    </div>
                )}
            </section>
        </div>
    );
}
