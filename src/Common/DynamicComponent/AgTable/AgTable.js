import React, { useState } from "react";

const initialData = [
  { make: "Tesla", model: "Model Y", price: 64950, electric: true },
  { make: "Ford", model: "F-Series", price: 33850, electric: false },
  { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  { make: "Mercedes", model: "EQA", price: 48890, electric: true },
  { make: "Fiat", model: "500", price: 15774, electric: false },
  { make: "Nissan", model: "Juke", price: 20675, electric: false },
  { make: "Vauxhall", model: "Corsa", price: 18460, electric: false },
  { make: "Volvo", model: "EX30", price: 33795, electric: true },
];

const AgTable = () => {
  const [data, setData] = useState(initialData);
  const [searchMake, setSearchMake] = useState("");
  const [searchModel, setSearchModel] = useState("");
  const [searchPrice, setSearchPrice] = useState("");
  const [filterElectric, setFilterElectric] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredData = data.filter(
    (item) =>
      item.make.toLowerCase().includes(searchMake.toLowerCase()) &&
      item.model.toLowerCase().includes(searchModel.toLowerCase()) &&
      item.price.toString().includes(searchPrice) &&
      (filterElectric === null || item.electric === filterElectric)
  );

  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-4 gap-4 mb-4">
        <input
          type="text"
          placeholder="Search Make"
          className="p-2 border border-gray-600 bg-gray-800 rounded w-full"
          onChange={(e) => setSearchMake(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search Model"
          className="p-2 border border-gray-600 bg-gray-800 rounded w-full"
          onChange={(e) => setSearchModel(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search Price"
          className="p-2 border border-gray-600 bg-gray-800 rounded w-full"
          onChange={(e) => setSearchPrice(e.target.value)}
        />
        <select
          className="p-2 border border-gray-600 bg-gray-800 rounded w-full"
          onChange={(e) => setFilterElectric(e.target.value === "all" ? null : e.target.value === "true")}
        >
          <option value="all">All</option>
          <option value="true">Electric</option>
          <option value="false">Non-Electric</option>
        </select>
      </div>
      <div className="overflow-y-auto h-96 custom-scrollbar">
        <table className="w-full border border-gray-700 text-center">
          <thead className="sticky top-0 bg-gray-800">
            <tr>
              <th className="p-3">Make</th>
              <th className="p-3">Model</th>
              <th className="p-3">Price</th>
              <th className="p-3">Electric</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr key={index} className="border-b border-gray-700">
                <td className="p-3">{item.make}</td>
                <td className="p-3">{item.model}</td>
                <td className="p-3">${item.price.toLocaleString()}</td>
                <td className="p-3">{item.electric ? "✅" : "❌"}</td>
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
          <option value="10" selected>10</option>
          <option value="15">15</option>
        </select>
        <button
          className="px-4 py-2 bg-gray-700 rounded"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>
        <span>
          Page {page} of {Math.ceil(filteredData.length / pageSize)}
        </span>
        <button
          className="px-4 py-2 bg-gray-700 rounded"
          disabled={page * pageSize >= filteredData.length}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
      <style jsx>{`
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
      `}</style>
    </div>
  );
};

export default AgTable;
