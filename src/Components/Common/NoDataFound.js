import React from 'react'

const NoDataFound = () => {
    return (
        <div className="mt-20 w-full text-center bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">No Data Found!</strong>
            <span className="block sm:inline">Please upload data.</span>
        </div>
    )
}

export default NoDataFound