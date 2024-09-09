import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PaginationComponent = ({
  activePage,
  totalPages,
  href = "#",
  setActivePage,
}) => {
  return (
    <Pagination className={"mb-8"}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#SEARCH_AND_FILTER"
            onClick={() => setActivePage(Math.max(activePage - 1, 1))}
            className={activePage === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            onClick={() => setActivePage(1)}
            isActive={activePage === 1}
            href={href}
          >
            1
          </PaginationLink>
        </PaginationItem>

        {activePage > 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {[...Array(3)].map((_, index) => {
          const page = activePage + (index - 1);
          return (
            page > 1 &&
            page < totalPages && (
              <PaginationItem>
                <PaginationLink
                  key={page}
                  onClick={() => setActivePage(page)}
                  isActive={activePage === page}
                  href={href}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          );
        })}

        {activePage < totalPages - 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {totalPages > 1 && (
          <PaginationItem>
            <PaginationLink
              onClick={() => setActivePage(totalPages)}
              isActive={activePage === totalPages}
              href={href}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            href={href}
            onClick={() => setActivePage(Math.min(activePage + 1, totalPages))}
            className={
              activePage === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;
