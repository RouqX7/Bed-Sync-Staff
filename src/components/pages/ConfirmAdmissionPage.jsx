import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function AdmissionPage() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [availableBeds, setAvailableBeds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedBedId, setSelectedBedId] = useState("");

  useEffect(() => {
    // Fetch patients
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/patients/all");
        if (!response.ok) {
          throw new Error("Failed to fetch patients");
        }
        const data = await response.json();
        setPatients(data);
        setFilteredPatients(data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    // Fetch available beds
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

    fetchPatients();
    fetchAvailableBeds();
  }, []);

  useEffect(() => {
    // Filter patients based on search term
    const filtered = patients.filter((patient) => {
      const fullName = `${patient.firstName || ""} ${patient.lastName || ""}`;
      return fullName.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
  };

  const handlePatientSelection = (event) => {
    const selectedPatientId = event.target.value;
    const patient = patients.find((p) => p.id === selectedPatientId);
    setSelectedPatient(patient);
  };

  const handleBedSelection = (event) => {
    setSelectedBedId(event.target.value);
  };

  return (
    <div className="flex flex-col space-y-6 py-12 px-14">
      <h2>Admission Page</h2>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search Patients"
        value={searchTerm}
        onChange={handleSearchChange}
        className="border rounded p-2"
      />

      {/* Dropdown for patient selection */}
      <select
        value={selectedPatient ? selectedPatient.id : ""}
        onChange={handlePatientSelection}
        className="border rounded p-2"
      >
        <option value="">Select Patient</option>
        {filteredPatients.map((patient) => (
          <option key={patient.id} value={patient.id}>
            {`${patient.firstName} ${patient.lastName}`}
          </option>
        ))}
      </select>

      {/* Selected patient */}
      {selectedPatient && (
        <div>
          Selected Patient:{" "}
          {`${selectedPatient.firstName} ${selectedPatient.lastName}`}
        </div>
      )}

      {/* Display available beds */}
      <div className="border rounded p-4">
        <h3>Available Beds</h3>
        <ul>
          {availableBeds.map((bed) => (
            <li key={bed.id}>{bed.bedNumber}</li>
          ))}
        </ul>
      </div>

      {/* Patient and bed selection */}
      <div className="flex space-x-4">
        <select
          value={selectedBedId}
          onChange={handleBedSelection}
          className="border rounded p-6"
        >
          <option value="">Select Bed</option>
          {availableBeds.map((bed) => (
            <option key={bed.id} value={bed.id}>
              {bed.bedNumber}
            </option>
          ))}
        </select>
        <Link to={`/confirmAdmission/${selectedPatient?.id}/${selectedBedId}`}>
          <button className="bg-blue-500 text-white py-6 px-4 rounded">
            Confirm Admission
          </button>
        </Link>
      </div>

      <Link to="/" className="text-blue-500">
        Back to Dashboard
      </Link>
    </div>
  );
}

export default AdmissionPage;
