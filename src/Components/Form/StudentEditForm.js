import React, { useContext } from 'react'
import { getStudentDataByID, studentSave } from '../../Services/StudentService';
import { useEffect } from 'react';
import { useState } from 'react';
import { generateYears } from './FormHelpers';
import { set } from 'date-fns';
import LoadingIcon from '../Common/LoadingIcon';
import { TableContext } from '../../Context/TableContext';

const StudentEditForm = ({ studentID, setIsModalOpen }) => {
    const [originalStudentData, setOriginalStudentData] = useState({});
    const [studentData, setStudentData] = useState({});
    const [courseList, setCourseList] = useState([]);
    const [feeTypes, setFeeTypes] = useState({});
    const [feeYearRange, setFeeYearRange] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({ isError: false, errorMsg: "" });
    const [isStudentFieldChanged, setIsStudentFieldChanged] = useState(false);
    const { setIsStudentDataEdited } = useContext(TableContext);

    const userDetails = JSON.parse(localStorage.getItem("userDetails"))
    useEffect(() => {
        setLoading(true);
        getStudentDataByID(studentID).then(responce => {
            setStudentData(responce?.student);
            setOriginalStudentData(responce?.student);
            setCourseList(Object.keys(responce?.branches))
            setFeeTypes(responce?.feeTypes);
            setFeeYearRange(Object.keys(responce?.student?.yearWiseFees));
            setLoading(false);
        }).catch((error) => {
            setLoading(false);
            console.log(error);
        })
    }, []);

    useEffect(() => {



    }, [studentData])


    const handleFieldChange = (e) => {
        let { name, value } = e.target;
        setIsStudentFieldChanged(true);
        if (name === 'dob') {
            value = new Date(value).toISOString()
        } else if (name === 'joiningYear' || name === "outgoingYear") {
            value = (+value)
        } else if (name === "auditComments") {
            if (value.trim()) {
                setError({ isError: false, errorMsg: "" })
            } else {
                setError({ isError: true, errorMsg: "comments required" })
            }
        } else if (name.includes("yearWiseFees")) {
            const yearWiseFees_Keys = name.split('.');
            const finacialYear = yearWiseFees_Keys[1];
            const feeNumber = yearWiseFees_Keys[2];

            setStudentData((prev) => ({
                ...prev, yearWiseFees: {
                    ...prev.yearWiseFees, [finacialYear]: {
                        ...prev.yearWiseFees[finacialYear], [feeNumber]: (+value)
                    }
                }
            }))
            return;
        }
        setStudentData((prev) => ({ ...prev, [name]: value }));
    }

    const handleSaveClick = (e) => {
        e.preventDefault();
        if (!studentData.auditComments) {
            setError({ isError: true, errorMsg: "comments required" })
            return;
        }
        setLoading(true);

        const requestData = {
            user: userDetails.firstName + " " + userDetails.lastName,
            Student: studentData
        }
        studentSave(requestData).then((resp) => {
            setIsStudentDataEdited((prev) => !prev)
            setIsModalOpen(false);
            setLoading(false);
        }).catch((message) => {
            setLoading(false);
        })
    }


    const currentYear = new Date().getFullYear();
    const joiningYears = generateYears(currentYear, 2010);

    const admissionTypes = ["CONVENER", "MANAGEMENT", "SPOT"]

    const outgoingYears = generateYears(studentData?.joiningYear + 10, studentData?.joiningYear);
    if (loading)
        return <LoadingIcon />

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4 text-center">Edit Student Details</h2>
            {studentData && studentData._id && <form>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name</label>
                    <input type="text" id="name" name="name" value={studentData.name} className="w-full px-3 py-2 border rounded" onChange={handleFieldChange} />
                </div>

                <div className="mb-4">
                    <label htmlFor="fatherName" className="block text-gray-700 font-bold mb-2">Father Name</label>
                    <input type="text" id="fatherName" name="fatherName" value={studentData.fatherName} className="w-full px-3 py-2 border rounded" onChange={handleFieldChange} />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3  gap-4'>
                    <div className="mb-4">
                        <label htmlFor="gender" className="block text-gray-700 font-bold mb-2">Gender</label>
                        <select id="gender" name="gender" className="w-full px-3 py-2 border rounded" value={studentData.gender} onChange={handleFieldChange}>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="birthdate" className="block text-gray-700 font-bold mb-2">Birthdate</label>
                        <input type="date" id="birthdate" name="dob" className="w-full px-3 py-2 border rounded" value={studentData.dob ? new Date(studentData.dob).toISOString().slice(0, 10) : ""} onChange={handleFieldChange} />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="rollno" className="block text-gray-700 font-bold mb-2">Roll Number</label>
                        <input type="text" id="rollno" name="rollno" value={studentData.rollno} className="w-full px-3 py-2 border rounded" onChange={handleFieldChange} />
                    </div>
                    {/* </div>
                <div className='flex justify-between flex-wrap'> */}
                    <div className="mb-4">
                        <label htmlFor="mobileNumber" className="block text-gray-700 font-bold mb-2">Mobile Number</label>
                        <input
                            type="tel"
                            id="mobileNumber"
                            name="mobileNumber"
                            className="w-full px-3 py-2 border rounded"
                            value={studentData.mobileNumber}
                            onChange={handleFieldChange}
                            pattern="[0-9]{10}"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="joiningYear" className="block text-gray-700 font-bold mb-2">Joining Year</label>
                        <select
                            id="joiningYear"
                            name="joiningYear"
                            className="w-full px-3 py-2 border rounded"
                            value={studentData.joiningYear}
                            onChange={handleFieldChange}
                        >
                            <option value="">Select a year</option>
                            {joiningYears.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>


                    <div className="mb-4">
                        <label htmlFor="outgoingYear" className="block text-gray-700 font-bold mb-2">Outgoing Year</label>
                        <select
                            id="outgoingYear"
                            name="outgoingYear"
                            className="w-full px-3 py-2 border rounded"
                            value={studentData.outgoingYear}
                            onChange={handleFieldChange}
                        >
                            <option value="">Select a year</option>
                            {outgoingYears.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* </div>
                <div className='flex justify-between flex-wrap'> */}
                    <div className="mb-4">
                        <label htmlFor="course" className="block text-gray-700 font-bold mb-2">Course</label>
                        <select
                            id="course"
                            name="course"
                            className="w-full px-3 py-2 border rounded"
                            value={studentData.course}
                            onChange={handleFieldChange}
                        >
                            <option value="">Select a course</option>
                            {courseList.map((course) => (
                                <option key={course} value={course}>
                                    {course.replace('_', ' ')}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="typeOfAdmission" className="block text-gray-700 font-bold mb-2">Type Of Admission</label>
                        <select
                            id="typeOfAdmission"
                            name="typeOfAdmission"
                            className="w-full px-3 py-2 border rounded"
                            value={studentData.typeOfAdmission}
                            onChange={handleFieldChange}
                        >
                            <option value="">Select Type Of Admission</option>
                            {admissionTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>
                <div className='flex flex-wrap'>
                    {feeYearRange.map((feeYear) => {
                        return (
                            <div key={feeYear} className='bg-slate-100 p-2 m-2 rounded w-64'>
                                <div>
                                    <div className='text-center text-gray-700 font-bold mb-2'>Fee Demand for Financial Year :{feeYear}</div>
                                    {Object.keys(studentData?.yearWiseFees[feeYear] || {}).map((number) => {
                                        return (
                                            <div className="mb-4" key={`yearWiseFees.${feeYear}.${number}`}>
                                                <label htmlFor={`yearWiseFees.${feeYear}.${number}`} className="block text-gray-700 font-bold mb-2">{feeTypes[number]?.transactionColumnName}</label>
                                                <input type="number" id={`yearWiseFees.${feeYear}.${number}`} name={`yearWiseFees.${feeYear}.${number}`} value={studentData?.yearWiseFees[feeYear][number]} className="w-full px-3 py-2 border rounded" onChange={handleFieldChange} />
                                            </div>
                                        )

                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="mb-4">
                    <label htmlFor="auditComments" className="block text-gray-700 font-bold mb-2">Comments</label>
                    <textarea
                        id="auditComments"
                        name="auditComments"
                        className="w-full px-3 py-2 border rounded"
                        rows="4"
                        onChange={handleFieldChange}
                        placeholder="Enter your comments..."
                    />
                </div>
                {error.isError && <p className="text-red-500">{error.errorMsg}</p>}

                <div className='mb-4 flex justify-center'>

                    <button type="button" className="border mx-2 text-sm  bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={(e) => { setIsModalOpen(false) }}>Cancel</button>

                    <button type="submit" className={`text-sm bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${!isStudentFieldChanged ? 'cursor-not-allowed opacity-50' : ''}`} disabled={!isStudentFieldChanged} onClick={(e) => { handleSaveClick(e) }}>Save</button>
                </div>

            </form>}
        </div>
    )
}

export default StudentEditForm