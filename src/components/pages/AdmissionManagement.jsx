import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import BedTable from "../BedTable";
import { selectedHospitalState } from "../../atoms/atoms";
import { useRecoilState } from "recoil";


function AdmissionManagement() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [beds, setBeds] = useState([]);
  const [selectedBed, setSelectedBed] = useState(null);
  const [selectedWard, setSelectedWard] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [wards, setWards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false); // Changed initial state to false
  const [selectedHospitalId, setSelectedHospitalId] = useRecoilState(
    selectedHospitalState
  );
  

  useEffect(() => {
     const fetchWards = async () => {
      try {
        const wardsCollection = collection(db, "wards");
    
        // Build the query
        let q = wardsCollection;
        if (selectedHospitalId) {
          q = query(q, where("hospitalId", "==", selectedHospitalId.id));
        }
    
        // Execute the query
        const wardsSnapshot = await getDocs(q);
    
        // Process the results
        const wardsList = wardsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setWards(wardsList);
      } catch (error) {
        console.error("Error fetching wards:", error);
      }
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
        const patientsCollection = collection(db, "patients");
        
        let q = patientsCollection;
        if (selectedHospitalId) {
          q = query(q, where("hospitalId", "==", selectedHospitalId.id));
        }
        const querySnapshot = await getDocs(q);
  
        // Process the results
        const patientsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPatients(patientsList);
        
        // Set filtered patients
        const filtered = patientsList.filter((patient) =>
          `${patient.firstName} ${patient.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
        setFilteredPatients(filtered);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
  
    fetchPatients();
  }, [selectedHospitalId, searchTerm]);
  
useEffect(() => {
  // Filter patients based on search term
  const filtered = patients.filter((patient) =>
    `${patient.firstName} ${patient.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  setFilteredPatients(filtered);
}, [searchTerm, patients]);

// Setting selected patient
useEffect(() => {
  if (patients.length > 0) {
    setSelectedPatient(patients[0]); // Selecting the first patient from the list
  }
}, [patients]);


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

  const handleAdmitPatient = (bed) => {
    setSelectedBed(bed);
    setModalOpen(true); // Open the modal when admitting a patient
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedPatient(null);
  };

  const handleAdmission = async () => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/patients/${selectedPatient.id}/${selectedBed.id}/${selectedWard}/assign-bed`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to admit patient to bed");
      }
  
      console.log("Patient admitted to bed:", selectedBed);
      // You may want to update the UI or fetch updated data after admitting the patient
      // For example, refetch the list of patients and beds
      // Once confirmed, close the modal
      setModalOpen(false);
    } catch (error) {
      console.error("Error admitting patient to bed:", error);
      // Handle the error as needed
    }
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
            <h2 className="text-lg font-semibold mb-4">Confirm Assignment</h2>
            <p>
              You are about to assign {selectedPatient ? selectedPatient.firstName : "No Patient"}{" "}
              {selectedPatient ? selectedPatient.lastName : "NO PATIENT"} to bed {selectedBed ? selectedBed.bedNumber : "NO BED"} in ward{" "}
              {selectedWard}. Are you sure you want to proceed?
            </p>
            <div className="mt-4">
              <p>Bed Assignment Details:</p>
              <p>
                <strong>Patient Name:</strong> {selectedPatient ? selectedPatient.firstName : "NO FIRSTNAME"}{" "}
                {selectedPatient ? selectedPatient.lastName : "NO LASTNAME"}
              </p>
              <p>
                <strong>Bed ID:</strong> {selectedBed ? selectedBed.id : "NO BED"}
              </p>
              <p>
                <strong>Ward:</strong> {selectedWard? selectedWard : "NO WARD"}
              </p>
              <p>
                <strong>Assignment Date:</strong> {new Date().toLocaleString()}
              </p>
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mr-4"
                onClick={handleModalClose}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleAdmission} // Handle admission when confirmed
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
