import React, { useState, useEffect } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import CreateInstanceModal from "./CreateInstanceModal";
import { useUser } from "@/context/UserContext";

const cloudServices = ['gamma', 'authIt', 'GPUb', 'RapidX', 'cSQL'];

const ProjectContent = ({ projectID }) => {
  const [isCreatingInstance, setIsCreatingInstance] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [newService, setNewService] = useState("");
  const [projectServices, setProjectServices] = useState([]);
  const [projectInstances, setProjectInstances] = useState([]);

  const { projects, addInstance, addService, getServicesByProjectID, getInstancesByServiceID } = useUser();

  const project = projects?.find((p) => p.id === projectID);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const services = await getServicesByProjectID(projectID);
        setProjectServices(services);

        const instances = await Promise.all(
          services.map(async (service) => {
            const serviceInstances = await getInstancesByServiceID(projectID, service.name);
            return serviceInstances;
          })
        );

        setProjectInstances(instances.flat());
      } catch (error) {
        console.error("Failed to fetch services or instances:", error);
      }
    };

    fetchData();
  }, [projectID, getServicesByProjectID, getInstancesByServiceID]);

  const handleCreateInstance = async (instance) => {

    const randomCost = Math.floor(Math.random() * (201 - 100)) + 100;

    const newInstance = {
      serverID: "101",
      name: selectedService.name,
      projectID:  projectID,
      type: instance.type,
      totalCost: randomCost,
      status: 'running',
      launchDate: '2024-04-04',
      stopDate: '2024-05-05',
    };
    
  
    try {
      await addInstance({ ...newInstance });
  
      const updatedInstances = await getInstancesByServiceID(projectID, selectedService.name);
      setProjectInstances(updatedInstances);
    } catch (error) {
      console.error("Failed to create instance:", error);
    }
  };
  

  const handleDeleteInstance = async (serviceId, index) => {
    try {

    } catch (error) {
      console.error("Failed to delete instance:", error);
    }
  };

  const handleAddService = async (service) => {
    if (service && !projectServices.find((s) => s.name === service)) {
      try {
        await addService({ projectID: projectID, name: service });
        const updatedServices = await getServicesByProjectID(projectID);
        setProjectServices(updatedServices);
        setNewService("");
      } catch (error) {
        console.error("Failed to add service:", error);
      }
    }
  };

  const handleDeleteService = async (serviceId) => {
    try {
    } catch (error) {
      console.error("Failed to delete service:", error);
    }
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
          <p className="text-gray-700">{`${project.securityConfiguration}: ${project.securityConfiguration}`}</p>
        </div>
      )}
      {projectServices.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Services</h2>
          <ul className="list-inside">
            {projectServices.map((service, index) => (
              <li
                key={index}
                className="text-gray-700 mb-4 bg-white p-4 border-gray-300 border rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold">{service.name}</span>
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
                  </div>
                </div>
                {true &&
                  projectInstances.filter((i) => i.serviceID === service.id).length > 0 && (
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
                        {projectInstances
                          .filter((i) => i.serviceID === service.id)
                          .map((instance, i) => (
                            <tr key={i}>
                              <td className="py-2 px-4 border-b">{instance?.id}</td>
                              <td className="py-2 px-4 border-b">{instance?.type}</td>
                              <td className="py-2 px-4 border-b">{instance?.totalCost}</td>
                              <td className="py-2 px-4 border-b">{instance?.launchDate}</td>
                              <td className="py-2 px-4 border-b">{instance?.status}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  )}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mb-4 flex items-center mt-4">
        <select
          onChange={(e) => setNewService(e.target.value)}
          value={newService}
          className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
        >
          <option value="">Select Service</option>
          {cloudServices
            .filter((service) => !projectServices.find((s) => s.name === service))
            .map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
        </select>
        <button
          className="bg-indigo-800 hover:bg-indigo-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={() => handleAddService(newService)}
          disabled={projectServices.find((s) => s.name === newService) || newService === ""}
        >
          Add Service
        </button>
      </div>
      <CreateInstanceModal
        isOpen={isCreatingInstance}
        onClose={() => setIsCreatingInstance(false)}
        handleCreateInstance={handleCreateInstance}
      />
    </div>
  );
};

export default ProjectContent;
