import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import type { HomePageSection } from "../../features/section_card/types/section";
import SectionCard from "../../features/section_card/SectionCard";
import Pagination from "../../features/pagination/Pagination";
import "./ui/Home.css";
import SectionDao from "../../entities/section/api/SectionDao";

const PAGE_SIZE = 4;

export default function Home() {
    const [homePageContent, setHomePageContent] = useState<HomePageContent|null>(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const pageParam = parseInt(searchParams.get("page") ?? "1", 10);
    const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

    useEffect(() => {
        SectionDao.getSections().then(s => 
            setHomePageContent({
                sections: s
            }));
    }, []);

    const allSections = homePageContent?.sections ?? [];
    const totalPages = Math.max(1, Math.ceil(allSections.length / PAGE_SIZE));
    const validCurrentPage = Math.min(currentPage, totalPages);

    const handlePageChange = (newPage: number) => {
        if (newPage === validCurrentPage) return;
        const newParams = new URLSearchParams(searchParams);
        if (newPage === 1) {
            newParams.delete("page");
        } else {
            newParams.set("page", String(newPage));
        }
        setSearchParams(newParams);
    };

    const startIndex = (validCurrentPage - 1) * PAGE_SIZE;
    const displayedSections = allSections.slice(startIndex, startIndex + PAGE_SIZE);

    return <>
    <h1 className="display-4"><i className="bi bi-house-heart"></i> Home, sweet home</h1>
    
    <div className="content-container">
        {displayedSections.map(sec => 
            <SectionCard section={sec} key={sec.title} />)}
    </div>

    {allSections.length > 0 && (
        <Pagination
            currentPage={validCurrentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
        />
    )}

    </>;
}

type HomePageContent = {
    sections: Array<HomePageSection>,
}

