import React from 'react';
import styles from './Pagination.module.scss';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (size: number) => void;
  totalItems?: number;
};

const Pagination: React.FC<Props> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems = 10,
}) => {
  if (totalPages <= 1) return null;

  const handleClick = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const getVisiblePages = (): Array<number | '...'> => {
    const delta = 1;
    const range: Array<number | '...'> = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      const left = Math.max(2, currentPage - delta);
      const right = Math.min(totalPages - 1, currentPage + delta);

      range.push(1);
      if (left > 2) range.push('...');
      for (let i = left; i <= right; i++) range.push(i);
      if (right < totalPages - 1) range.push('...');
      range.push(totalPages);
    }

    return range;
  };

  const renderPages = () =>
    getVisiblePages().map((page, i) =>
      page === '...' ? (
        <span key={`dots-${i}`} className={styles.dots} data-testid="pagination-dots">
          ...
        </span>
      ) : (
        <button
          key={page}
          className={cn(styles.pageBtn, {
            [styles.active]: page === currentPage,
          })}
          onClick={() => handleClick(page)}
          data-testid={`page-button-${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      )
    );

  return (
    <div className={styles.paginationWrapper} data-testid="pagination">
      <div className={styles.sortWrapper} data-testid="items-per-page-selector">
        <span>Showing</span>
        <select
          className={styles.select}
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          data-testid="items-per-page-select"
        >
          {[10, 50, 100].map((size) => (
            <option key={size} value={size} data-testid={`option-${size}`}>
              {size}
            </option>
          ))}
        </select>
        <span>out of {totalItems}</span>
      </div>
      <div className={styles.buttonWrapper} data-testid="page-navigation">
        <button
          className={styles.navBtn}
          onClick={() => handleClick(currentPage - 1)}
          disabled={currentPage === 1}
          data-testid="prev-button"
          aria-label="Previous page"
        >
          <ChevronLeft />
        </button>

        {renderPages()}

        <button
          className={styles.navBtn}
          onClick={() => handleClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          data-testid="next-button"
          aria-label="Next page"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
