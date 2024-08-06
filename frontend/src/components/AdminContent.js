import React, { useState, useEffect } from 'react';
import { useUser } from "@/context/UserContext";

const AdminContent = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [availableAttributes, setAvailableAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [projectionResult, setProjectionResult] = useState([]);
  const { getTableNames, getAttributeNames, projection } = useUser();

  useEffect(() => {
    const fetchTableNames = async () => {
      try {
        const tableNames = await getTableNames();
        setTables(tableNames);
      } catch (error) {
        console.error("Error fetching table names:", error);
      }
    };

    fetchTableNames();
  }, [getTableNames]);

  const handleTableChange = async (event) => {
    const table = event.target.value;
    setSelectedTable(table);
    setSelectedAttributes([]);
    setProjectionResult([]);

    if (table) {
      try {
        const attributes = await getAttributeNames(table);
        setAvailableAttributes(attributes);
      } catch (error) {
        console.error("Error fetching attribute names:", error);
      }
    } else {
      setAvailableAttributes([]);
    }
  };

  const handleAttributeSelect = (event) => {
    const attribute = event.target.value;
    if (attribute && !selectedAttributes.includes(attribute)) {
      setSelectedAttributes([...selectedAttributes, attribute]);
    }
  };

  const handleRemoveAttribute = (attribute) => {
    setSelectedAttributes(selectedAttributes.filter(attr => attr !== attribute));
  };

  const handleProjection = async () => {
    if (selectedTable && selectedAttributes.length > 0) {
      const attributes = selectedAttributes.join(',');
      try {
        const result = await projection(attributes, selectedTable, selectedAttributes.length);
        setProjectionResult(result);
      } catch (error) {
        console.error("Projection query failed:", error);
      }
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-2 text-gray-700">Admin Content</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Select Table:</label>
        <select value={selectedTable} onChange={handleTableChange} className=" border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          <option value="">Select a table</option>
          {tables.map(table => (
            <option key={table} value={table}>{table}</option>
          ))}
        </select>
      </div>
      {selectedTable && (
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Select Attribute:</label>
          <select value="" onChange={handleAttributeSelect} className=" border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="">Select an attribute</option>
            {availableAttributes.map(attribute => (
              <option key={attribute} value={attribute}>{attribute}</option>
            ))}
          </select>
        </div>
      )}
      {selectedAttributes.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2 text-gray-700">Selected Attributes</h3>
          <ul>
            {selectedAttributes.map(attribute => (
              <li key={attribute} className="flex justify-between items-center mb-2">
                <span className="text-gray-700">{attribute}</span>
                <button onClick={() => handleRemoveAttribute(attribute)} className="bg-red-500 text-white px-2 py-1 rounded">
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={handleProjection} className="bg-indigo-800 text-white px-4 py-2 rounded mb-4">
        Show Attributes From Database
      </button>
      {projectionResult.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-2 text-gray-700">Projection Result</h3>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                {selectedAttributes.map(attribute => (
                  <th key={attribute} className="py-2 px-4 border-b">{attribute}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projectionResult.map((row, index) => (
                <tr key={index} className="border-b">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="py-2 px-4">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminContent;
