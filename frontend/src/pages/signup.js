import { useState } from "react";
import { useRouter } from "next/router";
import { Inter } from "next/font/google";
import { useUser } from "@/context/UserContext";

const inter = Inter({ subsets: ["latin"] });

export default function Signup() {
  const [step, setStep] = useState(1);
  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    password: ""
  });
  const [billingInfo, setBillingInfo] = useState({
    creditCard: "",
    expiryDate: "",
    cvv: ""
  });

  const { signup, addBillingDetails } = useUser();
  const router = useRouter();

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addBillingDetails(billingInfo);
    router.push("/dashboard");
  };

  return (
    <main className="flex min-h-screen">
      <div className="w-1/2 bg-indigo-900 flex items-start justify-start p-8">
        <h1 className="text-white text-2xl font-bold">AAK Cloud Services</h1>
      </div>
      <div className="w-1/2 flex items-center justify-center bg-gray-100">
        <div className="border border-gray-300 p-8 rounded-lg bg-white shadow-md w-full max-w-md">
          {step === 1 && (
            <>
              <h1 className="text-2xl font-bold mb-2">Sign Up</h1>
              <p className="text-gray-600 mb-4">Create an account to access our Cloud Service Provider</p>
              <form>
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
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={userInfo.phone}
                    onChange={handleChange}
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
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter your password"
                  />
                </div>
                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      signup(userInfo);
                      handleNextStep();
                    }}
                    className="bg-indigo-800 hover:bg-indigo-900 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline"
                  >
                    Next
                  </button>
                </div>
              </form>
            </>
          )}
          {step === 2 && (
            <>
              <h1 className="text-2xl font-bold mb-2">Billing Details</h1>
              <form onSubmit={handleSubmit}>
                <label htmlFor="credit-card" className="block text-gray-700 text-sm font-bold mb-2">
                  Credit Card Number
                </label>
                <input
                  type="text"
                  id="credit-card"
                  name="creditCard"
                  value={billingInfo.creditCard}
                  onChange={handleBillingChange}
                  className="w-full py-2 px-3 mb-4 border rounded focus:outline-none focus:shadow-outline"
                  placeholder="Enter your credit card number"
                />
                <label htmlFor="expiry-date" className="block text-gray-700 text-sm font-bold mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  id="expiry-date"
                  name="expiryDate"
                  value={billingInfo.expiryDate}
                  onChange={handleBillingChange}
                  className="w-full py-2 px-3 mb-4 border rounded focus:outline-none focus:shadow-outline"
                  placeholder="MM/YY"
                />
                <label htmlFor="cvv" className="block text-gray-700 text-sm font-bold mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={billingInfo.cvv}
                  onChange={handleBillingChange}
                  className="w-full py-2 px-3 mb-4 border rounded focus:outline-none focus:shadow-outline"
                  placeholder="CVV"
                />
                <div className="flex items-center justify-between mt-4">
                  <button
                    type="button"
                    onClick={handlePreviousStep}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-800 hover:bg-indigo-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Complete Signup and Pay
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
