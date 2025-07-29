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
};

const Pagination: React.FC<Props> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
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
        <span key={`dots-${i}`} className={styles.dots}>
          ...
        </span>
      ) : (
        <button
          key={page}
          className={cn(styles.pageBtn, {
            [styles.active]: page === currentPage,
          })}
          onClick={() => handleClick(page)}
        >
          {page}
        </button>
      )
    );

  return (
    <div className={styles.paginationWrapper}>
      <div className={styles.sortWrapper}>
        <span>Showing</span>
        <select
          className={styles.select}
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        >
          {[10, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span>Out of 100</span>
      </div>
      <div className={styles.buttonWrapper}>
        <button
          className={styles.navBtn}
          onClick={() => handleClick(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft />
        </button>

        {renderPages()}

        <button
          className={styles.navBtn}
          onClick={() => handleClick(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
