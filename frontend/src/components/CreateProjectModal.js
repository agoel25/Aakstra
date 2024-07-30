import React, { useState } from 'react';
import Modal from './Modal';
import { TrashIcon } from '@heroicons/react/24/solid';

const awsServices = ['EC2', 'Lambda', 'S3', 'RDS', 'DynamoDB'];

const CreateProjectModal = ({ isOpen, onClose, newProjectName, setNewProjectName, handleCreateProject }) => {
  const [description, setDescription] = useState('');
  const [securityConfiguration, setSecurityConfiguration] = useState(null);
  const [securityConfigType, setSecurityConfigType] = useState('');
  const [securityConfigName, setSecurityConfigName] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);

  const handleAddSecurityConfig = () => {
    if (securityConfigType && securityConfigName) {
      setSecurityConfiguration({ type: securityConfigType, name: securityConfigName });
      setSecurityConfigType('');
      setSecurityConfigName('');
    }
  };

  const handleAddService = (service) => {
    if (service && !selectedServices.includes(service)) {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleRemoveService = (service) => {
    setSelectedServices(selectedServices.filter(s => s !== service));
  };

  const handleCreate = () => {
    const projectData = {
      name: newProjectName,
      description,
      securityConfiguration,
      services: selectedServices,
    };
    handleCreateProject(projectData);
    setDescription('');
    setSecurityConfiguration(null);
    setSelectedServices([]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
      <input
        type="text"
        value={newProjectName}
        onChange={(e) => setNewProjectName(e.target.value)}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
        placeholder="Enter project name"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
        placeholder="Enter project description"
        rows={3}
      />
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">Security Configuration</h3>
        <div className="flex items-center mb-2">
          <select
            value={securityConfigType}
            onChange={(e) => setSecurityConfigType(e.target.value)}
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
          >
            <option value="">Select Type</option>
            <option value="inbound">Inbound</option>
            <option value="outbound">Outbound</option>
            <option value="inbound/outbound">Inbound/Outbound</option>
          </select>
          <input
            type="text"
            value={securityConfigName}
            onChange={(e) => setSecurityConfigName(e.target.value)}
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
            placeholder="Enter configuration name"
          />
          <button
            onClick={handleAddSecurityConfig}
            className="bg-indigo-800 hover:bg-indigo-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add
          </button>
        </div>
        {securityConfiguration && (
          <div className="bg-gray-100 p-3 rounded-lg">
            <p className="text-gray-700">{`${securityConfiguration.type}: ${securityConfiguration.name}`}</p>
          </div>
        )}
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">Services</h3>
        <div className="flex items-center mb-2">
          <select
            onChange={(e) => handleAddService(e.target.value)}
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
          >
            <option value="">Select Service</option>
            {awsServices.map((service) => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </div>
        <ul className="list-disc list-inside">
          {selectedServices.map((service, index) => (
            <li key={index} className="flex justify-between items-center text-gray-700 mb-2">
              {service}
              <button onClick={() => handleRemoveService(service)} className="ml-2 text-red-600 hover:text-red-800 focus:outline-none">
                <TrashIcon className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={handleCreate}
        className="bg-indigo-800 hover:bg-indigo-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Create Project
      </button>
    </Modal>
  );
};

export default CreateProjectModal;
