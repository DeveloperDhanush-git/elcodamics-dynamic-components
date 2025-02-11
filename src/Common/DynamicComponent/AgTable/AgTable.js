import React, { useState } from "react";

const AgTable = ({ headers, data }) => {
  const [searchFilters, setSearchFilters] = useState(
    Object.fromEntries(headers.map((header) => [header.key, ""]))
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSearchChange = (key, value) => {
    setSearchFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
  };

  const filteredData = data.filter((item) =>
    headers.every((header) =>
      (item[header.key] ?? "").toString().toLowerCase().includes((searchFilters[header.key] ?? "").toLowerCase())
    )
  );

  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg w-full max-w-5xl mx-auto border-3">
      <div className={`grid grid-cols-${headers.length} gap-4 mb-4`}>
        {headers.map((header) => (
          <input
            key={header.key}
            type="text"
            placeholder={`Search ${header.label}`}
            className="p-2 border border-gray-600 bg-gray-800 rounded w-full"
            onChange={(e) => handleSearchChange(header.key, e.target.value)}
          />
        ))}
      </div>

      <div className="overflow-y-auto h-80 custom-scrollbar table-wrapper">
        <table className="w-full border border-gray-700 text-center">
          <thead className="sticky top-0 bg-gradient-to-r from-gray-800 to-gray-700 text-gray-300">
            <tr>
              {headers.map((header) => (
                <th key={header.key} className="p-3 uppercase tracking-wider text-sm">
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr key={index} className="border-b border-gray-700 hover:bg-gray-800 transition duration-200">
                {headers.map((header) => (
                  <td key={header.key} className="p-3">
                    {typeof item[header.key] === "boolean"
                      ? item[header.key] ? "✅" : "❌"
                      : item[header.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <select
          className="p-2 border border-gray-600 bg-gray-800 rounded"
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          <option value="5">5</option>
          <option value="10" selected>
            10
          </option>
          <option value="15">15</option>
        </select>
        <button
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>
        <span>
          Page {page} of {Math.ceil(filteredData.length / pageSize)}
        </span>
        <button
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
          disabled={page * pageSize >= filteredData.length}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
      <style jsx>{`
      .table-container {
    display: flex;
    flex-direction: column;
    min-height: 500px;
  }
  .table-wrapper {
    flex-grow: 1;
    overflow-y: auto;
  }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a202c;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4a5568;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #718096;
        }
      `}</style>
    </div>
  );
};

export default AgTable;
