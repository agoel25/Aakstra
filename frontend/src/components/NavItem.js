import React from 'react';

const NavItem = ({ icon: Icon, label, onClick, isActive }) => (
  <li className={`mb-6 ${isActive ? 'bg-gray-200' : ''}`}>
    <button onClick={onClick} className="flex items-center text-gray-700 w-full text-left p-2 rounded">
      <Icon className="h-6 w-6 mr-3" />
      {label}
    </button>
  </li>
);

export default NavItem;
