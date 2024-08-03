import React, { useState } from 'react';
import Modal from './Modal';
import { TrashIcon } from '@heroicons/react/24/solid';
import { useUser } from "@/context/UserContext";


const CreateProjectModal = ({ isOpen, onClose, newProjectName, setNewProjectName, handleCreateProject }) => {
  const [description, setDescription] = useState('');
  const [securityConfiguration, setSecurityConfiguration] = useState(null);
  const [securityConfigType, setSecurityConfigType] = useState('');
  const [securityConfigName, setSecurityConfigName] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);

  const { user, addProject, addService } = useUser();

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

  const handleCreate = async () => {
    if (!user || !user.email) {
      console.error("User not logged in");
      return;
    }

    const projectData = {
      email: user.email,
      name: newProjectName,
      description,
    };

    try {
      const newProject = await addProject(projectData);

      for (const service of selectedServices) {
        await addService({ projectID: newProject.id, name: service });
      }

      handleCreateProject();
      setNewProjectName('');
      setDescription('');
      setSecurityConfiguration(null);
      setSelectedServices([]);
      onClose();
    } catch (error) {
      console.error("Failed to create project:", error);
    }
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
