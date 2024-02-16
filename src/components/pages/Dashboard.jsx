import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import LineChart from "../charts/LineChart";
import DashboardCard from "../DashboardCard";

function Dashboard() {
  const [availableBeds, setAvailableBeds] = useState([]);
  const [selectedWardId, setSelectedWardId] = useState("");
  const [availableBedsInWard, setAvailableBedsInWard] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    // Fetch all available beds
    const fetchAvailableBeds = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/api/beds/available"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch available beds");
        }
        const data = await response.json();
        setAvailableBeds(data);
      } catch (error) {
        console.error("Error fetching available beds:", error);
      }
    };

    // Fetch wards for dropdown
    const fetchWards = async () => {
      const wardCollection = collection(db, "wards");
      const wardSnapshot = await getDocs(wardCollection);
      const wardList = wardSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWards(wardList);
    };

    fetchAvailableBeds();
    fetchWards();
  }, []);

  useEffect(() => {
    // Fetch available beds in the selected ward
    const fetchAvailableBedsInWard = async () => {
      if (!selectedWardId) return;
      try {
        const response = await fetch(
          `http://localhost:8081/api/beds/available/${selectedWardId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch available beds in ward");
        }
        const data = await response.json();
        setAvailableBedsInWard(data);
      } catch (error) {
        console.error("Error fetching available beds in ward:", error);
      }
    };

    fetchAvailableBedsInWard();
  }, [selectedWardId]);
  let colour = "bg-red-100";
  return (
    <div className="flex flex-col space-y-6 py-12 px-14">
      <h6>Dashboard</h6>

      <div className="flex flex-row space-x-6">
        <DashboardCard
          logo={<img src="logo.png" alt="Logo" />}
          title="Available beds:"
          subTitle={availableBeds.length}
        />

        <DashboardCard
          logo="d"
          title="Available beds:"
          subTitle={availableBeds.length}
        />

        <DashboardCard
          logo={<div>Patients </div>}
          title={"Patient"}
          subTitle={"sub"}
        />
      </div>

      {/* Display all available beds */}
      <div className={`flex space-x-8`}>
        <div className="w-2/5 h-[150px] bg-blue-200 border rounded-xl flex flex-col justify-center p-4  text-gray-600">
          <span className="text-gray-500">
            Available Beds: {availableBeds.length}
          </span>
          <Link to="/admission-page" className="btn-admit">
            Admit
          </Link>{" "}
          {/* Add Admit button */}
        </div>
        <div className="w-2/5 h-[150px] border rounded flex flex-col justify-center p-4 text-gray-600">
          <span className="text-gray-500">Patients In need of Beds: </span>
        </div>
      </div>

      {/* Display available beds in a specific ward */}
      <div className="flex space-x-8">
        <div className="w-2/5 h-[150px] border rounded flex flex-col justify-center p-4 text-gray-600">
          <span className="text-gray-500">Available Beds in Ward:</span>
          <select
            value={selectedWardId}
            onChange={(e) => setSelectedWardId(e.target.value)}
          >
            <option value="">Select Ward</option>
            {/* Render dropdown options for wards */}
            {wards.map((ward) => (
              <option key={ward.id} value={ward.id}>
                {ward.name}
              </option>
            ))}
          </select>
          <span className="text-gray-500">
            Total: {availableBedsInWard.length}
          </span>
          <Link to="/admission-page" className="btn-admit">
            Admit
          </Link>{" "}
          {/* Add Admit button */}
        </div>
        <div className="w-2/5 h-[150px] border rounded flex flex-col justify-center p-4 text-gray-600">
          <li className="mt-4">Patients In need of Beds: </li>
        </div>
      </div>

      <div className="flex space-x-8">
        <h2>Real Time Bed status</h2>
        <LineChart className="w-4/5" />
      </div>

      <div className="flex space-x-8">
        <div className="w-2/5 h-[150px] border rounded flex flex-col justify-center p-4 text-gray-600">
          <span className="text-gray-500">Available Patients: </span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
