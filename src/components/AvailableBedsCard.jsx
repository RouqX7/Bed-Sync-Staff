import React from "react";
import { Link } from "react-router-dom";

function AvailableBedsCard({
  wards,
  selectedWardId,
  setSelectedWardId,
  availableBedsInWard,
}) {
  return (
    <div className="w-[400px] h-[300px] bg-blue-200 rounded-3xl flex flex-col justify-start items-start p-4 text-gray-600 bg-white shadow-md">
      <span className="text-black text-3xl mt-2">Available Beds in Ward:</span>
      <select
        value={selectedWardId}
        onChange={(e) => setSelectedWardId(e.target.value)}
        className="mt-14"
      >
        <option className="text-blue-300 rounded-2xl " value="">
          Select Ward
        </option>
        {wards.map((ward) => (
          <option key={ward.id} value={ward.id}>
            {ward.name}
          </option>
        ))}
      </select>
      <span className="text-black text-2xl mt-4">
        Total: {availableBedsInWard.length}
      </span>
      <Link to="/admission-page" className="btn-admit text-black text-2xl mt-4">
        Admit
      </Link>
      {/* Add Admit button */}
    </div>
  );
}

export default AvailableBedsCard;
