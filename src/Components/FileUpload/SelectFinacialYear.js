import React from 'react'
import { finacialYears } from '../../Data/CommonData';

const SelectFinancialYear = ({ selectedFinancialYear, setSelectedFinancialYear }) => {

    const handleSelectFinancialYear = (event) => {
        const yearId = parseInt(event.target.value);
        const year = finacialYears.find((opt) => opt.id === yearId);
        setSelectedFinancialYear(year);
    }
    return (
        <div className="m-2 flex justify-between">
            <label className="text-gray-700 font-bold mb-2">Select Financial Year:</label>
            <div className="relative inline-block w-30 mx-2" title={selectedFinancialYear?.display}>
                <select className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline overflow-x-scroll cursor-pointer" value={selectedFinancialYear?.id} onChange={handleSelectFinancialYear}>
                    {finacialYears.map((item) => <option key={item.id} value={item.id}>{item.display}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M14.707 7.293a1 1 0 00-1.414 0L10 10.586 6.707 7.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 000-1.414z" /></svg>
                </div>
            </div>
        </div>
    )
}

export default SelectFinancialYear