import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import LineChart from "../charts/LineChart";
import DashboardCard from "../DashboardCard";
import { FaBed } from "react-icons/fa";
import { IoBedSharp } from "react-icons/io5";
import AvailableBedsCard from "../AvailableBedsCard.jsx";

function Dashboard() {
  const [availableBeds, setAvailableBeds] = useState([]);
  const [inNeedOfBeds,setInNeedOfBeds] = useState([])
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

    const fetchInNeedOfBeds = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/api/patients/inNeedOfBed"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Patients In need of beds");
        }
        const data = await response.json();
        setInNeedOfBeds(data);
      } catch (error) {
        console.error("Error fetching available beds:", error);
      }
    };


    fetchAvailableBeds();
    fetchWards();
    fetchInNeedOfBeds();
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
    <div className="flex flex-col min-h-screen space-y-6 py-12 px-14 bg-gray-50">
      <h1>Dashboard</h1>

      <div className="flex flex-row space-x-20 ">
        <DashboardCard
          logo={<IoBedSharp size={50} />}
          title="Available Beds In Hospital:"
          subTitle={availableBeds.length}
          buttonText="View"
        />

    <AvailableBedsCard
        wards={wards}
        selectedWardId={selectedWardId}
        setSelectedWardId={setSelectedWardId}
        availableBedsInWard={availableBedsInWard}
      />

    <DashboardCard
          logo={<FaBed size={50} />}
          title="Patients In need of Bed :"
          subTitle={inNeedOfBeds.length}
          buttonText="View"
        />
      </div>


      

      <div className="flex space-x-8 bg-white border rounded-xl shadow-md ">
        <LineChart className="w-2/5" />
      </div>
    </div>
  );
}

export default Dashboard;
