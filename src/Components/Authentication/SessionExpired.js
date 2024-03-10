import React from 'react'

const SessionExpired = ({ goToLoginPage }) => {

    return (
        <div className="text-center text-red-500 font-bold">
            <p>Session Expired. Please log in again.</p>
            <button
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                onClick={goToLoginPage}
            >
                Go Back to Login
            </button>
        </div>
    )
}

export default SessionExpired;