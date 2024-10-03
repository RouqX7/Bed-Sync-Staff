import React from "react";
import { Link } from "react-router-dom";

function DashCard({ title, number, subTitle, percentage, primaryText, secondaryText, to }) {
  return (
    <Link to={to}>
      <div className="relative p-3 sm:p-4 bg-gray-100 shadow-md w-full sm:w-[320px] md:w-[350px] lg:w-[400px] min-h-[120px] sm:min-h-[150px] rounded-3xl cursor-pointer box-border">
        {/* Compact View for Small Screens */}
        <div className="sm:hidden flex flex-col items-center">
          <div className="text-base font-bold">{title}</div>
          <div className="text-2xl font-bold text-black">{number}</div>
        </div>

        {/* Full View for Larger Screens */}
        <div className="hidden sm:block">
          <div className="text-lg sm:text-xl font-bold mb-2">{title}</div>
          
          {/* Number, Subtitle, and Percentage */}
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm sm:text-lg text-gray-600">{subTitle}</div>
            <div className="flex flex-col items-end">
              <div className="text-3xl sm:text-4xl lg:text-5xl text-black">{number}</div>
             <div className="text-sm sm:text-md lg:text-xl text-gray-500">{percentage}%</div>
            </div>
          </div>

          {/* Primary and Secondary Texts */}
          <div className="flex justify-between mt-2">
            <div className="text-green-500 text-sm">{primaryText}</div>
            <div className="text-red-500 text-sm">{secondaryText}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default DashCard;
