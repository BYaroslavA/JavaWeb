import { Link } from "react-router-dom";
import type { HomePageSection } from "./types/section";
import "./ui/SubSectionCard.css";

interface SubSectionCardProps {
    section: HomePageSection;
    className?: string;
}

export default function SubSectionCard({ section, className = "" }: SubSectionCardProps) {
    return (
        <Link 
            to={"/section/" + section.slug} 
            className={`subsection-card ${className} text-decoration-none`}
            title={section.title}
        >
            <div className="subsection-badge">
                <span className="badge-pulse-dot" aria-hidden="true" />
                Підгрупа
            </div>
            <div className="subsection-img-wrapper">
                <div className="subsection-img-glow" aria-hidden="true" />
                <img src={section.imageUrl} alt={section.title} loading="lazy" />
            </div>
            <div className="subsection-info">
                <span className="subsection-title">{section.title}</span>
                <span className="subsection-arrow" aria-hidden="true">→</span>
            </div>
        </Link>
    );
}
