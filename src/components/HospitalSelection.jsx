import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { selectedHospitalState } from "../atoms/atoms";

function HospitalSelection() {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospitalId, setSelectedHospitalId] = useRecoilState(selectedHospitalState);
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
      const hospital = hospitals.find(hospital => hospital.id === selectedHospitalId);
      setSelectedHospital(hospital);
    }
  }, [selectedHospitalId, hospitals]);

  const handleHospitalChange = (e) => {
    const hospitalId = e.target.value;
    setSelectedHospitalId(hospitalId);
  };

  return (
    <div>
      <label htmlFor="hospitalSelect">Select a Hospital:</label>
      <select
        id="hospitalSelect"
        value={selectedHospitalId}
        onChange={handleHospitalChange}
      >
        <option value="">Select Hospital</option>
        {hospitals.map((hospital) => (
          <option key={hospital.id} value={hospital.id}>
            {hospital.name}
          </option>
        ))}
      </select>
      
      {/* Display selected hospital details if available */}
      {selectedHospital && (
        <div>
          <h2>{selectedHospital.name}</h2>
          <p>Location: {selectedHospital.location}</p>
          <p>Total Beds: {selectedHospital.totalBeds}</p>
          <p>Available Beds: {selectedHospital.availableBeds}</p>
          <p>Current Occupancy: {selectedHospital.currentOccupancy}</p>
          <Link to={`/next-page/${selectedHospital.id}`}>Next Page</Link>
        </div>
      )}
    </div>
  );
}

export default HospitalSelection;
