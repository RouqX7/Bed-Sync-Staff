// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import NavigationBar from "./components/NavigationBar";
import Dashboard from "./components/pages/Dashboard";
import AdmissionPage from "./components/pages/AdmissionPage";
import BedManagement from "./components/pages/BedManagement";
import ConfirmAdmissionPage from "./components/pages/ConfirmAdmissionPage";
import AdmissionManagement from "./components/pages/AdmissionManagement";
import BedCleaningPage from "./components/pages/BedCleaningPage";
import SignIn from "./components/pages/SignIn";
import BedTransferPage from "./components/pages/BedTransferPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <div className="w-full flex">
        <NavigationBar />
        <main className="grow">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admission-page" element={<AdmissionPage />} />
            <Route path="/bed-management" element={<BedManagement />} />
            <Route
              path="/confirmAdmission/:patientId/:bedId"
              element={<ConfirmAdmissionPage />}
            />
            <Route path="/admission-management" element={<AdmissionManagement/>} />
            <Route path="/cleaning-page" element ={<BedCleaningPage/>} />
           <Route path="/bed-transfer" element = {<BedTransferPage />} /> 
            <Route path="/" element ={<SignIn />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
