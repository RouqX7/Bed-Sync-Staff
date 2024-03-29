import React, { useEffect, useState } from "react";
import DashboardCard from "../DashboardCard";
import { IoBedSharp } from "react-icons/io5";

function BedManagement() {
  const [cleanBedsCount, setCleanBedsCount] = useState(0);

  useEffect(() => {
    const fetchCleanBedsCount = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/beds/dirty");
        if (!response.ok) {
          throw new Error("Failed to fetch clean bed data");
        }
        const cleanBedData = await response.json();
        setCleanBedsCount(cleanBedData.length);
      } catch (error) {
        console.error("Error fetching clean beds count:", error);
      }
    };

    fetchCleanBedsCount();
  }, []);

  return (
    <div className="flex flex-col min-h-screen space-y-6 py-12 px-14 bg-gray-50">
      <div>BedManagement</div>

      <div className="flex flex-row space-x-6 ">
        <DashboardCard
          logo={<IoBedSharp size={50} />}
          title="Bed Admission History"
          subTitle=""
          buttonText="View"
        />

        <DashboardCard
          logo={<IoBedSharp size={50} />}
          title="Beds Waiting To Be Cleaned:"
          subTitle={cleanBedsCount}
          buttonText="View"
          to="/cleaning-page"
        />
      </div>
    </div>
  );
}

export default BedManagement;
