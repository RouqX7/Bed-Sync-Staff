import React from 'react'
import DashboardCard from '../DashboardCard'
import { IoBedSharp } from 'react-icons/io5'

function BedManagement() {
  return (
    <div className="flex flex-col min-h-screen space-y-6 py-12 px-14 bg-gray-50">
    <div>BedManagement</div>

    <div className="flex flex-row space-x-6 ">
        <DashboardCard
          logo={<IoBedSharp size={50} />}
          title="Bed Admission History"
          subTitle=""
          buttonText="View"
        />

        </div>
    

    </div>


  )
}

export default BedManagement