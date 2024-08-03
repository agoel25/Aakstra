import React, { useState } from 'react';
import Modal from './Modal';

const AddBillingModal = ({ isOpen, onClose, handleAddBillingDetail }) => {
  const [formValues, setFormValues] = useState({
    cardNumber: '',
    cvv: '',
    expiryDate: '',
    postalCode: '',
    city: '',
    country: '',
    paymentType: '',
    isDefault: 'false',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddBillingDetail(formValues);
    setFormValues({
      cardNumber: '',
      cvv: '',
      expiryDate: '',
      postalCode: '',
      city: '',
      country: '',
      paymentType: '',
      isDefault: 'false',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4">Add New Billing Detail</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="cardNumber" className="block text-gray-700 text-sm font-bold mb-2">
            Card Number
          </label>
          <input
            id="cardNumber"
            name="cardNumber"
            type="text"
            value={formValues.cardNumber}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="cvv" className="block text-gray-700 text-sm font-bold mb-2">
            CVV
          </label>
          <input
            id="cvv"
            name="cvv"
            type="text"
            value={formValues.cvv}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="expiryDate" className="block text-gray-700 text-sm font-bold mb-2">
            Expiry Date
          </label>
          <input
            id="expiryDate"
            name="expiryDate"
            type="text"
            value={formValues.expiryDate}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="postalCode" className="block text-gray-700 text-sm font-bold mb-2">
            Postal Code
          </label>
          <input
            id="postalCode"
            name="postalCode"
            type="text"
            value={formValues.postalCode}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            value={formValues.city}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="country" className="block text-gray-700 text-sm font-bold mb-2">
            Country
          </label>
          <input
            id="country"
            name="country"
            type="text"
            value={formValues.country}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="paymentType" className="block text-gray-700 text-sm font-bold mb-2">
            Payment Type
          </label>
          <input
            id="paymentType"
            name="paymentType"
            type="text"
            value={formValues.paymentType}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="isDefault" className="block text-gray-700 text-sm font-bold mb-2">
            Set as default?
          </label>
          <input
            id="isDefault"
            name="isDefault"
            type="text"
            value={formValues.isDefault}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-indigo-800 hover:bg-indigo-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Billing Detail
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddBillingModal;
