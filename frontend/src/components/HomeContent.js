import React from 'react';
import { TrashIcon } from "@heroicons/react/24/solid";

const HomeContent = ({ defaultProject, projects, onProjectClick, onViewProject, onEditProject, onDeleteProject }) => (
  <>
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-2 text-gray-700">Your Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 h-48">
        <div className="relative border border-gray-300 p-4 rounded-lg bg-white shadow-md">
          <h3 className="text-xl font-bold mb-2">{defaultProject.name}</h3>
          <p className="text-gray-700">{defaultProject.description}</p>
          <button
            className="absolute bottom-4 left-4 bg-indigo-800 hover:bg-indigo-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => onViewProject(defaultProject)}
          >
            View
          </button>
        </div>
      </div>
    </div>

    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-2 text-gray-700">Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {projects && projects.map((project) => (
          <div key={project.id} className="relative border border-gray-300 p-4 h-48 rounded-lg bg-white shadow-md">
            <h3 className="text-xl font-bold mb-2">{project.name}</h3>
            <p className="text-gray-700">{project.description}</p>
            <button
              className="absolute bottom-4 left-4 bg-indigo-800 hover:bg-indigo-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => onViewProject(project)}
            >
              View
            </button>
            <button
              className="absolute bottom-4 right-16 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded"
              onClick={() => onEditProject(project)}
            >
              Edit
            </button>
            <button
              className="absolute bottom-4 right-4 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
              onClick={() => onDeleteProject(project)}
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        ))}
        <div
          onClick={onProjectClick}
          className="border border-dashed border-gray-300 p-4 h-48 rounded-lg bg-white shadow-md flex items-center justify-center cursor-pointer"
        >
          <span className="text-6xl text-gray-300">+</span>
        </div>
      </div>
    </div>
  </>
);

export default HomeContent;
