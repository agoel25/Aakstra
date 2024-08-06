import { createContext, useState, useContext } from "react";
import axios from "axios";

const UserContext = createContext();

const sqlKeywords = [
  "SELECT",
  "INSERT",
  "UPDATE",
  "DELETE",
  "DROP",
  "TRUNCATE",
  "ALTER",
  "CREATE",
  "REPLACE",
  "EXECUTE",
  "EXEC",
  "--",
  "*",
  ";",
  "GRANT",
  "REVOKE",
  "DENY",
  "MERGE",
  "COMMENT",
  "ANALYZE",
  "COMMIT",
  "ROLLBACK",
  "SAVEPOINT",
  "LOCK",
  "UNLOCK",
  "SET",
  "SHOW",
  "USE",
  "DESCRIBE",
  "EXPLAIN",
  "FLUSH",
  "KILL",
  "LOAD",
  "OPTIMIZE",
  "PURGE",
  "RENAME",
  "REPAIR",
  "RESET",
  "SHUTDOWN",
  "START",
  "STOP",
  "CALL",
  "ALTER SESSION",
  "ALTER SYSTEM",
];

const sanitizeSQL = (param) => {
  const isSQLInjection = (value) => {
    if (typeof value === "string") {
      const upperValue = value.toUpperCase();
      return sqlKeywords.some((keyword) => upperValue.includes(keyword));
    }
    return false;
  };

  if (typeof param === "string") {
    if (isSQLInjection(param)) {
      alert("Potential SQL Injection detected");
      throw new Error("Potential SQL Injection detected");
    }
    return param;
  }

  if (typeof param === "object" && param !== null) {
    const sanitizedObj = {};
    for (const key in param) {
      sanitizedObj[key] = sanitizeSQL(param[key]);
    }
    return sanitizedObj;
  }

  return param;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState(null);
  const [services, setServices] = useState(null);
  const [instances, setInstances] = useState(null);
  const [customerDetails, setCustomerDetails] = useState([]);

  const signup = async (userInfo) => {
    const params = sanitizeSQL({
      email: userInfo.email,
      name: userInfo.name,
      phoneNumber: userInfo.phoneNumber,
      password: userInfo.password,
      address: userInfo.address,
    });
    try {
      await axios.post("http://localhost:8080/api/signup", null, { params });
      const response = await getCustomerDetailsByEmail(userInfo.email);
      setUser(response[0]);
      return response;
    } catch (error) {
      alert(error.response.data);
      throw new Error(error.response.data);
    }
  };

  const login = async (email, password) => {
    const params = sanitizeSQL({ email, password });
    try {
      const response = await axios.post(
        "http://localhost:8080/api/login",
        null,
        { params }
      );
      if (response.status === 200) {
        const customerDetails = await getCustomerDetailsByEmail(email);
        setUser(customerDetails[0]);
      }
      return response.data;
    } catch (error) {
      alert(error.response.data);
      throw new Error(error.response.data);
    }
  };

  const addProject = async (projectInfo) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    const creationDateString = `"${formattedDate}"`;
    const params = sanitizeSQL({
      email: projectInfo.email,
      name: projectInfo.name,
      description: projectInfo.description,
      creationDate: "2024-08-05",
      status: "active",
      partnerEmail: projectInfo.partnerEmail,
    });
    try {
      const response = await axios.post(
        "http://localhost:8080/api/addProject",
        null,
        { params }
      );

      alert("Project Created Successfully");
      return response.data;
    } catch (error) {
      alert(error.response.data);
      throw new Error(error.response.data);
    }
  };

  const addInstance = async (instanceInfo) => {
    const params = sanitizeSQL({
      serverID: instanceInfo.serverID,
      name: instanceInfo.name,
      projectID: instanceInfo.projectID,
      type: instanceInfo.type,
      totalCost: instanceInfo.totalCost,
      status: instanceInfo.status,
      launchDate: instanceInfo.launchDate,
      stopDate: instanceInfo.stopDate,
    });

    try {
      const response = await axios.post(
        "http://localhost:8080/api/addInstance",
        null,
        { params }
      );
      return response.data;
    } catch (error) {
      alert(error.response.data);
      throw new Error(error.response.data);
    }
  };

  const addService = async (serviceInfo) => {
    const params = sanitizeSQL({
      projectID: serviceInfo.projectID,
      name: serviceInfo.name,
    });
    try {
      const response = await axios.post(
        "http://localhost:8080/api/addProjectService",
        null,
        { params }
      );
      const newService = { ...params, id: response.data.id };
      setServices([...services, newService]);
      return newService;
    } catch (error) {
      alert(error.response.data);
      throw new Error(error.response.data);
    }
  };

  const getProjectsByEmail = async (email) => {
    const params = sanitizeSQL({ email });
    try {
      const response = await axios.get(
        "http://localhost:8080/api/getProjects",
        { params }
      );
      return response.data;
    } catch (error) {
      alert(error.response.data);
      throw new Error(error.response.data);
    }
  };

  const getServicesByProjectID = async (projectID) => {
    const params = sanitizeSQL({ projectID: projectID });
    try {
      const response = await axios.get(
        "http://localhost:8080/api/getServices",
        { params }
      );
      return response.data;
    } catch (error) {
      alert(error.response.data);
      throw new Error(error.response.data);
    }
  };

  const getInstancesByServiceID = async (projectID, serviceName) => {
    const params = sanitizeSQL({ projectID, name: serviceName });
    try {
      const response = await axios.get(
        "http://localhost:8080/api/getInstances",
        { params }
      );
      return response.data;
    } catch (error) {
      alert(error.response.data);
      throw new Error(error.response.data);
    }
  };

  const getCustomerDetailsByEmail = async (email) => {
    const params = sanitizeSQL({ email });
    try {
      const response = await axios.get(
        "http://localhost:8080/api/getCustomerDetails",
        { params }
      );
      setCustomerDetails(response.data);
      return response.data;
    } catch (error) {
      alert(error.response.data);
      throw new Error(error.response.data);
    }
  };

  const updateProject = async (projectInfo) => {
    const params = sanitizeSQL({
      projectId: projectInfo.projectId,
      name: projectInfo.name,
      description: projectInfo.description,
      creationDate: projectInfo.creationDate.substring(0, 10),
      status: projectInfo.status,
      partnerEmail: projectInfo.partnerEmail,
      oldName: projectInfo.oldName,
    });
    try {
      const response = await axios.put(
        "http://localhost:8080/api/updateProject",
        null,
        { params }
      );
      alert("Project Updated Successfully");
      return response.data;
    } catch (error) {
      alert(error.response.data);
      throw new Error(error.response.data);
    }
  };

  const projection = async (attributes, relation, numAttributes) => {
    const params = { attributes, relation, numAttributes };
    try {
      const response = await axios.get("http://localhost:8080/api/projection", {
        params,
      });
      return response.data;
    } catch (error) {
      alert(error.response.data);
      throw new Error(error.response.data);
    }
  };

  const selection = async (table, whereClause) => {
    const params = { whereQuery: whereClause };
    try {
      const response = await axios.get("http://localhost:8080/api/selection", {
        params,
      });
      return response.data;
    } catch (error) {
      alert(error.response.data);
      throw new Error(error.response.data);
    }
  };

  const getCostPerInstanceType = async (projectID) => {
    const params = sanitizeSQL({ projectID });
    try {
      const response = await axios.get(
        "http://localhost:8080/api/getCostPerInstanceType",
        { params }
      );
      return response.data;
    } catch (error) {
      alert(error.response.data);
      throw new Error(error.response.data);
    }
  };

  const havingCount = async (projectID) => {
    const params = sanitizeSQL({ projectID });
    try {
      const response = await axios.get(
        "http://localhost:8080/api/havingCount",
        { params }
      );
      return response.data;
    } catch (error) {
      alert(error.response.data);
      throw new Error(error.response.data);
    }
  };

  const deleteProject = async (projectID) => {
    const params = sanitizeSQL({ projectID });
    try {
      await axios.delete(`http://localhost:8080/api/deleteProject`, { params });
      alert("Project deleted successfully")
    } catch (error) {
      alert(error.response.data);
      throw new Error(error.response.data);
    }
  };

  const division = async (email) => {
    try {
      const response = await axios.get("http://localhost:8080/api/division", {
        params: { email },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response);
    }
  };

  const getNestedInstanceTypeCost = async (projectID) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/getNestedInstanceTypeCost",
        { params: { projectID } }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response);
    }
  };

  const getTableNames = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/getTableNames");
      return response.data;
    } catch (error) {
      alert(error.response.data);
      throw new Error(error.response);
    }
  };

  const getAttributeNames = async (relation) => {
    const params = relation;
    try {
      const response = await axios.get(
        "http://localhost:8080/api/getAttributeNames",
        { params }
      );
      return response.data;
    } catch (error) {
      alert(error.response);
      throw new Error(error.response);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        signup,
        login,
        addProject,
        addInstance,
        addService,
        setProjects,
        projects,
        services,
        instances,
        getProjectsByEmail,
        getServicesByProjectID,
        getInstancesByServiceID,
        getCustomerDetailsByEmail,
        updateProject,
        projection,
        selection,
        getCostPerInstanceType,
        havingCount,
        deleteProject,
        division,
        getNestedInstanceTypeCost,
        getTableNames,
        getAttributeNames,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
