import React from 'react';

const PatientCard = ({ title, number, description, icon, iconBgColor }) => {
  return (
    <div className="p-3 sm:p-4 bg-white w-full rounded-3xl  flex items-center justify-between shadow-md">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">{number}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div
        className={`p-3 rounded-full ${iconBgColor} flex items-center justify-center`}
      >
        {icon}
      </div>
    </div>
  );
};

export default PatientCard;
