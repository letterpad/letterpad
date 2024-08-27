"use client";
import { generatePaginationLinks } from "./generatePages";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";

type PaginatorProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
  showPreviousNext: boolean;
};

export function Paginator({
  currentPage,
  totalPages,
  onPageChange,
  showPreviousNext,
}: PaginatorProps) {
  return (
    <Pagination>
      <PaginationContent>
        {showPreviousNext && totalPages ? (
          <PaginationPrevious
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage - 1 < 1}
            size={"small"}
          />
        ) : null}
        {generatePaginationLinks(currentPage, totalPages, onPageChange)}
        {showPreviousNext && totalPages ? (
          <PaginationNext
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage > totalPages - 1}
            size={"small"}
          />
        ) : null}
      </PaginationContent>
    </Pagination>
  );
}
