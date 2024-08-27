import { PaginationLink } from "./pagination";

export const generatePaginationLinks = (
  currentPage: number,
  totalPages: number,
  onPageChange: (page: number) => void
) => {
  const pages: JSX.Element[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(
      <PaginationLink
        onClick={() => onPageChange(i)}
        isActive={i === currentPage}
        size={"small"}
        key={i}
        disabled={i === currentPage}
        variant={"ghost"}
      >
        {i}
      </PaginationLink>
    );
  }
  return pages;
};
