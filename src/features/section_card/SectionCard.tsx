import { Link } from "react-router-dom";
import type { HomePageSection } from "./types/section";
import SubSectionCard from "./SubSectionCard";
import "./ui/SectionCard.css";

export default function SectionCard({section}: {section: HomePageSection}) {
    const hasChildren = section.children && section.children.length > 0;

    if (hasChildren) {
        return (
            <div className="section-card section-card-parent">
                <div className="section-card-glow-fx" aria-hidden="true" />
                <div className="section-card-header">
                    <div className="section-title-wrap">
                        <span className="section-indicator-dot" aria-hidden="true" />
                        <h3 className="section-card-title">{section.title}</h3>
                    </div>
                    <span className="section-group-badge">
                        {section.children!.length} підгрупи
                    </span>
                </div>
                
                <div className="subgroups-container-grid">
                    {section.children!.map(child => (
                        <SubSectionCard key={child.slug} section={child} />
                    ))}
                </div>

                <Link 
                    to={"/section/" + section.slug}
                    className="section-parent-footer-link"
                >
                    <span>Переглянути всю групу</span>
                    <span className="arrow-icon" aria-hidden="true">→</span>
                </Link>
            </div>
        );
    }

    return (
        <div className="section-card section-card-main">
            <div className="section-card-glow-fx" aria-hidden="true" />
            <div className="section-card-header-simple">
                <span className="section-indicator-dot" aria-hidden="true" />
                <h3 className="section-card-title">{section.title}</h3>
            </div>
            <Link 
                className="section-card-single-link text-decoration-none" 
                to={"/section/" + section.slug}
            >
                <div className="img-wrapper">
                    <div className="img-backdrop-glow" aria-hidden="true" />
                    <img src={section.imageUrl} alt={section.title} loading="lazy" />
                </div>
                <div className="main-card-footer">
                    <p className="bottom-title">{section.title}</p>
                    <span className="view-btn">
                        <span>Переглянути</span>
                        <span className="btn-arrow" aria-hidden="true">→</span>
                    </span>
                </div>
            </Link>
        </div>
    );
}

