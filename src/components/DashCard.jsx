import React from "react";
import { Link } from "react-router-dom";

function DashCard({ title, number, subTitle, percentage, primaryText, secondaryText, to }) {
  return (
    <Link to={to}>
      <div className="relative p-4 bg-gray-200 shadow-md w-[400px] h-[150px] rounded-3xl cursor-pointer">
        {/* Title */}
        <div className="text-xl font-bold mb-4">{title}</div>
        
        {/* Number, Subtitle, and Percentage */}
        <div className="absolute top-4 right-4 flex flex-col items-end">
          <div className="text-6xl text-black">{number}</div>
          <div className="text-xl text-gray-600">{subTitle}</div>
          <div className="text-xl text-gray-500 ">{percentage}%</div>
        </div>
        
        {/* Primary and Secondary Texts */}
        <div className="absolute bottom-4 left-4 flex flex-col">
          <div className="text-green-500">{primaryText}</div>
          <div className="text-red-500">{secondaryText}</div>
        </div>
      </div>
    </Link>
  );
}

export default DashCard;
