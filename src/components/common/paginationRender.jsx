import React from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import _ from "lodash";

const PaginationRender = ({
  itemsCount,
  pageSize,
  onPageChange,
  currentPage,
}) => {
  const pagesCount = Math.ceil(itemsCount / pageSize);
  if (pagesCount === 1) return null;
  const pages = _.range(1, pagesCount + 1);
  console.log(pages);

  return (
    <Pagination aria-label="Page navigation example">
      {pages.map((page) => (
        <PaginationItem
          key={page}
          onClick={() => onPageChange(page)}
          className={currentPage === page ? "active" : null}
        >
          <PaginationLink first>{page}</PaginationLink>
        </PaginationItem>
      ))}
    </Pagination>
  );
};

export default PaginationRender;
