import React, { useState, useEffect } from "react";
import BedTransferTable from "../BedTransferTable";
import BedTransferModal from "../BedTransferModal";
import { useRecoilState } from "recoil";
import { selectedHospitalState } from "../../atoms/atoms";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore"; 

function BedTransferPage() {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState("");
  const [beds, setBeds] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBedId, setSelectedBedId] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [transferReason, setTransferReason] = useState("");
  const [requestingHospitalId, setRequestingHospitalId] = useRecoilState(selectedHospitalState);

  useEffect(() => {
    // Fetch all hospitals
    const fetchHospitals = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/hospitals/all");
        if (!response.ok) {
          throw new Error("Failed to fetch hospitals");
        }
        const data = await response.json();
        setHospitals(data);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };

    const fetchPatients = async () => {
      try {
        const patientsCollection = collection(db, "patients");

        let q = patientsCollection;
        if (requestingHospitalId) {
            q = query(q, where("hospitalId", "==", requestingHospitalId.id));
        }
        
        const querySnapshot = await getDocs(q);

        // Process the results
        const patientsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPatients(patientsList);
        setFilteredPatients(patientsList); // Set filtered patients initially
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchHospitals();
    fetchPatients();
  }, [selectedHospitalId]);

  const handleHospitalChange = async (event) => {
    const hospitalId = event.target.value;
    setSelectedHospitalId(hospitalId);

    // Fetch beds by hospital ID
    const response = await fetch(`http://localhost:8081/api/beds/getBedsByHospitalId/${hospitalId}`);
    if (!response.ok) {
      console.error("Failed to fetch beds for the selected hospital");
      return;
    }
    const data = await response.json();
    setBeds(data);
  };

  const handleBedTransfer = (bedId) => {
    setSelectedBedId(bedId);
    setShowModal(true);
  };

  const handleRequestTransfer = async () => {
    // Perform bed transfer request
    try {
      // Send the request to backend with necessary parameters
      const response = await fetch(`http://localhost:8081/api/beds/${selectedBedId}/requestBedTransfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestingHospitalId,
          transferReason,
          patientId: selectedPatient.id,
        }),
      });

      if (response.ok) {
        // Handle success
        console.log("Bed transfer requested successfully");
        setShowModal(false);
      } else {
        // Handle failure
        console.error("Failed to request bed transfer:", response.statusText);
      }
    } catch (error) {
      console.error("Error requesting bed transfer:", error.message);
    }
  };

  return (
    <div>
      <h2>Bed Transfer Page</h2>

      <div>
        <label htmlFor="hospital">Select Hospital:</label>
        <select
          id="hospital"
          value={selectedHospitalId}
          onChange={handleHospitalChange}
        >
          <option value="">Select a hospital</option>
          {hospitals.map((hospital) => (
            <option key={hospital.id} value={hospital.id}>
              {hospital.name}
            </option>
          ))}
        </select>
      </div>

      {selectedHospitalId && (
        <div>
          <h3>Beds in Selected Hospital</h3>
          <BedTransferTable
            beds={beds}
            onBedTransfer={handleBedTransfer}
          />
        </div>
      )}

      {showModal && (
        <BedTransferModal
          onRequestClose={() => setShowModal(false)}
          onRequestTransfer={handleRequestTransfer}
          patients={filteredPatients}
          selectedPatient={selectedPatient}
          onPatientSelect={(patient) => setSelectedPatient(patient)}
          transferReason={transferReason}
          onTransferReasonChange={(e) => setTransferReason(e.target.value)}
        />
      )}
    </div>
  );
}

export default BedTransferPage;
