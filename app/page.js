"use client";

import { useMemo, useState } from "react";
import { useTable, useFilters, useSortBy, usePagination } from "react-table";
import "tailwindcss/tailwind.css";
import { data } from "../utils/testutils";

const columns = [
  {
    Header: "Test Suite ID",
    accessor: "testSuiteId",
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
    Filter: DefaultColumnFilter,
  },
  {
    Header: "Flink Job Ids",
    accessor: "jobIds",
    Filter: FlinkJobIdsFilter, // Add filter for Flink Job Ids
    Cell: ({ value, row }) => {
      const filterValue = row?.original?.filterValue || ""; // Get the current filter value
      return (
        <div className="flex flex-wrap gap-2">
          {value.map((jobId) => (
            <div
              key={jobId}
              className={`flex items-center space-x-2 px-2 py-1 rounded-full text-xs ${
                jobId.includes(filterValue) && filterValue
                  ? "bg-yellow-300 text-black animate-pulse"
                  : "bg-blue-200 text-blue-800"
              }`}
            >
              <span>{jobId}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(jobId);
                  alert(`Copied: ${jobId}`);
                }}
                className="text-blue-500 hover:text-blue-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M8 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2H8z" />
                  <path d="M6 4a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2H8a2 2 0 01-2-2V4z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    Header: "Parallelism",
    accessor: "parallelism",
    Filter: DefaultColumnFilter,
  },
];

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const tableData = useMemo(() => data, []);
  const tableColumns = useMemo(() => columns, []);

  const defaultColumn = useMemo(() => ({
    Filter: DefaultColumnFilter,
  }), []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Use page for pagination
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setAllFilters, // Used to reset all filters
    state: { pageIndex, filters }, // Capture filters in state
  } = useTable(
    {
      columns: tableColumns,
      data: tableData,
      defaultColumn,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useFilters,
    useSortBy,
    usePagination
  );

  // Pass the current filter to each row's original data for `Flink Job Ids`
  page.forEach((row) => {
    row.original.filterValue = filters.find((f) => f.id === "jobIds")?.value || "";
  });

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <div className="container mx-auto p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Test Suites</h1>
            <button
              onClick={toggleDarkMode}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>

          {/* Reset Filters */}
          <div className="mb-4">
            <button
              onClick={() => setAllFilters([])} // Clear all filters
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
            >
              Reset Filters
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table
              {...getTableProps()}
              className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
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
                          {column.render("Header")}
                          {column.isSorted ? (
                            column.isSortedDesc ? " ↓" : " ↑"
                          ) : ""}
                        </div>
                        <div>
                          {column.canFilter ? column.render("Filter") : null}
                        </div>
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
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Page{" "}
                <strong>
                  {pageIndex + 1} of {pageOptions.length}
                </strong>
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
                className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
              >
                {"<<"}
              </button>
              <button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
                className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => nextPage()}
                disabled={!canNextPage}
                className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
              >
                Next
              </button>
              <button
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
                className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
              >
                {">>"}
              </button>
            </div>
          </div>
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
      value={filterValue || ""}
      onChange={(e) => setFilter(e.target.value || undefined)}
      placeholder="Search..."
      className="mt-1 block w-full px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}

// Custom Filter for Flink Job Ids
function FlinkJobIdsFilter({ column: { filterValue, setFilter } }) {
  return (
    <input
      value={filterValue || ""}
      onChange={(e) => setFilter(e.target.value || undefined)}
      placeholder="Search Job IDs..."
      className="mt-1 block w-full px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}