import type PaginationProps from "./types/PaginationProps";
import "./ui/Pagination.css";

export default function Pagination({
    currentPage,
    totalPages: inputTotalPages,
    totalItems,
    pageSize = 4,
    onPageChange,
    className = "",
    maxVisiblePages = 7
}: PaginationProps) {
    const computedTotalPages =
        inputTotalPages ?? Math.max(1, Math.ceil((totalItems ?? 0) / pageSize));
    const totalPages = Math.max(1, computedTotalPages);

    const getPageItems = (): Array<number | string> => {
        if (totalPages <= maxVisiblePages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages: Array<number | string> = [];
        const half = Math.floor((maxVisiblePages - 2) / 2);

        let start = Math.max(2, currentPage - half);
        let end = Math.min(totalPages - 1, currentPage + half);

        if (currentPage <= half + 1) {
            end = maxVisiblePages - 2;
        } else if (currentPage >= totalPages - half) {
            start = totalPages - (maxVisiblePages - 3);
        }

        pages.push(1);

        if (start > 2) {
            pages.push("...");
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < totalPages - 1) {
            pages.push("...");
        }

        pages.push(totalPages);

        return pages;
    };

    const pages = getPageItems();

    return (
        <nav aria-label="Page navigation" className={`pagination-wrapper ${className}`}>
            <ul className="pagination">
                <li className={`page-item ${currentPage <= 1 ? "disabled" : ""}`}>
                    {currentPage <= 1 ? (
                        <span className="page-link" aria-disabled="true" aria-label="Previous">
                            &laquo;
                        </span>
                    ) : (
                        <button
                            type="button"
                            className="page-link"
                            onClick={() => onPageChange(currentPage - 1)}
                            aria-label="Previous"
                        >
                            &laquo;
                        </button>
                    )}
                </li>

                {pages.map((p, index) => {
                    if (typeof p === "string") {
                        return (
                            <li key={`ellipsis-${index}`} className="page-item disabled">
                                <span className="page-link">&hellip;</span>
                            </li>
                        );
                    }

                    const isActive = p === currentPage;
                    return (
                        <li
                            key={p}
                            className={`page-item ${isActive ? "active" : ""}`}
                            aria-current={isActive ? "page" : undefined}
                        >
                            {isActive ? (
                                <span className="page-link">{p}</span>
                            ) : (
                                <button
                                    type="button"
                                    className="page-link"
                                    onClick={() => onPageChange(p)}
                                >
                                    {p}
                                </button>
                            )}
                        </li>
                    );
                })}

                <li className={`page-item ${currentPage >= totalPages ? "disabled" : ""}`}>
                    {currentPage >= totalPages ? (
                        <span className="page-link" aria-disabled="true" aria-label="Next">
                            &raquo;
                        </span>
                    ) : (
                        <button
                            type="button"
                            className="page-link"
                            onClick={() => onPageChange(currentPage + 1)}
                            aria-label="Next"
                        >
                            &raquo;
                        </button>
                    )}
                </li>
            </ul>
        </nav>
    );
}

export { Pagination as Paginator };
