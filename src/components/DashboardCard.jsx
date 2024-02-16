import React from "react";

function DashboardCard({ logo, title, subTitle, availableBeds }) {
  return (
    <div className="flex flex-col space-x-4 p-4 bg-blue-200 shadow-md w-[250px] h-[250px] rounded-3xl">
      {logo}
      <div className="text-3xl">
        {title}
      </div>
      <div className="text-2xl">{subTitle}</div>
    </div>
  );
}

export default DashboardCard;
