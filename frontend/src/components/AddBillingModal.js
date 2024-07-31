import React from 'react';
import Modal from './Modal';

const AddBillingModal = ({ isOpen, onClose, newBillingDetail, setNewBillingDetail, handleAddBillingDetail }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <h2 className="text-2xl font-bold mb-4">Add New Billing Detail</h2>
    <input
      type="text"
      value={newBillingDetail.number}
      onChange={(e) => setNewBillingDetail({ ...newBillingDetail, number: e.target.value })}
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
      placeholder="Enter card number"
    />
    <input
      type="text"
      value={newBillingDetail.cvv}
      onChange={(e) => setNewBillingDetail({ ...newBillingDetail, cvv: e.target.value })}
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
      placeholder="Enter CVV"
    />
    <input
      type="text"
      value={newBillingDetail.expiry}
      onChange={(e) => setNewBillingDetail({ ...newBillingDetail, expiry: e.target.value })}
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
      placeholder="Enter expiry date (MM/YY)"
    />
    <button
      onClick={handleAddBillingDetail}
      className="bg-indigo-800 hover:bg-indigo-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Add Billing Detail
    </button>
  </Modal>
);

export default AddBillingModal;
