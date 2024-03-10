import React, { useContext } from 'react'
import { TableContext } from '../../Context/TableContext';

const SelectCollege = ({ selectedCollege, setSelectedCollege }) => {
    const { organizationList } = useContext(TableContext);
    const handleSelectCollege = (event) => {
        const collegeId = parseInt(event.target.value);
        const college = organizationList.filter(item => item.securityCode == 8).find((opt) => opt.id === collegeId);
        setSelectedCollege(college);
    }
    return (
        <div className="m-2 flex justify-between">
            <label className="text-gray-700 font-bold mb-2">Select college:</label>
            <div className="relative inline-block w-72 mx-2" title={selectedCollege.display}>
                <select className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline overflow-x-scroll cursor-pointer" value={selectedCollege.id} onChange={handleSelectCollege}>
                    {organizationList.filter(item => item.securityCode == 8).map((item) => <option key={item.id} value={item.id}>{item.display}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M14.707 7.293a1 1 0 00-1.414 0L10 10.586 6.707 7.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 000-1.414z" /></svg>
                </div>
            </div>
        </div>
    )
}

export default SelectCollege