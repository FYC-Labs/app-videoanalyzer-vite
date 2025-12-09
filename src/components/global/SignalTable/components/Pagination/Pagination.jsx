import { Container, Button, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { $filter } from '@src/signals';

const Pagination = ({
  itemsPerPageAmount,
  paginationMaxButtonAmount,
  totalItemsCount,
  currentPageItemsCount,
  currentPage,
  className = '',
  disabled = false,
}) => {
  const pagesCount = Math.ceil(totalItemsCount / itemsPerPageAmount);
  const showPagination = pagesCount > 1;

  const firstPage = Math.max(1, Math.min(pagesCount - paginationMaxButtonAmount + 1, currentPage - Math.floor(paginationMaxButtonAmount / 2)));
  const lastPage = Math.min(pagesCount, firstPage + paginationMaxButtonAmount - 1);
  const pages = Array.from({ length: lastPage - firstPage + 1 }, (_, i) => firstPage + i);

  const setCurrentPage = (value, direction = 'forward') => {
    if (direction === 'forward' && !value) $filter.update({ page: currentPage + 1 });
    if (direction === 'backward' && !value) $filter.update({ page: currentPage - 1 });
    if (value) $filter.update({ page: value });
    const params = new URLSearchParams($filter.value);
    window.history.pushState(null, '', `?${params.toString()}`);
    window.localStorage.setItem('filterQueryString', params.toString());
  };

  return (
    <Container className={`d-flex flex-column align-items-center justify-content-center p-0 py-16 ${className}`}>
      {showPagination && (
        <ListGroup horizontal>
          <ListGroup.Item className="bg-transparent border-0">
            <Button
              variant="transparent"
              className="border-0 p-0"
              disabled={disabled || currentPage === 1}
              onClick={() => setCurrentPage(null, 'backward')}
            >
              <FontAwesomeIcon className="text-primary" icon={faChevronLeft} />
            </Button>
          </ListGroup.Item>

          {pages.map((page) => (
            <ListGroup.Item key={page} className="bg-transparent border-0">
              <Button
                variant="transparent"
                className={`border-0 p-0 ${currentPage === page ? 'fw-bold text-primary' : 'fw-normal text-dark'}`}
                disabled={disabled || currentPage === page}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            </ListGroup.Item>
          ))}

          <ListGroup.Item className="bg-transparent border-0">
            <Button
              variant="transparent"
              className="border-0 p-0"
              disabled={disabled || currentPage >= pagesCount}
              onClick={() => setCurrentPage(null, 'forward')}
            >
              <FontAwesomeIcon className="text-primary" icon={faChevronRight} />
            </Button>
          </ListGroup.Item>
        </ListGroup>
      )}

      {showPagination && currentPageItemsCount > 0 && (
        <div className="ml-16 text-muted">
          Showing {currentPageItemsCount} of {totalItemsCount} results
        </div>
      )}
    </Container>
  );
};

export default Pagination;
