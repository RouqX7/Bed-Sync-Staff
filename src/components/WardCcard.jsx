import React from "react";
import { Link } from "react-router-dom";

function WardCard({ ward, totalBeds,currentOccupancy,availableBeds }) {
  return (
    <div className="flex flex-col space-x-4 p-4 bg-gray-200 shadow-md w-[400px] h-[150px] rounded-3xl">
      <div className="text-xl">
        <span className="text-black"> {ward.name}</span>
        <div className="text-black flex items-center justify-center mt-1">
          Total Beds: {totalBeds}
        </div>
        <div className="text-black flex items-center justify-center mt-1">
          Current Occupancy: {currentOccupancy}
        </div>
        <div className="text-black flex items-center justify-center mt-1">
          Available Beds: {availableBeds}
        </div>
      </div>
    </div>
  );
}

export default WardCard;
