import React from "react";
import { Link } from "react-router-dom";


function DashboardCard({ logo, title, subTitle, buttonText }) {
  return (
    <div className="flex flex-col space-x-4 p-4 bg-blue-200 shadow-md w-[400px] h-[300px] rounded-3xl">
      <div className="border border-white rounded-md w-16 h-16 flex items-center justify-center m-4">
        <div className="bg-white rounded-md p-1">
          {logo}
        </div>
      </div>
      <div className="text-2xl">
        {title}
        <span className="text-black">{subTitle}</span>
      </div>
      {/* Use the Link component as a button */}
      <Link to="/admission-page">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {buttonText}
        </button>
      </Link>
    </div>
  );
}

export default DashboardCard;
