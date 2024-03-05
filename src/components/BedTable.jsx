import React from "react";

function BedTable({
  beds,
  handleDischargePatient,
  selectedBed,
  selectedPatient,
  setSelectedBed,
  setSelectedPatient,
  setSelectedWard,
}) {
  const isPatientAdmitted = selectedPatient && selectedPatient.admitted;

  const handleAdmitPatient = (bed) => {
    setSelectedBed(bed);
    setSelectedWard(""); // Clear the selected ward when admitting a patient
    setSelectedPatient(selectedPatient); // Set the selected patient to the previously selected patient
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Bed Number
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Availability
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Patient
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {beds.map((bed) => (
            <tr
              key={bed.id}
              className={selectedBed === bed ? "bg-blue-100" : ""}
            >
              <td className="px-6 py-4 whitespace-no-wrap">
                <div className="text-sm leading-5 text-gray-900">
                  {bed.bedNumber}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    bed.available
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {bed.available ? "Available" : "Occupied"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap">
                {bed.patientId &&
                selectedPatient &&
                selectedPatient.id === bed.patientId ? (
                  <div className="text-sm leading-5 text-gray-900">
                    {`${selectedPatient.firstName} ${selectedPatient.lastName}`}
                  </div>
                ) : (
                  <div className="text-sm leading-5 text-gray-500">Empty</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap text-right text-sm leading-5 font-medium">
                {!bed.available && (
                  <button
                    onClick={() => handleDischargePatient(bed)}
                    className={`text-red-600 hover:text-red-900 ${
                      !isPatientAdmitted ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={!isPatientAdmitted}
                  >
                    Discharge Patient
                  </button>
                )}
                {bed.available && (
                  <button
                    onClick={() => handleAdmitPatient(bed)}
                    className={`text-indigo-600 hover:text-indigo-900 ${
                      isPatientAdmitted ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isPatientAdmitted}
                  >
                    Admit Patient
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BedTable;
