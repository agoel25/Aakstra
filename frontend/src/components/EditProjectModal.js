import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useUser } from "@/context/UserContext";

const EditProjectModal = ({ isOpen, onClose, project, handleEditProject }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [status, setStatus] = useState('');
  const [creationDate, setCreationDate] = useState('');

  const { updateProject } = useUser();

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description);
      setPartnerEmail(project.partnerEmail);
      setStatus(project.status);
      setCreationDate(project.creationDate);
    }
  }, [project]);

  const handleUpdate = async () => {
    const projectData = {
      projectId: project.id,
      name,
      description,
      partnerEmail,
      status,
      creationDate,
    };

    try {
      await updateProject(projectData);
      handleEditProject();
      onClose();
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4">Edit Project</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
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
      <input
        type="text"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
        placeholder="Enter status"
      />
      <button
        onClick={handleUpdate}
        className="bg-indigo-800 hover:bg-indigo-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Update Project
      </button>
    </Modal>
  );
};

export default EditProjectModal;
