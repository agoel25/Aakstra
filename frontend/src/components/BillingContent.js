import React, { useState, useEffect } from 'react';
import AddBillingModal from './AddBillingModal';
import { useUser } from "@/context/UserContext";

const BillingContent = () => {
  const [isAddingBilling, setIsAddingBilling] = useState(false);
  const [billingDetails, setBillingDetails] = useState([]);
  const { addCard, user, getBillingDetailsByEmail } = useUser();

  useEffect(() => {
    const fetchBillingDetails = async () => {
      if (user && user.email) {
        try {
          const userBillingDetails = await getBillingDetailsByEmail(user.email);
          setBillingDetails(userBillingDetails);
        } catch (error) {
          console.error("Failed to fetch billing details:", error);
        }
      }
    };

    fetchBillingDetails();
  }, [user]);

  const handleAddBillingDetail = async (billingDetail) => {
    try {
      await addCard({ ...billingDetail, email: user.email });
      setIsAddingBilling(false);

      const userBillingDetails = await getBillingDetailsByEmail(user.email);
      setBillingDetails(userBillingDetails);
    } catch (error) {
      console.error("Failed to add billing detail:", error);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-2 text-gray-700">Billing</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {billingDetails.map((billing, index) => (
          <div key={index} className="relative border border-gray-300 p-4 h-48 rounded-lg bg-white shadow-md">
            <h3 className="text-xl font-bold mb-2">Billing Entry {index + 1}</h3>
            <p className="text-gray-700">Card Number: {billing.cardNumber}</p>
            <p className="text-gray-700">CVV: {billing.cvv}</p>
            <p className="text-gray-700">Expiry Date: {billing.expiryDate}</p>
          </div>
        ))}
        <div
          onClick={() => setIsAddingBilling(true)}
          className="border border-dashed border-gray-300 p-4 h-48 rounded-lg bg-white shadow-md flex items-center justify-center cursor-pointer"
        >
          <span className="text-6xl text-gray-300">+</span>
        </div>
      </div>
      <AddBillingModal
        isOpen={isAddingBilling}
        onClose={() => setIsAddingBilling(false)}
        handleAddBillingDetail={handleAddBillingDetail}
      />
    </div>
  );
};

export default BillingContent;
