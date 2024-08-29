import React from "react";
import { Link } from "react-router-dom";

function WardCard({ ward, totalBeds, currentOccupancy, availableBeds }) {
  return (
    <div className="flex flex-col items-center justify-between p-6 bg-gray-50 rounded-3xl shadow-md w-full max-w-xs h-auto">
      <div className="text-xl font-bold text-black mb-4">{ward.name}</div>
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-gray-600 text-xl">Total Beds:</span>
          <span className="text-gray-900 font-semibold">{totalBeds}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600 text-xl">Current Occupancy:</span>
          <span className="text-gray-900 font-semibold">{currentOccupancy}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600 text-xl">Available Beds:</span>
          <span className="text-green-500 font-semibold">{availableBeds}</span>
        </div>
      </div>
      <Link
        to={`/wards/${ward.id}`}
        className="mt-4 px-4 py-2 text-white bg-[#FF8C8C] rounded hover:bg-blue-600 focus:bg-blue-600 focus:outline-none"
      >
        View Details
      </Link>
    </div>
  );
}

export default WardCard;
