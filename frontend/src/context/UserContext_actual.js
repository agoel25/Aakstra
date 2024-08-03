/*import { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProviderActual = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchWithParams = async (url, params, method = "POST") => {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(params),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || "Request failed");
    }
  };

  const signup = async (userInfo) => {
    const params = {
      email: userInfo.email,
      name: userInfo.name,
      phoneNumber: userInfo.phoneNumber,
      password: userInfo.password,
      address: userInfo.address,
    };
    const data = await fetchWithParams("http://localhost:8080/api/signup", params);
    setUser(data);
  };

  const login = async (email, password) => {
    const params = { email, password };
    return await fetchWithParams("http://localhost:8080/api/login", params);
  };

  const addProject = async (projectInfo) => {
    const params = {
      email: projectInfo.email,
      name: projectInfo.name,
      description: projectInfo.description,
      creationDate: projectInfo.creationDate,
      status: projectInfo.status,
      partnerEmail: projectInfo.partnerEmail,
    };
    return await fetchWithParams("http://localhost:8080/api/addProject", params);
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
    return await fetchWithParams("http://localhost:8080/api/addCard", params);
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
    return await fetchWithParams("http://localhost:8080/api/addInstance", params);
  };

  const addProjectService = async (projectID, name) => {
    const params = { projectID, name };
    return await fetchWithParams("http://localhost:8080/api/addProjectService", params);
  };

  const addCustomerService = async (email, name) => {
    const params = { email, name };
    return await fetchWithParams("http://localhost:8080/api/addCustomerService", params);
  };

  return (
    <UserContext.Provider value={{
      user, setUser, signup, login, addProject, addCard, addInstance, addProjectService, addCustomerService
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserActual = () => useContext(UserContext);
*/