import React from "react";

function BedTransferModal({
  onRequestClose,
  onRequestTransfer,
  patients,
  selectedPatient,
  onPatientSelect,
  transferReason,
  onTransferReasonChange,
}) {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Transfer Bed</h3>
            <div className="mt-4">
            
            </div>
            <div className="mt-4">
              <label htmlFor="patient" className="block text-sm font-medium text-gray-700">Select Patient:</label>
              <select
                id="patient"
                value={selectedPatient ? selectedPatient.id : ""}
                onChange={(event) => onPatientSelect(patients.find((p) => p.id === event.target.value))}
                className="mt-1 p-2 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm border-gray-300"
              >
                <option value="">Select Patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {`${patient.firstName} ${patient.lastName}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Transfer Reason:</label>
              <input
                type="text"
                id="reason"
                value={transferReason}
                onChange={onTransferReasonChange}
                className="mt-1 p-2 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm border-gray-300"
              />
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={onRequestTransfer}
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Confirm Transfer
            </button>
            <button
              onClick={onRequestClose}
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BedTransferModal;
