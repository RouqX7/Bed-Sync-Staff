import React from "react";
import { Link } from "react-router-dom";

function DashboardCard({ logo, title, subTitle, buttonText, to }) {
  return (
    <div className="flex flex-col space-x-4 p-4 bg-blue-200 shadow-md w-[400px] h-[200px] rounded-3xl">
      {/* Render logo if provided */}
      {logo && (
        <div className="border border-white rounded-md w-16 h-16 flex items-center justify-center m-4">
          <div className="bg-white rounded-md p-1">{logo}</div>
        </div>
      )}
      <div className="text-4xl">
        {/* Render title if provided */}
        {title && <>{title}</>}
        {/* Render subTitle if provided */}
        {subTitle && (
          <div className="text-black flex items-center justify-center">{subTitle}</div>
        )}
      </div>
      {/* Conditionally render the button */}
      {buttonText && (
        <Link to={to}>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
            {buttonText}
          </button>
        </Link>
      )}
    </div>
  );
}

export default DashboardCard;
