import { useState } from "react";
import { useRouter } from "next/router";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Signup() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add your sign-up logic here
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
                  <label
                    htmlFor="name"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="phone"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="address"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter your address"
                  />
                </div>
                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={handleNextStep}
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
                <label
                  htmlFor="credit-card"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Credit Card Number
                </label>
                <input
                  type="text"
                  id="credit-card"
                  className="w-full py-2 px-3 mb-4 border rounded focus:outline-none focus:shadow-outline"
                  placeholder="Enter your credit card number"
                />
                <label
                  htmlFor="expiry-date"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Expiry Date
                </label>
                <input
                  type="text"
                  id="expiry-date"
                  className="w-full py-2 px-3 mb-4 border rounded focus:outline-none focus:shadow-outline"
                  placeholder="MM/YY"
                />
                <label
                  htmlFor="cvv"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  CVV
                </label>
                <input
                  type="text"
                  id="cvv"
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
