import { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signup = async (userInfo) => {
    try {
      const response = await fetch("http://localhost:8080/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email: userInfo.email,
          name: userInfo.name,
          phoneNumber: userInfo.phone,
          password: userInfo.password,
          address: userInfo.address,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert("User Created Successfully");
        setUser(data);
      } else {
        alert("User Creation Failed");
        console.error("Signup failed");
      }
    } catch {
        alert("User Creation Failed");
    }
  };

  const addBillingDetails = (billingInfo) => {
    setUser((prevUser) => ({ ...prevUser, billing: billingInfo }));
  };

  return (
    <UserContext.Provider value={{ user, setUser, signup, addBillingDetails }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
