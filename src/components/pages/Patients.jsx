import React, { useState, useEffect } from "react";
import PatientsTable from '../PatientsTable';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { selectedHospitalState } from "../../atoms/atoms";
import { useRecoilState } from "recoil";
import PatientCard from "../PatientCard";
import { Calendar, CalendarDays, ClipboardCheck } from 'lucide-react';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [selectedHospitalId] = useRecoilState(selectedHospitalState);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [todayPatients, setTodayPatients] = useState(0);
  const [monthlyPatients, setMonthlyPatients] = useState(0);
  const [yearlyPatients, setYearlyPatients] = useState(0);

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
        const patientsList = querySnapshot.docs.map((doc) => {
          const data = doc.data();

          // Convert Firebase timestamps to readable date strings
          const createdAt = data.createdAt?.toDate
            ? data.createdAt.toDate().toLocaleDateString() // Format createdAt
            : "Unknown";

          const dateOfBirth = data.dateOfBirth?.toDate
            ? data.dateOfBirth.toDate().toLocaleDateString() // Format dateOfBirth
            : "Unknown";

          return {
            id: doc.id,
            ...data,
            createdAt, // Readable date string
            dateOfBirth, // Readable date string
          };
        });

        setPatients(patientsList);
        setFilteredPatients(patientsList); // Initially show all patients
        calculatePatientCounts(patientsList); // Calculate counts for today, month, year
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, [selectedHospitalId]);

  const calculatePatientCounts = (patientsList) => {
    const today = new Date();
    const todayString = today.toLocaleDateString(); // Get today's date as a string
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // Month is zero-based, so add 1

    // Count patients created today
    const todayCount = patientsList.filter((patient) => {
      return patient.createdAt === todayString; // Match exactly today's date string
    }).length;

    // Count patients created this month (from the first day to today)
    const monthCount = patientsList.filter((patient) => {
      const patientDate = new Date(patient.createdAt);
      return (
        patientDate.getFullYear() === currentYear &&
        patientDate.getMonth() + 1 === currentMonth // Check if within the current month
      );
    }).length;

    // Count patients created this year
    const yearCount = patientsList.filter((patient) => {
      const patientDate = new Date(patient.createdAt);
      return patientDate.getFullYear() === currentYear; // Check if within this year
    }).length;

    setTodayPatients(todayCount);
    setMonthlyPatients(monthCount);
    setYearlyPatients(yearCount);
  };

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);

    // Filter patients based on search term
    const filtered = patients.filter((patient) =>
      `${patient.firstName} ${patient.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
  };

  const handlePatientSelect = (patientId) => {
    const selectedPatient = patients.find((patient) => patient.id === patientId);
    setSelectedPatient(selectedPatient);
  };

  return (
    <div className="flex flex-col min-h-screen space-y-6 py-8 px-4 sm:px-8 bg-[#f8f7f7de]">
      

      <div className="bg-white shadow-md rounded-xl p-6 mb-6">
        <h1 className="text-xl font-bold text-gray-800">Patients</h1>
      </div>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <PatientCard
          title="Today Patients"
          number={todayPatients}
          description={`Total Patients ${todayPatients} today`}
          icon={<Calendar size={24} color="white" />}
          iconBgColor="bg-green-500"
        />
        <PatientCard
          title="Monthly Patients"
          number={monthlyPatients}
          description={`Total Patients ${monthlyPatients} this month`}
          icon={<CalendarDays size={24} color="white" />}
          iconBgColor="bg-orange-500"
        />
        <PatientCard
          title="Yearly Patients"
          number={yearlyPatients}
          description={`Total Patients ${yearlyPatients} this year`}
          icon={<ClipboardCheck size={24} color="white" />}
          iconBgColor="bg-green-500"
        />
      </div>
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search and select a patient"
          value={searchTerm}
          onChange={handleSearchChange}
          className="border rounded p-2 w-full"
        />
        {searchTerm && (
          <div className="absolute z-10 mt-2 w-full bg-white border rounded shadow-lg">
            <ul className="max-h-48 overflow-y-auto">
              {filteredPatients.map((patient) => (
                <li
                  key={patient.id}
                  onClick={() => handlePatientSelect(patient.id)}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                >
                  {`${patient.firstName} ${patient.lastName}`}
                </li>
              ))}
              {filteredPatients.length === 0 && (
                <li className="p-2 text-gray-500">No patients found</li>
              )}
            </ul>
          </div>
        )}
      </div>

      <div className="border rounded p-4">
        <h3>{selectedPatient ? "Selected Patient" : "All Patients"}</h3>
        {/* Pass the selected patient if any, otherwise show all filtered patients */}
        <PatientsTable
          patients={selectedPatient ? [selectedPatient] : filteredPatients}
        />
      </div>
    </div>
  );
};

export default Patients;
