import React, { useState, useEffect } from "react";
import BedCleaningTable from "../BedCleaningTable";

function BedCleaningPage() {
  const [beds, setBeds] = useState([]);
  const [filteredBeds, setFilteredBeds] = useState([]);
  const [showCleanBeds, setShowCleanBeds] = useState(true);

  useEffect(() => {
    // Fetch beds from the server
    const fetchBeds = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/beds/all");
        if (!response.ok) {
          throw new Error("Failed to fetch beds");
        }
        const data = await response.json();
        setBeds(data);
      } catch (error) {
        console.error("Error fetching beds:", error);
      }
    };

    fetchBeds();
  }, []);

  useEffect(() => {
    // Filter beds based on the selected option
    const filtered = showCleanBeds
      ? beds.filter((bed) => bed.clean)
      : beds.filter((bed) => !bed.clean);
    setFilteredBeds(filtered);
  }, [beds, showCleanBeds]);

  const handleToggleFilter = () => {
    // Toggle between clean and dirty beds
    setShowCleanBeds((prev) => !prev);
  };

  const handleMarkAsClean = async (bedId) => {
    // Handle marking a bed as clean
    try {
      // Call the appropriate API endpoint to mark the bed as clean
      await fetch(`http://localhost:8081/api/beds/${bedId}/markClean`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      // Refresh the beds list after marking the bed as clean
      const updatedBeds = beds.map((bed) =>
        bed.id === bedId ? { ...bed, clean: true } : bed
      );
      setBeds(updatedBeds);
    } catch (error) {
      console.error("Error marking bed as clean:", error);
    }
  };

  const handleMarkAsDirty = async (bedId) => {
    // Handle marking a bed as dirty
    try {
      // Call the appropriate API endpoint to mark the bed as dirty
      await fetch(`http://localhost:8081/api/beds/${bedId}/markDirty`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      // Refresh the beds list after marking the bed as dirty
      const updatedBeds = beds.map((bed) =>
        bed.id === bedId ? { ...bed, clean: false } : bed
      );
      setBeds(updatedBeds);
    } catch (error) {
      console.error("Error marking bed as dirty:", error);
    }
  };

  return (
    <div className="flex flex-col space-y-6 py-12 px-14">
      <h2>Bed Cleaning Page</h2>

      <div className="flex items-center space-x-4">
        <span>Show:</span>
        <button
          className={`px-4 py-2 rounded ${
            showCleanBeds ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
          onClick={handleToggleFilter}
        >
          Clean Beds
        </button>
        <button
          className={`px-4 py-2 rounded ${
            !showCleanBeds ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
          onClick={handleToggleFilter}
        >
          Dirty Beds
        </button>
      </div>

      <div className="border rounded p-4">
        <h3>Beds</h3>
        <BedCleaningTable
          beds={filteredBeds}
          handleCleanBed={handleMarkAsClean}
          handleDirtyBed={handleMarkAsDirty}
        />
      </div>
    </div>
  );
}

export default BedCleaningPage;
