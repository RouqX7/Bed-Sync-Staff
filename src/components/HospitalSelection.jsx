import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function HospitalSelection() {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState("");
  const [selectedHospital, setSelectedHospital] = useState(null);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const hospitalsCollection = collection(db, "hospitals");
        const hospitalsSnapshot = await getDocs(hospitalsCollection);
        const hospitalsList = hospitalsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHospitals(hospitalsList);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };

    fetchHospitals();
  }, []);

  useEffect(() => {
    if (selectedHospitalId) {
      const hospital = hospitals.find(
        (hospital) => hospital.id === selectedHospitalId
      );
      setSelectedHospital(hospital);
    }
  }, [selectedHospitalId, hospitals]);

  const handleHospitalChange = (e) => {
    const hospitalId = e.target.value;
    setSelectedHospitalId(hospitalId);
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md w-full max-w-[700px]">
      <h1 className="text-xl font-bold mb-4">View All Hospitals</h1>
      <label htmlFor="hospitalSelect" className="block mb-2 text-xl font-semibold">
        Select a Hospital:
      </label>
      <select
        id="hospitalSelect"
        value={selectedHospitalId}
        onChange={handleHospitalChange}
        className="w-full p-2 mb-4 bg-gray-100 text-xl border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
      >
        <option value="">Select Hospital</option>
        {hospitals.map((hospital) => (
          <option key={hospital.id} value={hospital.id}>
            {hospital.name}
          </option>
        ))}
      </select>

      {selectedHospital && (
        <div className="bg-gray-100 rounded-md p-4 shadow-md">
          <h2 className="text-2xl font-bold mb-2">{selectedHospital.name}</h2>
          <p className="text-black font-semibold  mb-2 text-xl">Location: {selectedHospital.location}</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-black font-semibold text-xl">Total Beds: {selectedHospital.totalBeds}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-black font-semibold text-xl">Available Beds: {selectedHospital.availableBeds}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-black font-semibold text-xl">Current Occupancy: {selectedHospital.currentOccupancy}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HospitalSelection;
