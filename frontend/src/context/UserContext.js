import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

const initialProjects = [
  { id: 1, email: "test@example.com", name: "Project A", description: "Description A", securityConfiguration: "Config A" },
  { id: 2, email: "test2@example.com", name: "Project B", description: "Description B" },
];

const initialServices = [
  { id: 1, projectID: 1, name: "EC2" },
  { id: 2, projectID: 1, name: "Lambda" },
  { id: 3, projectID: 2, name: "S3" },
];

const initialInstances = [
  { id: 1, serviceID: 1, name: "Instance 1", type: "t2.micro", totalCost: 10, status: "Running", launchDate: "2023-01-01", stopDate: "" },
  { id: 2, serviceID: 2, name: "Instance 2", type: "t2.large", totalCost: 20, status: "Stopped", launchDate: "2023-02-01", stopDate: "2023-02-10" },
  { id: 3, serviceID: 3, name: "Instance 3", type: "t2.medium", totalCost: 30, status: "Running", launchDate: "2023-03-01", stopDate: "" },
];

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState(initialProjects);
  const [services, setServices] = useState(initialServices);
  const [instances, setInstances] = useState(initialInstances);
  const [billingDetails, setBillingDetails] = useState([]);

  const generateRandomId = () => Math.floor(Math.random() * 10000) + 1;

  useEffect(() => {
    console.log(projects);
    console.log(services);
  }, [services]);

  const mockFetchWithParams = async (url, params, method = "POST") => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (url.includes("signup")) {
          const userData = { email: params.email, name: params.name };
          setUser(userData);
          resolve(userData);
        } else if (url.includes("login")) {
          if (params.email === "test@example.com" && params.password === "password") {
            const userData = { email: params.email, name: "Test User" };
            setUser(userData);
            resolve(userData);
          } else {
            reject(new Error("Login failed"));
          }
        } else if (url.includes("addProject")) {
          const projectData = { id: generateRandomId(), ...params };
          console.log("Project Created Successfully");
          setProjects([...projects, projectData]);
          resolve(projectData);
        } else if (url.includes("addCard")) {
          const billingData = { id: generateRandomId(), ...params };
          setBillingDetails([...billingDetails, billingData]);
          resolve(billingData);
        } else if (url.includes("addInstance")) {
          const instanceData = { id: generateRandomId(), ...params };
          setInstances([...instances, instanceData]);
          resolve(instanceData);
        } else if (url.includes("addService")) {
          const serviceData = { id: generateRandomId(), projectID: params.projectID, name: params.name };
          setServices(prevServices => [...prevServices, serviceData]);
          resolve(serviceData);
        } else if (url.includes("getProjectsByEmail")) {
          const projectsByEmail = projects.filter(project => project.email === params.email);
          resolve(projectsByEmail);
        } else if (url.includes("getServicesByProjectID")) {
          const servicesByProjectID = services.filter(service => service.projectID === params.projectID);
          resolve(servicesByProjectID);
        } else if (url.includes("getInstancesByServiceID")) {
          const instancesByServiceID = instances.filter(instance => instance.serviceID === params.serviceID);
          resolve(instancesByServiceID);
        } else {
          resolve(`Mock response from ${url}`);
        }
      }, 100);
    });
  };

  const signup = async (userInfo) => {
    const params = {
      email: userInfo.email,
      name: userInfo.name,
      phoneNumber: userInfo.phoneNumber,
      password: userInfo.password,
      address: userInfo.address,
    };
    return await mockFetchWithParams("http://localhost:8080/api/signup", params);
  };

  const login = async (email, password) => {
    const params = { email, password };
    return await mockFetchWithParams("http://localhost:8080/api/login", params);
  };

  const addProject = async (projectInfo) => {
    const params = {
      email: projectInfo.email,
      name: projectInfo.name,
      description: projectInfo.description,
      creationDate: new Date().toISOString(),
      status: "active",
      partnerEmail: "",
    };
    try {
      const response = await axios.post("http://localhost:8080/api/addProject", null, { params });
      const newProject = { ...params, id: response.data.id };
      setProjects([...projects, newProject]);
      return newProject;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };

  const addCard = async (billingInfo) => {
    const params = {
      cardNumber: billingInfo.cardNumber,
      email: billingInfo.email,
      cvv: billingInfo.cvv,
      postalCode: billingInfo.postalCode,
      city: billingInfo.city,
      country: billingInfo.country,
      expiryDate: billingInfo.expiryDate,
      paymentType: billingInfo.paymentType,
      isDefault: billingInfo.isDefault,
    };
    try {
      const response = await axios.post("http://localhost:8080/api/addCard", null, { params });
      const newBilling = { ...params, id: response.data.id };
      setBillingDetails([...billingDetails, newBilling]);
      return newBilling;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };

  const addInstance = async (instanceInfo) => {
    const params = {
      name: instanceInfo.name,
      serverID: instanceInfo.serverID,
      projectID: instanceInfo.projectID,
      type: instanceInfo.type,
      totalCost: instanceInfo.totalCost,
      status: instanceInfo.status,
      launchDate: instanceInfo.launchDate,
      stopDate: instanceInfo.stopDate,
    };
    try {
      const response = await axios.post("http://localhost:8080/api/addInstance", null, { params });
      const newInstance = { ...params, id: response.data.id };
      setInstances([...instances, newInstance]);
      return newInstance;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };

  const addService = async (serviceInfo) => {
    const params = { projectID: serviceInfo.projectID, name: serviceInfo.name };
    try {
      const response = await axios.post("http://localhost:8080/api/addProjectService", null, { params });
      const newService = { ...params, id: response.data.id };
      setServices([...services, newService]);
      return newService;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };

  const getProjectsByEmail = async (email) => {
    try {
      const response = await axios.get("http://localhost:8080/api/getProjects", { params: { email } });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };

  const getServicesByProjectID = async (projectID) => {
    const params = { projectID };
    return await mockFetchWithParams("http://localhost:8080/api/getServicesByProjectID", params, "GET");
  };

  const getInstancesByServiceID = async (serviceID) => {
    const params = { serviceID };
    return await mockFetchWithParams("http://localhost:8080/api/getInstancesByServiceID", params, "GET");
  };

  return (
    <UserContext.Provider value={{
      user, setUser, signup, login, addProject, addCard, addInstance, addService,
      projects, services, instances, billingDetails, getProjectsByEmail, getServicesByProjectID, getInstancesByServiceID
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
