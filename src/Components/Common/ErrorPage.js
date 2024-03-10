import React from 'react'
import { useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const err = useRouteError();
  console.log(err);
  return (
    <div className="flex flex-col content-center items-center">
      <div className="bg-red-400 p-6 rounded-lg">
        <h1 className='text-lg font-bold'>Oops!!</h1>
        <h2 className='font-bold'>Something Went Wrong!!</h2>
        {err.message && <h2 className='font-medium'> {err.message}</h2>}
        {(err.status || err.statusText) && <h2 className='font-medium'> {err.status + " : " + err.statusText}</h2>}
        <h2 className='font-medium'>Please check console for more info...</h2>
      </div>
    </div>
  )
}

export default ErrorPage