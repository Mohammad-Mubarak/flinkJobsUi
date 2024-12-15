// "use client"


// import { useMemo, useState } from 'react';
// import { useTable, useFilters } from 'react-table';
// import 'tailwindcss/tailwind.css';

// import {data} from "../../utils/testutils"


// const columns = [
//   {
//     Header: 'Test Suite ID',
//     accessor: 'testSuiteId',
//   },
//   {
//     Header: 'Job IDs',
//     accessor: 'jobIds',
//     Cell: ({ value }) => value.join(', '),
//     disableFilters: true,
//   },
//   {
//     Header: 'Parallelism',
//     accessor: 'parallelism',
//   },
// ];

// export default function Home() {
//   const [darkMode, setDarkMode] = useState(false);

//   const toggleDarkMode = () => setDarkMode(!darkMode);

//   const tableData = useMemo(() => data, []);
//   const tableColumns = useMemo(() => columns, []);

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     rows,
//     prepareRow,
//     setAllFilters,
//   } = useTable(
//     {
//       columns: tableColumns,
//       data: tableData,
//     },
//     useFilters
//   );

//   return (
//     <div className={darkMode ? 'dark' : ''}>
//       <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
//         <div className="container mx-auto p-4">
//           <div className="flex justify-between items-center mb-4">
//             <h1 className="text-2xl font-bold">Test Suites</h1>
//             <button
//               onClick={toggleDarkMode}
//               className="px-4 py-2 bg-blue-500 text-white rounded"
//             >
//               Toggle {darkMode ? 'Light' : 'Dark'} Mode
//             </button>
//           </div>
//           <table {...getTableProps()} className="w-full table-auto">
//             <thead>
//               {headerGroups.map(headerGroup => (
//                 <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-200 dark:bg-gray-700">
//                   {headerGroup.headers.map(column => (
//                     <th {...column.getHeaderProps()} className="p-2 border">
//                       {column.render('Header')}
//                       <div>
//                         {column.canFilter ? column.render('Filter') : null}
//                       </div>
//                     </th>
//                   ))}
//                 </tr>
//               ))}
//               <tr>
//                 <th colSpan={columns.length}>
//                   <button
//                     onClick={() => setAllFilters([])}
//                     className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
//                   >
//                     Reset Filters
//                   </button>
//                 </th>
//               </tr>
//             </thead>
//             <tbody {...getTableBodyProps()} className="bg-white dark:bg-gray-800">
//               {rows.map(row => {
//                 prepareRow(row);
//                 return (
//                   <tr {...row.getRowProps()} className="border-t">
//                     {row.cells.map(cell => (
//                       <td {...cell.getCellProps()} className="p-2 border">
//                         {cell.render('Cell')}
//                       </td>
//                     ))}
//                   </tr>
//                 )
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   )
// }

// function DefaultColumnFilter({
//   column: { filterValue, preFilteredRows, setFilter },
// }) {
//   return (
//     <input
//       value={filterValue || ''}
//       onChange={e => {
//         setFilter(e.target.value || undefined);
//       }}
//       placeholder={`Search...`}
//       className="mt-1 block w-full px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
//     />
//   )
// }

// columns.forEach(column => {
//   if (column.disableFilters) return;
//   column.Filter = DefaultColumnFilter;
// });














// -------------------------------------VERSION 2---------------------------------






"use client";

import { useMemo, useState } from "react";
import { useTable, useFilters, useSortBy, usePagination } from "react-table";
import "tailwindcss/tailwind.css";
import { data } from "../../utils/testutils";

