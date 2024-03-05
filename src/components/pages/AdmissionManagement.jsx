import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import BedTable from "../BedTable";

function AdmissionManagement() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [beds, setBeds] = useState([]);
  const [selectedBed, setSelectedBed] = useState(null);
  const [selectedWard, setSelectedWard] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [wards, setWards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchWards = async () => {
      const wardCollection = collection(db, "wards");
      const wardSnapshot = await getDocs(wardCollection);
      const wardList = wardSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWards(wardList);
    };

    fetchWards();
  }, []);

  useEffect(() => {
    if (selectedWard) {
      const fetchBeds = async () => {
        try {
          const response = await fetch(
            `http://localhost:8081/api/beds/wards/${selectedWard}/bedsInWard`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch beds in the ward");
          }
          const data = await response.json();
          setBeds(data);
        } catch (error) {
          console.error("Error fetching beds in the ward:", error);
        }
      };

      fetchBeds();
    }
  }, [selectedWard]);

  useEffect(() => {
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

    fetchPatients();
  }, []);

  useEffect(() => {
    const filtered = patients.filter((patient) =>
      `${patient.firstName} ${patient.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  const handleWardChange = (event) => {
    setSelectedWard(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDischargePatient = async (bed) => {
    console.log("Discharging patient from bed:", bed);
    try {
      const response = await fetch(
        `http://localhost:8081/api/patients/${bed.patientId}/discharge-bed`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to discharge patient from bed");
      }

      console.log("Patient discharged from bed:", bed);
    } catch (error) {
      console.error("Error discharging patient from bed:", error);
    }
  };

  const handleAdmitPatient = async (bed) => {
    // Logic to admit the patient to the bed
    console.log("Admitting patient to bed:", bed);
    try {
      const response = await fetch(
        `http://localhost:8081/api/patients/${selectedPatient.id}/${bed.id}/assign-bed`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ wardId: selectedWard }), // Assuming selectedWard is available
        }
      );

      if (!response.ok) {
        throw new Error("Failed to admit patient to bed");
      }

      console.log("Patient admitted to bed:", bed);
      // You may want to update the UI or fetch updated data after admitting the patient
      // Set the selected patient after admission
      setSelectedPatient(selectedPatient);
      // Open the modal
      setModalOpen(true);
    } catch (error) {
      console.error("Error admitting patient to bed:", error);
    }
};


  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedPatient(null);
  };

  return (
    <div className="flex flex-col space-y-6 py-12 px-14">
      <h2> Admission Management </h2>

      <div>
        <label htmlFor="ward">Select Ward:</label>
        <select id="ward" value={selectedWard} onChange={handleWardChange}>
          <option value="">Select Ward</option>
          {wards.map((ward) => (
            <option key={ward.id} value={ward.id}>
              {ward.name}
            </option>
          ))}
        </select>
      </div>

      <input
        type="text"
        placeholder="Search Patients"
        value={searchTerm}
        onChange={handleSearchChange}
        className="border rounded p-2"
      />

      <div className="border rounded p-4">
        <h3>Filtered Patients</h3>
        <select
          value={selectedPatient ? selectedPatient.id : ""}
          onChange={(event) => {
            const selectedPatientId = event.target.value;
            const patient = filteredPatients.find(
              (p) => p.id === selectedPatientId
            );
            setSelectedPatient(patient);
          }}
          className="border rounded p-2"
        >
          <option value="">Select Patient</option>
          {filteredPatients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {`${patient.firstName} ${patient.lastName}`}
            </option>
          ))}
        </select>

        {selectedPatient && (
          <div>
            Selected Patient:{" "}
            {`${selectedPatient.firstName} ${selectedPatient.lastName}`}
          </div>
        )}
      </div>

      <div className="border rounded p-4">
        <h3>All Beds</h3>
        <BedTable
          beds={beds}
          handleDischargePatient={handleDischargePatient}
          handleAdmitPatient={handleAdmitPatient}
          selectedBed={selectedBed}
          selectedPatient={selectedPatient}
          setSelectedBed={setSelectedBed}
          setSelectedPatient={setSelectedPatient}
          setSelectedWard={setSelectedWard}
        />
      </div>

      {modalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">
              Confirm Assignment
            </h2>
            <p>
              You are about to assign {selectedPatient.firstName}{" "}
              {selectedPatient.lastName} to bed {selectedBed.id} in ward{" "}
              {selectedWard}. Are you sure you want to proceed?
            </p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mr-4"
                onClick={handleModalClose}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  // Add logic to confirm the assignment
                  setModalOpen(false);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdmissionManagement;
