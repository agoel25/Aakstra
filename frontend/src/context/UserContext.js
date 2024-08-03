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

  const signup = async (userInfo) => {
    const params = {
      email: userInfo.email,
      name: userInfo.name,
      phoneNumber: userInfo.phoneNumber,
      password: userInfo.password,
      address: userInfo.address,
    };
    try {
      const response = await axios.post("http://localhost:8080/api/signup", null, { params });
      setUser({ email: params.email, name: params.name });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };

  const login = async (email, password) => {
    const params = { email, password };
    try {
      const response = await axios.post("http://localhost:8080/api/login", null, { params });
      if (response.status === 200) {
        setUser({ email, name: "Test User" });
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };

  const addProject = async (projectInfo) => {
    const params = {
      email: projectInfo.email,
      name: projectInfo.name,
      description: projectInfo.description,
      creationDate: "2011-02-27",
      status: "active",
      partnerEmail: "john.doe@dummy.com",
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
    try {
      const response = await axios.get("http://localhost:8080/api/getServices", { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };

  const getInstancesByServiceID = async (serviceID) => {
    const params = { serviceID };
    try {
      const response = await axios.get("http://localhost:8080/api/getInstances", { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
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
