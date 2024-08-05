import React, { useState } from "react";
import Modal from "./Modal";

const instanceTypes = [
  { type: "micro" },
  { type: "medium" },
  { type: "large" },
  { type: "xlarge" },
];

const CreateInstanceModal = ({ isOpen, onClose, handleCreateInstance }) => {
  const [selectedInstanceType, setSelectedInstanceType] = useState(
    instanceTypes[0]
  );

  const handleCreate = () => {
    handleCreateInstance(selectedInstanceType);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4">Create New Instance</h2>
      <select
        value={selectedInstanceType.type}
        onChange={(e) =>
          setSelectedInstanceType(
            instanceTypes.find((instance) => instance.type === e.target.value)
          )
        }
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
      >
        {instanceTypes.map((instance) => (
          <option key={instance.type} value={instance.type}>
            {`${
              instance.type.charAt(0).toUpperCase() + instance.type.slice(1)
            }`}
          </option>
        ))}
      </select>
      <button
        onClick={handleCreate}
        className="bg-indigo-800 hover:bg-indigo-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Create Instance
      </button>
    </Modal>
  );
};

export default CreateInstanceModal;
