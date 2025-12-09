/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect } from 'react';
import { faSort, faSortDown, faSortUp, faGear, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Table, Popover, OverlayTrigger } from 'react-bootstrap';
import TableLoader from './components/TableLoader';
import Pagination from './components/Pagination';

const SignalTable = ({
  $filter,
  $view,
  onRowClick = () => { },
  onHeaderClick = () => { },
  headers = [],
  rows = [],
  hasCheckboxes = false,
  hasPagination = true,
  canFilterColumns = false,
  onColumnToggle,
  totalCount,
  currentPageItemsCount,
  currentPage,
  paginationMaxButtonAmount = 5,
  itemsPerPageAmount = 10,
  rowClassName = '',
}) => {
  const handleToggleColumn = (header) => {
    if (typeof onColumnToggle === 'function') {
      onColumnToggle(header.key, !header.isHidden);
    } else {
      const updatedHeaders = headers.map((h) => (
        h.key === header.key ? { ...h, isHidden: !h.isHidden } : h
      ));
      $view.update({ tableHeaders: updatedHeaders });
    }
  };

  const columnTogglerPopover = (
    <Popover>
      <Popover.Body>
        <div className="text-dark fw-800 p-8">Displayed Columns</div>
        {headers.map((header) => (
          <div
            key={header.key}
            role="button"
            tabIndex={0}
            className="cursor-pointer p-8 w-100 d-flex justify-content-between table-popover-option"
            onClick={() => handleToggleColumn(header)}
          >
            <div className="me-8">{header.value}</div>
            {!header.isHidden && <FontAwesomeIcon icon={faCheck} color="#41696C" />}
          </div>
        ))}
      </Popover.Body>
    </Popover>
  );

  useEffect(() => {
    // Get the current URL search parameters
    const urlParams = new URLSearchParams(window.location.search);
    // Extract the parameters you want (e.g., sortKey, sortDirection, page)
    const sortKey = urlParams.get('sortKey');
    const sortDirection = urlParams.get('sortDirection');
    const page = urlParams.get('page') || 1;

    // Update the $filter value based on the URL parameters
    $filter.update({
      page: parseInt(page, 10),
      sortKey,
      sortDirection: sortDirection || undefined, // or default sorting logic
    });
  }, [$filter]);

  return (
    <div className="p-0 overflow-hidden" style={{ borderRadius: 12 }}>
      <Table striped responsive style={{ fontSize: 16 }} hover>
        <thead>
          <tr>
            {hasCheckboxes && (
              <td className="border-0 fw-800 py-16" aria-label="Check Box">
                <Form.Check
                  checked={$view.value?.isSelectAllChecked}
                  onChange={(e) => {
                    e.stopPropagation();
                    $view.update({
                      isSelectAllChecked: e.target.checked,
                      selectedItems: e.target.checked ? rows : [],
                    });
                  }}
                />
              </td>
            )}
            {headers.map(({ key, value, sortKey, isHidden }, idx) => (!isHidden ? (
              <td
                key={key}
                className={`border-0 fw-800 text-nowrap py-16 ${idx === headers.length - 1 ? 'text-right' : ''}`}
                role="button"
                tabIndex={idx}
                onClick={() => {
                  if (!sortKey) return;
                  const isAscending = $filter?.value?.sortKey === sortKey && $filter?.value?.sortDirection === 'asc';
                  const isDescending = $filter?.value?.sortKey === sortKey && $filter?.value?.sortDirection === 'desc';
                  $filter.update({
                    page: 1,
                    sortKey: isAscending ? undefined : sortKey,
                    sortDirection: isAscending ? undefined : isDescending ? 'asc' : 'desc',
                  });
                  const params = new URLSearchParams($filter.value);
                  window.history.pushState(null, '', `?${params.toString()}`);
                  window.localStorage.setItem('filterQueryString', params.toString());
                  onHeaderClick({ key, value, sortKey }, idx);
                }}
              >
                <b className="d-flex justify-content-center align-items-center">
                  <span className={`${sortKey ? 'me-8' : ''}`}>{value}</span>
                  {sortKey && (
                    <FontAwesomeIcon
                      icon={
                        $filter?.value?.sortKey === sortKey
                          ? $filter?.value?.sortDirection === 'asc'
                            ? faSortUp
                            : faSortDown
                          : faSort
                      }
                      className="my-auto me-8"
                      size="xs"
                    />
                  )}
                </b>
              </td>
            ) : null
            ))}
            {canFilterColumns && (
              <OverlayTrigger rootClose trigger="click" overlay={columnTogglerPopover}>
                <td className="border-0 pe-24 py-16 cursor-pointer" aria-label="Column Filters">
                  <div className="w-100 d-flex justify-content-end">
                    <FontAwesomeIcon icon={faGear} />
                  </div>
                </td>
              </OverlayTrigger>
            )}
          </tr>
        </thead>
        <tbody>
          {!rows.length && !$view.value?.isTableLoading && (
            <tr>
              <td className="border-0 w-100" colSpan={headers.length + (canFilterColumns ? 2 : 1)}>
                No records found
              </td>
            </tr>
          )}
          {$view.value?.isTableLoading && (
            <tr>
              <td colSpan={headers.length + (canFilterColumns ? 2 : 1)} className="text-center border-0">
                <TableLoader length={itemsPerPageAmount} />
              </td>
            </tr>
          )}
          {!$view.value?.isTableLoading && rows.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              onClick={() => onRowClick(row)}
              style={{ cursor: 'pointer', visibility: $view.value?.isTableLoading ? 'hidden' : 'visible' }}
              className={rowClassName}
            >
              {hasCheckboxes && (
                <td className="border-0 py-16">
                  <Form.Check
                    checked={$view.value?.selectedItems?.some(({ id }) => id === row.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      $view.update({ isShiftKey: e.shiftKey });
                    }}
                    onChange={(e) => {
                      e.stopPropagation();
                      let selectedItems = $view.value?.selectedItems || [];
                      if (!e.target.checked) {
                        selectedItems = selectedItems.filter(({ id }) => id !== row.id);
                      } else {
                        selectedItems.push(row);
                      }
                      $view.update({ selectedItems, lastCheckedIndex: rowIdx, isShiftKey: false });
                    }}
                  />
                </td>
              )}
              {headers.map(({ key, isHidden }, idx) => (
                !isHidden ? (
                  <td key={idx} className={`border-0 ${idx === headers.length - 1 ? 'text-right' : ''}`}>
                    {typeof row?.[key] === 'function' ? row[key]() : row[key]}
                  </td>
                ) : null
              ))}
              {canFilterColumns && <td />}
            </tr>
          ))}
        </tbody>
      </Table>
      {hasPagination && (
        <Pagination
          itemsPerPageAmount={paginationMaxButtonAmount}
          paginationMaxButtonAmount={paginationMaxButtonAmount}
          totalItemsCount={totalCount}
          currentPageItemsCount={currentPageItemsCount || 0}
          currentPage={currentPage}
        />
      )}
    </div>
  );
};

export default SignalTable;
