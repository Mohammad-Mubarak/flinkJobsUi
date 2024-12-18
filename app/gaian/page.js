"use client";

import { useMemo, useState, useEffect } from "react";
import {
  useTable,
  useFilters,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import "tailwindcss/tailwind.css";

import { gaian } from "@/utils/gaianApis";

const columns = [
  {
    Header: "Script Available",
    accessor: "scriptAvailable",
    Cell: ({ value }) => value || "N/A",
  },
  {
    Header: "Controller Name",
    accessor: "controllerName",
  },
  {
    Header: "Comments",
    accessor: "comments",
    Cell: ({ value }) => value || "No Comments",
  },
  {
    Header: "Endpoint",
    accessor: "endpoint",
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
          Copy
        </button>
      </div>
    ),
  },
  {
    Header: "Unique ID",
    accessor: "uniqueId",
  },
  {
    Header: "Methods",
    accessor: "methods",
  },
  {
    Header: "Summary",
    accessor: "summary",
  },
  {
    Header: "Component",
    accessor: "component",
  },
  {
    Header: "Additional Comments",
    accessor: "additionalComments",
    Cell: ({ value }) => value || "No Additional Comments",
  },
];

export default function Home() {
  const [tableData, setTableData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const tableColumns = useMemo(() => columns, []);

  useEffect(() => {
    setTableData(gaian);
  }, []);

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
    previousPage,
    nextPage,
    state: { pageIndex, pageSize },
    setPageSize,
    setGlobalFilter: setTableGlobalFilter,
  } = useTable(
    {
      columns: tableColumns,
      data: tableData || [],
      initialState: { pageSize: 10 },
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    usePagination
  );

  const handleResetFilters = () => {
    setGlobalFilter("");
    setTableGlobalFilter(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            Gaian API's
          </h1>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
              setTableGlobalFilter(e.target.value);
            }}
            placeholder="Search..."
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring focus:border-blue-500"
          />
        </div>

        {/* Reset Filters Button */}
        <div className="mb-4">
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reset Filters
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table
            {...getTableProps()}
            className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg"
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  className="bg-blue-100 dark:bg-blue-800"
                >
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="px-4 py-3 text-left font-medium"
                    >
                      <div className="flex items-center space-x-2">
                        <span>{column.render("Header")}</span>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <span>↓</span>
                          ) : (
                            <span>↑</span>
                          )
                        ) : null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} className="px-4 py-3">
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div>
            <button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div>
            <span>
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>
              <br />
              <strong>
                Total data: {tableData.length} <br />
                Left data:{" "}
                {tableData.length - (pageIndex + 1) * pageSize > 0
                  ? tableData.length - (pageIndex + 1) * pageSize
                  : 0}
              </strong>
            </span>
          </div>
          <div>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="ml-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {[5, 10, 20].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
