import React from 'react'
import { Outlet } from 'react-router-dom';


const Body = () => {
    return (
        <main className="m-2 p-2 border-2 rounded-xl overflow-auto">
            <Outlet />
        </main>
    )
}

export default Body