'use client';

import { useEffect, useState, useMemo } from 'react';
import { useTable, useFilters, useSortBy, usePagination } from 'react-table';
import Papa from 'papaparse';

export default function JobTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    Papa.parse('/FlinkJobsId.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        setData(results.data);
      },
    });
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: 'Job Name',
        accessor: 'JOB_NAME',
      },
      {
        Header: 'Job ID',
        accessor: 'JOB_ID',
        Cell: ({ value }) => (
          <div className="flex items-center space-x-2">
            <span>{value}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(value);
                alert(`Copied: ${value}`);
              }}
              className="text-blue-500 hover:text-blue-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2H8z" />
                <path d="M6 4a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2H8a2 2 0 01-2-2V4z" />
              </svg>
            </button>
          </div>
        ),
      },
      {
        Header: 'File Size',
        accessor: 'FILE_SIZE',
      },
      {
        Header: 'Parallelism',
        accessor: 'PARALLELISM',
      },
    ],
    []
  );

  const defaultColumn = useMemo(() => ({
    Filter: DefaultColumnFilter,
  }), []);

  const tableInstance = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { pageIndex: 0, pageSize: 20 },
    },
    useFilters,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = tableInstance;

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={() => tableInstance.setAllFilters([])}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
        >
          Reset Filters
        </button>
      </div>

      <div className="overflow-x-auto">
        <table {...getTableProps()} className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                key={headerGroup.id}
                className="bg-gray-200 dark:bg-gray-700 text-left text-sm uppercase font-semibold text-gray-700 dark:text-gray-200"
              >
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={column.id}
                    className="px-4 py-3 border-b border-gray-300 dark:border-gray-600"
                  >
                    <div className="flex items-center">
                      {column.render('Header')}
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <span>&darr;</span>
                        ) : (
                          <span>&uarr;</span>
                        )
                      ) : null}
                    </div>
                    <div>{column.canFilter ? column.render('Filter') : null}</div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="text-sm">
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  key={row.id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      key={cell.column.id}
                      className="px-4 py-3 border-b border-gray-200 dark:border-gray-700"
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className="px-3 py-1 rounded bg-blue-500 text-white"
          >
            {'<<'}
          </button>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="px-3 py-1 rounded bg-blue-500 text-white"
          >
            Previous
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="px-3 py-1 rounded bg-blue-500 text-white"
          >
            Next
          </button>
          <button
            onClick={() => gotoPage(pageOptions.length - 1)}
            disabled={!canNextPage}
            className="px-3 py-1 rounded bg-blue-500 text-white"
          >
            {'>>'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Default Column Filter Component
function DefaultColumnFilter({
  column: { filterValue, setFilter },
}) {
  return (
    <input
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder="Search..."
      className="mt-1 block w-full px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none"
    />
  );
}
