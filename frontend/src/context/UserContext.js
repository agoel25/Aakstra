import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState(null);
  const [services, setServices] = useState(null);
  const [instances, setInstances] = useState(null);
  const [billingDetails, setBillingDetails] = useState([]);



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
      throw new Error(error.response);
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
      throw new Error(error.response);
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
    } catch (error) {
      throw new Error(error.response);
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
      throw new Error(error.response);
    }
  };

  const addInstance = async (instanceInfo) => {
    const params = {
      serverID: instanceInfo.serverID,
      name: instanceInfo.name,
      projectID:  instanceInfo.projectID,
      type: instanceInfo.type,
      totalCost: instanceInfo.totalCost,
      status: instanceInfo.status,
      launchDate: instanceInfo.launchDate,
      stopDate: instanceInfo.stopDate,
    };


    console.log(params)


    try {
      const response = await axios.post("http://localhost:8080/api/addInstance", null, { params });
      return newInstance;
    } catch (error) {
      throw new Error(error.response);
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
      throw new Error(error.response);
    }
  };

  const getProjectsByEmail = async (email) => {
    try {
      const response = await axios.get("http://localhost:8080/api/getProjects", { params: { email } });
      return response.data;
    } catch (error) {
      throw new Error(error.response);
    }
  };

  const getServicesByProjectID = async (projectID) => {
    const params = { projectID: projectID };
    try {
      const response = await axios.get("http://localhost:8080/api/getServices", { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response);
    }
  };

  const getInstancesByServiceID = async (projectID, serviceName) => {
    const params = { projectID, name: serviceName };
    try {
      const response = await axios.get("http://localhost:8080/api/getInstances", { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response);
    }
  };

  return (
    <UserContext.Provider value={{
      user, setUser, signup, login, addProject, addCard, addInstance, addService, setProjects,
      projects, services, instances, billingDetails, getProjectsByEmail, getServicesByProjectID, getInstancesByServiceID
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