const columns = [
  {
    Header: "Test Suite ID",
    accessor: "testSuiteId",
  },
  {
    Header: "Fliink Job Ids",
    accessor: "jobIds",
    disableFilters: true,
    Cell: ({ value }) => (
      <div className="flex flex-wrap gap-2">
        {value.map((jobId) => (
          <span
            key={jobId}
            className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs"
          >
            {jobId}
          </span>
        ))}
      </div>
    ),
  },
  {
    Header: "Parallelism",
    accessor: "parallelism",
  },
];

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const tableData = useMemo(() => data, []);
  const tableColumns = useMemo(() => columns, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of rows, use page for pagination
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setAllFilters,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns: tableColumns,
      data: tableData,
      initialState: { pageIndex: 0, pageSize: 10 }, 
    },
    useFilters,
    useSortBy,
    usePagination
  );

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
              {darkMode ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      d="M10 2a.75.75 0 01.75.75V4a.75.75 0 01-1.5 0V2.75A.75.75 0 0110 2zM4.22 4.22a.75.75 0 011.06 0L6.5 5.44a.75.75 0 11-1.06 1.06L4.22 5.28a.75.75 0 010-1.06zM2 10a.75.75 0 01.75-.75H4a.75.75 0 010 1.5H2.75A.75.75 0 012 10zM4.22 15.78a.75.75 0 011.06-1.06l1.22 1.22a.75.75 0 11-1.06 1.06l-1.22-1.22a.75.75 0 01-1.06 0zM10 17.25a.75.75 0 01.75-.75h1.25a.75.75 0 010 1.5H10.75A.75.75 0 0110 17.25zM15.78 15.78a.75.75 0 010-1.06l1.22-1.22a.75.75 0 011.06 1.06l-1.22 1.22a.75.75 0 01-1.06 0zM17.25 10a.75.75 0 01-.75-.75V8.75a.75.75 0 011.5 0v1.5a.75.75 0 01-.75.75zM15.78 4.22a.75.75 0 010 1.06l1.22 1.22a.75.75 0 011.06-1.06l-1.22-1.22a.75.75 0 011.06 0zM10 5a5 5 0 100 10A5 5 0 0010 5z"
                    />
                  </svg>
                  Light Mode
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      d="M10 2a.75.75 0 01.75.75V4a.75.75 0 01-1.5 0V2.75A.75.75 0 0110 2zm4.596 2.354a.75.75 0 011.06.02L10 11.584l-3.71-4.353a.75.75 0 011.14-.976l1.22 1.42a.75.75 0 011.06 0l1.22-1.42a.75.75 0 011.06-.02zM10 16a.75.75 0 01.75-.75h1.25a.75.75 0 010 1.5H10.75A.75.75 0 0110 16zm-4.596-2.354a.75.75 0 011.06-1.06l1.22 1.22a.75.75 0 11-1.06 1.06L5.404 13.646a.75.75 0 010-1.06zM10 5a5 5 0 100 10A5 5 0 0010 5z"
                    />
                  </svg>
                  Dark Mode
                </>
              )}
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
                          {/* Add a sort direction indicator */}
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 ml-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.353a.75.75 0 111.14.976l-4.25 5A.75.75 0 0110 14.25a.75.75 0 01-.53-.22l-4.25-5a.75.75 0 01.02-1.06z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 ml-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.416 6.29 12.77a.75.75 0 11-1.14-.976l4.25-5a.75.75 0 011.06 0l4.25 5a.75.75 0 01-.02 1.06z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )
                          ) : (
                            ""
                          )}
                        </div>
                        {/* Render the column filter UI */}
                        <div>
                          {column.canFilter ? column.render("Filter") : null}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
                {/* Reset Filters Button */}
                <tr>
                  <th colSpan={columns.length} className="px-4 py-3">
                    <button
                      onClick={() => setAllFilters([])}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
                    >
                      Reset Filters
                    </button>
                  </th>
                </tr>
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
                className={`px-3 py-1 rounded ${
                  !canPreviousPage
                    ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                } transition-colors duration-200`}
              >
                {"<<"}
              </button>
              <button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
                className={`px-3 py-1 rounded ${
                  !canPreviousPage
                    ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                } transition-colors duration-200`}
              >
                Previous
              </button>
              <button
                onClick={() => nextPage()}
                disabled={!canNextPage}
                className={`px-3 py-1 rounded ${
                  !canNextPage
                    ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                } transition-colors duration-200`}
              >
                Next
              </button>
              <button
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
                className={`px-3 py-1 rounded ${
                  !canNextPage
                    ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                } transition-colors duration-200`}
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
  column: { filterValue, preFilteredRows, setFilter },
}) {
  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      placeholder={`Search...`}
      className="mt-1 block w-full px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}

columns.forEach((column) => {
  if (column.disableFilters) return;
  column.Filter = DefaultColumnFilter;
});





