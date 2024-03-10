import React, { useContext } from 'react'
import { CommonContext } from '../../Context/CommonContext';

const NetworkError = () => {
    const { errorMessage } = useContext(CommonContext);
    return (
        // <div className="mt-20 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        //     <span className="block sm:inline">Network Error</span>
        // </div>
        <div className="mt-20 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">!! Something went wrong. Details: </strong>
            <br/>
            <span className="block sm:inline">{errorMessage}</span>
        </div>
    )
}

export default NetworkError