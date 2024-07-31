import React, { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/solid';

const awsServices = ['EC2', 'Lambda', 'S3', 'RDS', 'DynamoDB'];

const getRandomId = () => Math.floor(Math.random() * 100000);

const ProjectContent = ({ project }) => {
  const [isCreatingInstance, setIsCreatingInstance] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [instances, setInstances] = useState({});
  const [collapsedServices, setCollapsedServices] = useState({});
  const [newService, setNewService] = useState('');

  const handleCreateInstance = (instance) => {
    const newInstance = {
      ...instance,
      id: getRandomId(),
      launchDate: new Date().toLocaleString(),
      status: 'Running',
    };

    setInstances({
      ...instances,
      [selectedService]: [...(instances[selectedService] || []), newInstance],
    });

    setCollapsedServices({
      ...collapsedServices,
      [selectedService]: false, // Automatically expand the section when a new instance is added
    });
  };

  const handleDeleteInstance = (service, index) => {
    setInstances({
      ...instances,
      [service]: instances[service].filter((_, i) => i !== index),
    });
  };

  const handleAddService = (service) => {
    if (service && !project.services.includes(service)) {
      project.services.push(service);
      setNewService('');
    }
  };

  const handleDeleteService = (service) => {
    const updatedServices = project.services.filter((s) => s !== service);
    const updatedInstances = { ...instances };
    delete updatedInstances[service];

    project.services = updatedServices;
    setInstances(updatedInstances);
  };

  const toggleCollapse = (service) => {
    setCollapsedServices({
      ...collapsedServices,
      [service]: !collapsedServices[service],
    });
  };

  if (!project) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">{project.name}</h1>
      <p className="text-gray-700">{project.description}</p>
      {project.securityConfiguration && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Security Configuration</h2>
          <p className="text-gray-700">{`${project.securityConfiguration.type}: ${project.securityConfiguration.name}`}</p>
        </div>
      )}
      {project.services && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Services</h2>
          <ul className="list-inside">
            {project.services.map((service, index) => (
              <li key={index} className="text-gray-700 mb-4 bg-white p-4 border-gray-300 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold">{service}</span>
                  <div>
                    <button
                      className="ml-2 bg-indigo-800 hover:bg-indigo-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      onClick={() => {
                        setSelectedService(service);
                        setIsCreatingInstance(true);
                      }}
                    >
                      Add Instance
                    </button>
                    <button
                      className="ml-2 text-gray-700 focus:outline-none"
                      onClick={() => toggleCollapse(service)}
                    >
                      {collapsedServices[service] ? '▼' : '▲'}
                    </button>
                    <button
                      className="ml-2 text-red-600 hover:text-red-800 focus:outline-none"
                      onClick={() => handleDeleteService(service)}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                {!collapsedServices[service] && instances[service] && instances[service].length > 0 && (
                  <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">Instance ID</th>
                        <th className="py-2 px-4 border-b">Type</th>
                        <th className="py-2 px-4 border-b">Cost</th>
                        <th className="py-2 px-4 border-b">Launch Date</th>
                        <th className="py-2 px-4 border-b">Status</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {instances[service].map((instance, i) => (
                        <tr key={i}>
                          <td className="py-2 px-4 border-b">{instance.id}</td>
                          <td className="py-2 px-4 border-b">{`${instance.type.charAt(0).toUpperCase() + instance.type.slice(1)}`}</td>
                          <td className="py-2 px-4 border-b">{instance.cost}</td>
                          <td className="py-2 px-4 border-b">{instance.launchDate}</td>
                          <td className="py-2 px-4 border-b">{instance.status}</td>
                          <td className="py-2 px-4 border-b">
                            <button
                              className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                              onClick={() => handleDeleteInstance(service, i)}
                            >
                              Delete Instance
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </li>
            ))}
          </ul>
          <div className="mb-4 flex items-center mt-4">
            <select
              onChange={(e) => setNewService(e.target.value)}
              value={newService}
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
            >
              <option value="">Select Service</option>
              {awsServices.map((service) => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
            <button
              className="bg-indigo-800 hover:bg-indigo-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => handleAddService(newService)}
            >
              Add Service
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectContent;
