import { useState } from "react";
import { useRouter } from "next/router";
import { Inter } from "next/font/google";
import { useUser } from "@/context/UserContext_actual";

const inter = Inter({ subsets: ["latin"] });

export default function Signup() {
  const [userInfo, setUserInfo] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    address: "",
    password: ""
  });

  const { signup } = useUser();
  const router = useRouter();

  const validateUserInfo = () => {
    const { name, phoneNumber, email, address, password } = userInfo;

    if (!name || !phoneNumber || !email || !address || !password) {
      alert("Please fill in all the fields.");
      return false;
    }

    if (!/^\d+$/.test(phoneNumber)) {
      alert("Please enter a valid phone number (numbers only).");
      return false;
    }

    if (!email.includes("@") || email.length > 50 || email.length < 5) {
      alert("Please enter a valid email address.");
      return false;
    }

    if (name.length > 50) {
      alert("Name should not exceed 50 characters.");
      return false;
    }

    if (phoneNumber.length > 15) {
      alert("Phone number should not exceed 15 digits.");
      return false;
    }

    if (address.length > 100) {
      alert("Address should not exceed 100 characters.");
      return false;
    }

    if (password.length > 50) {
      alert("Password should not exceed 50 characters.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateUserInfo()) {
      try {
        await signup(userInfo);
        alert("User signed up successfully");
        router.push("/dashboard");
      } catch (error) {
        alert("Failed to sign up. Please try again.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <main className="flex min-h-screen">
      <div className="w-1/2 bg-indigo-900 flex items-start justify-start p-8">
        <h1 className="text-white text-2xl font-bold">AAK Cloud Services</h1>
      </div>
      <div className="w-1/2 flex items-center justify-center bg-gray-100">
        <div className="border border-gray-300 p-8 rounded-lg bg-white shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-2">Sign Up</h1>
          <p className="text-gray-600 mb-4">Create an account to access our Cloud Service Provider</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={userInfo.name}
                onChange={handleChange}
                maxLength="50"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={userInfo.phoneNumber}
                onChange={handleChange}
                maxLength="15"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your phone number"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={userInfo.email}
                onChange={handleChange}
                maxLength="50"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={userInfo.address}
                onChange={handleChange}
                maxLength="100"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your address"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={userInfo.password}
                onChange={handleChange}
                maxLength="50"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your password"
              />
            </div>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-indigo-800 hover:bg-indigo-900 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
