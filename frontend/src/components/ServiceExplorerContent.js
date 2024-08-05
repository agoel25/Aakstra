import React, { useState } from "react";
import { useUser } from "@/context/UserContext";

const serviceDetailsAttributes = [
  "Name",
  "Type",
  "Description",
  "Status",
  "CostPerUnit",
];

const ServiceExplorerContent = () => {
  const [conditions, setConditions] = useState([]);
  const [selectionResult, setSelectionResult] = useState([]);
  const { selection } = useUser();

  const handleAddCondition = () => {
    setConditions([
      ...conditions,
      { attribute: "", value: "", operator: "AND" },
    ]);
  };

  const handleConditionChange = (index, field, value) => {
    const newConditions = [...conditions];
    newConditions[index][field] = value;
    setConditions(newConditions);
  };

  const handleRemoveCondition = (index) => {
    const newConditions = conditions.filter((_, i) => i !== index);
    setConditions(newConditions);
  };

  const handleSelection = async () => {
    if (conditions.length > 0) {
      const whereClause = conditions
        .map((cond, index) => {
          const conditionString = `${cond.attribute}='${cond.value}'`;
          return index < conditions.length - 1
            ? `${conditionString} ${cond.operator}`
            : conditionString;
        })
        .join(" ");

      try {
        const result = await selection("ServiceDetails", whereClause);
        setSelectionResult(result);
      } catch (error) {
        console.error("Selection query failed:", error);
      }
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-2 text-gray-700">Admin Content</h2>
      <button
        onClick={handleAddCondition}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Add Condition
      </button>
      {conditions.map((condition, index) => (
        <div key={index} className="mb-4">
          <div className="flex items-center mb-2">
            <select
              value={condition.attribute}
              onChange={(e) =>
                handleConditionChange(index, "attribute", e.target.value)
              }
              className="border rounded w-1/4 py-2 px-3 text-gray-700 mr-2"
            >
              <option value="">Select an attribute</option>
              {serviceDetailsAttributes.map((attr) => (
                <option key={attr} value={attr}>
                  {attr}
                </option>
              ))}
            </select>
            <span className="mr-2">=</span>
            <input
              type="text"
              value={condition.value}
              onChange={(e) =>
                handleConditionChange(index, "value", e.target.value)
              }
              className="border rounded w-1/4 py-2 px-3 text-gray-700 mr-2"
              placeholder="Enter value"
            />
            {index < conditions.length - 1 && (
              <select
                value={condition.operator}
                onChange={(e) =>
                  handleConditionChange(index, "operator", e.target.value)
                }
                className="border rounded w-1/6 py-2 px-3 text-gray-700 mr-2"
              >
                <option value="AND">AND</option>
                <option value="OR">OR</option>
              </select>
            )}
            <button
              onClick={() => handleRemoveCondition(index)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <div>
        <button
          onClick={handleSelection}
          className="bg-indigo-800 text-white px-4 py-2 rounded mb-4"
        >
          Show
        </button>
      </div>
      {selectionResult.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-2 text-gray-700">
            Selection Result
          </h3>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                {serviceDetailsAttributes.map((attribute) => (
                  <th key={attribute} className="py-2 px-4 border-b">
                    {attribute}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {selectionResult.map((row, index) => (
                <tr key={index} className="border-b">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="py-2 px-4">
                      {cell}
                    </td>
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

export default ServiceExplorerContent;
