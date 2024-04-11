import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { selectedHospitalState } from "../../atoms/atoms";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState(null); // State for notification message
  const [selectedHospital, setSelectedHospital] = useRecoilState(
    selectedHospitalState
  );
  const navigate = useNavigate();

  const signIn = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User:", user);

      // Fetch user data from the database to get the role
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const hospitalDocRef = doc(db, "hospitals", userData.hospitalId)
        const hospitalDocSnap = await getDoc(hospitalDocRef);

        if (hospitalDocSnap.exists()) {
          const hospitalData = hospitalDocSnap.data();
          setSelectedHospital(hospitalData)
        }

        console.log("User Data:", userData);

        // Update user availability to "available"
        await updateDoc(userDocRef, { available: true });

        // Navigate the user to the dashboard
        navigate("/dashboard");
      } else {
        console.log("User document not found.");
      }
    } catch (error) {
      // Display error message as notification
      setNotification(error.message);
      console.log("Error signing in:", error.message);
    }
  };


  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form className="bg-white p-8 rounded shadow-md" onSubmit={signIn}>
        <h1 className="text-2xl font-bold mb-4">Log In to Your Account</h1>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default SignIn;
