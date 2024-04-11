import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import DashboardCard from "../DashboardCard";
import AvailableBedsCard from "../AvailableBedsCard.jsx";
import WardCard from "../WardCcard.jsx";
import DashCard from "../DashCard.jsx";
import { selectedHospitalState } from "../../atoms/atoms.js";
import { useRecoilState } from "recoil";
import { getDoc } from "firebase/firestore";
import HospitalSelection from "../HospitalSelection.jsx";

function Dashboard() {
  const [availableBeds, setAvailableBeds] = useState([]);
  const [inNeedOfBeds, setInNeedOfBeds] = useState([]);
  const [selectedWardId, setSelectedWardId] = useState("");
  const [availableBedsInWard, setAvailableBedsInWard] = useState([]);
  const [patients, setPatients] = useState([]);
  const [beds, setBeds] = useState([]);
  const [wards, setWards] = useState([]);
  const [doctorsCount, setDoctorsCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [availableDoctorsCount, setAvailableDoctorsCount] = useState(0);
  const [unavailableDoctorsCount, setUnavailableDoctorsCount] = useState(0);
  const [nursesCount, setNursesCount] = useState(0);
  const [availableNursesCount, setAvailableNursesCount] = useState(0);
  const [unavailableNursesCount, setUnavailableNursesCount] = useState(0);
  const [selectedHospitalId, setSelectedHospitalId] = useRecoilState(
    selectedHospitalState
  );

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
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    // Fetch wards for dropdown
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

    const fetchBeds = async () => {
      try {
        const bedsCollection = collection(db, "beds");

        // Build the query
        let q = bedsCollection;
        if (selectedHospitalId) {
          q = query(q, where("hospitalId", "==", selectedHospitalId.id));
        }

        // Execute the query
        const bedsSnapshot = await getDocs(q);

        // Process the results
        const bedsList = bedsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBeds(bedsList);
      } catch (error) {
        console.error("Error fetching beds:", error);
      }
    };
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
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchAvailableBeds();
    fetchWards();
    fetchPatients();
    fetchBeds();
    fetchUsers();
  }, []);

  useEffect(() => {
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

  useEffect(() => {
    const doctors = users.filter((user) => user.role === "doctor");
    const nurses = users.filter((user) => user.role === "nurse");

    setDoctorsCount(doctors.length);
    setNursesCount(nurses.length);

    const availableDoctors = doctors.filter((doctor) => doctor.available);
    const availableNurses = nurses.filter((nurse) => nurse.available);

    setAvailableDoctorsCount(availableDoctors.length);
    setAvailableNursesCount(availableNurses.length);

    const unavailableDoctors = doctors.filter((doctor) => !doctor.available);
    const unavailableNurses = nurses.filter((nurse) => !nurse.available);

    setUnavailableDoctorsCount(unavailableDoctors.length);
    setUnavailableNursesCount(unavailableNurses.length);

    // Calculate doctors and nurses percentages
    const doctorsPercentage =
      doctors.length > 0
        ? ((availableDoctors.length / doctors.length) * 100).toFixed(2)
        : 0;
    const nursesPercentage =
      nurses.length > 0
        ? ((availableNurses.length / nurses.length) * 100).toFixed(2)
        : 0;

    // Use the percentages directly where needed
    console.log("Doctors Percentage:", doctorsPercentage);
    console.log("Nurses Percentage:", nursesPercentage);
  }, [users]);

  // Calculate nurses percentage using availableNursesCount and nursesCount
  const nursesTotalCount = nursesCount; // Total count of users with the nurse role
  const nursesPercentage =
    nursesTotalCount > 0
      ? ((availableNursesCount / nursesTotalCount) * 100).toFixed(2)
      : 0;

  const doctorsTotalCount = doctorsCount; // Total count of users with the doctor role
  const doctorsPercentage =
    doctorsTotalCount > 0
      ? ((availableDoctorsCount / doctorsTotalCount) * 100).toFixed(2)
      : 0;

  const numAvailableBeds = beds.filter((bed) => bed.available).length;
  const numUnavailableBeds = beds.length - numAvailableBeds;
  const admittedPatients = patients.filter(
    (patients) => patients.admitted
  ).length;
  const unAdmittedPatients = patients.length - admittedPatients;
  const bedsInNeedOfCleaning = beds.filter((bed) => !bed.clean).length;
  const cleanBedsCount = beds.filter((bed) => bed.clean).length;
  const dirtyBedsCount = beds.length - cleanBedsCount;
  const totalBedsCount = beds.length;
  // Calculate the percentage of clean beds
  const cleanBedsPercentage = (cleanBedsCount / totalBedsCount) * 100;
  const dirtyBedsPercentage = 100 - cleanBedsPercentage;

  // Calculate the number of patients in need of beds
  const patientsInNeedOfBedsCount = patients.filter(
    (patient) => patient.inNeedOfBed
  ).length;
  const totalPatientsCount = patients.length;

  // Calculate the percentage of patients in need of beds
  const patientsInNeedOfBedsPercentage =
    (patientsInNeedOfBedsCount / totalPatientsCount) * 100;

  return (
    <div className="flex flex-col min-h-screen space-y-6 py-12 px-14 bg-gray-50">
      <div className="bg-white shadow-md rounded-xl p-6 mb-6">
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
      </div>

      <div className="bg-white shadow-md rounded-xl p-6">
        <h1 className="text-lg font-bold mb-4">Hospital Stats</h1>

        <div className="flex flex-row space-x-20">
          <DashCard
            title="Beds:"
            number={beds.length}
            subTitle="Total Beds"
            percentage={Math.round((numAvailableBeds / beds.length) * 100)}
            primaryText={`Available: ${numAvailableBeds}`}
            secondaryText={`Unavailable: ${numUnavailableBeds}`}
            to="/admission-page"
          />

          <DashCard
            title="Patients"
            number={patients.length}
            subTitle={"Admitted"}
            primaryText={`Admitted: ${admittedPatients}`}
            secondaryText={`Not Admitted: ${unAdmittedPatients}`}
          />
          <DashCard
            title="Nurses:"
            number={nursesTotalCount}
            primaryText={`Available: ${availableNursesCount}`}
            secondaryText={`Unavailable: ${unavailableNursesCount}`}
            percentage={nursesPercentage}
          />
        </div>

        <div className="flex flex-row space-x-20">
          <DashCard
            title="Beds In need of cleaning:"
            number={bedsInNeedOfCleaning}
            subTitle="Dirty Beds"
            primaryText={`Clean: ${cleanBedsCount}`}
            secondaryText={`Dirty: ${dirtyBedsCount}`}
            percentage={dirtyBedsPercentage.toFixed(0)}
            to="/cleaning-page"
          />

          <DashCard
            title="Patients In need of Bed:"
            number={patientsInNeedOfBedsCount}
            primaryText={`Patients in Need: ${patientsInNeedOfBedsCount}`}
            secondaryText={`Total Patients: ${totalPatientsCount}`}
            percentage={patientsInNeedOfBedsPercentage.toFixed(0)}
          />

          <DashCard
            title="Doctors:"
            number={doctorsCount} // Display the total count of doctors
            primaryText={`Available: ${availableDoctorsCount}`}
            secondaryText={`Unavailable: ${unavailableDoctorsCount}`}
            percentage={doctorsPercentage}
          />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-xl p-6">
        <div className="flex flex-row space-x-10">
          {wards.map((ward) => (
            <WardCard
              key={ward.id}
              ward={ward}
              totalBeds={ward.totalBeds}
              currentOccupancy={ward.currenctOccupancy}
              availableBeds={ward.availableBeds}
            />
          ))}

          


          {/* <div className="flex space-x-8 bg-white border rounded-xl shadow-md ">
        <LineChart className="w-2/5" />
      </div> */}
        </div>

      </div>
      {/* <div className="bg-white shadow-md rounded-xl p-6">
      <HospitalSelection/>
</div> */}
    </div>
  );
}

export default Dashboard;
