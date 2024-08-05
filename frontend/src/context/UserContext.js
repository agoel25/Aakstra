import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState(null);
  const [services, setServices] = useState(null);
  const [instances, setInstances] = useState(null);
  const [billingDetails, setBillingDetails] = useState([]);
  const [customerDetails, setCustomerDetails] = useState([]);

  const signup = async (userInfo) => {
    const params = {
      email: userInfo.email,
      name: userInfo.name,
      phoneNumber: userInfo.phoneNumber,
      password: userInfo.password,
      address: userInfo.address,
    };
    try {
      await axios.post("http://localhost:8080/api/signup", null, { params });
      const response = await getCustomerDetailsByEmail(userInfo.email);
      setUser(response[0]);
      return response;
    } catch (error) {
      throw new Error(error.response);
    }
  };

  const login = async (email, password) => {
    const params = { email, password };
    try {
      const response = await axios.post("http://localhost:8080/api/login", null, { params });
      if (response.status === 200) {
        const customerDetails = await getCustomerDetailsByEmail(email);
        setUser(customerDetails[0]);
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
      partnerEmail: projectInfo.partnerEmail,
    };
    try {
      const response = await axios.post("http://localhost:8080/api/addProject", null, { params });
      return response.data;
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

    try {
      const response = await axios.post("http://localhost:8080/api/addInstance", null, { params });
      return response.data;
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

  const getBillingDetailsByEmail = async (email) => {
    try {
      const response = await axios.get("http://localhost:8080/api/getBillingDetails", { params: { email } });
      setBillingDetails(response.data);
      return response.data;
    } catch (error) {
      throw new Error(error.response);
    }
  };

  const getCustomerDetailsByEmail = async (email) => {
    try {
      const response = await axios.get("http://localhost:8080/api/getCustomerDetails", { params: { email } });
      setCustomerDetails(response.data);
      return response.data;
    } catch (error) {
      throw new Error(error.response);
    }
  };

  const updateProject = async (projectInfo) => {
    const params = {
      projectId: projectInfo.projectId,
      name: projectInfo.name,
      description: projectInfo.description,
      creationDate: projectInfo.creationDate.substring(0, 10),
      status: projectInfo.status,
      partnerEmail: projectInfo.partnerEmail,
    };
    try {
      const response = await axios.put("http://localhost:8080/api/updateProject", null, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response);
    }
  };

  const projection = async (attributes, relation, numAttributes) => {
    const params = { attributes, relation, numAttributes };
    try {
      const response = await axios.get("http://localhost:8080/api/projection", { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response);
    }
  };

  return (
    <UserContext.Provider value={{
      user, setUser, signup, login, addProject, addCard, addInstance, addService, setProjects,
      projects, services, instances, billingDetails, getProjectsByEmail, getServicesByProjectID, getInstancesByServiceID, getBillingDetailsByEmail, getCustomerDetailsByEmail, updateProject, projection
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
