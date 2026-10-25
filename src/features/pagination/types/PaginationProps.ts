export default interface PaginationProps {
    currentPage: number;
    totalPages?: number;
    totalItems?: number;
    pageSize?: number;
    onPageChange: (page: number) => void;
    className?: string;
    maxVisiblePages?: number;
}
