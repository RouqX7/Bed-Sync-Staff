import React from "react";

function BedCleaningTable({ beds, handleCleanBed, handleDirtyBed }) {
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
              Clean
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {beds.map((bed) => (
            <tr key={bed.id}>
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
                  {bed.available ? "Available" : "Unavailable"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap">
                <span className="text-sm leading-5 font-medium">
                  {bed.clean ? "Yes" : "No"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap text-right text-sm leading-5 font-medium">
                <button
                  onClick={() =>
                    bed.clean ? handleDirtyBed(bed.id) : handleCleanBed(bed.id)
                  }
                  className={`${
                    bed.clean ? "text-red-600" : "text-green-600"
                  } hover:text-red-900 hover:text-green-900`}
                >
                  {bed.clean ? "Mark as Dirty" : "Clean"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BedCleaningTable;
