import React, { useContext, useEffect, useMemo, useState } from 'react'
import { getTranscationData } from '../../Services/ReportService';
import { TranscationTable } from './TranscationTable'
import NoDataFound from '../Common/NoDataFound';
import { CommonContext } from '../../Context/CommonContext';
import LoadingIcon from '../Common/LoadingIcon';
import NetworkError from '../Common/NetworkError';
import { useNavigate, useParams } from 'react-router-dom';
import { StudentTable } from './StudentTable';
import { format } from 'date-fns'
import { Transcation_GROUPED_COLUMNS } from '../../Configs/columns';
import Modal from '../Common/Modal';
import StudentEditForm from '../Form/StudentEditForm';
import { TableContext } from '../../Context/TableContext';
import HistoryList from './HistoryList';

const TranscationTableWrapper = () => {
    const [tableData, setTableData] = useState([])
    const [studentTableData, setStudentTableData] = useState([])
    const [finalTableData, setFinalTableData] = useState([])
    const [finalStudentTableData, setFinalStudentTableData] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isStudentDataEdited } = useContext(TableContext);
    const [loading, setLoading] = useState(false);
    const { errorMessage, setErrorMessage } = useContext(CommonContext);
    const params = useParams();
    const { studentID } = params;
    const navigate = useNavigate();
    const columns = useMemo(() => Transcation_GROUPED_COLUMNS, [])
    useEffect(() => {
        setLoading(true)
        getTranscationData(studentID).then(responce => {
            if (responce.code == "0") {
                setTableData(responce?.Transactions)
                setStudentTableData(responce)
                setErrorMessage("");
            } else {
                setErrorMessage(responce.message);
            }
            setLoading(false)
        }).catch((ex) => {
            setErrorMessage(ex.message);
            setLoading(false)
        })
    }, [studentID, isStudentDataEdited])

    useEffect(() => {
        const studentTranscationList = [...tableData]
        const finalStudentTranscationList = studentTranscationList.map(studentTran => {
            return { ...studentTran }
        })
        setFinalTableData(finalStudentTranscationList);
    }, [tableData])

    useEffect(() => {
        let feeTypes = studentTableData.feeTypes;
        let student = {
            yearWiseFees: studentTableData.student?.yearWiseFees || [],
            financialYearWiseFeesPaid: studentTableData.student?.financialYearWiseFeesPaid || [],
            yearWiseFeesPaid: studentTableData.student?.yearWiseFeesPaid || [],
            pendingFees: studentTableData.student?.pendingFees || [],
        };
        let finalFeeDeteails = [];
        if (student.yearWiseFees) {
            const convertedJSON = {};
            for (const [key, value] of Object.entries(student)) {
                for (const [year, data] of Object.entries(value)) {
                    for (const [subKey, subValue] of Object.entries(data)) {
                        if (!convertedJSON[subKey]) {
                            convertedJSON[subKey] = {
                                title: feeTypes[subKey]
                            };
                        }
                        if (!convertedJSON[subKey][year]) {
                            convertedJSON[subKey][year] = {};
                        }
                        convertedJSON[subKey][year][key] = subValue;
                    }
                }
            }
            finalFeeDeteails = Object.entries(convertedJSON).map(([key, value]) => ({ ...value }));
        }
        setFinalStudentTableData(finalFeeDeteails)
    }, [studentTableData])

    if (loading)
        return <LoadingIcon />
    if (errorMessage) {
        return <NetworkError />
    }
    return (
        <>
            {isModalOpen && <Modal Component={StudentEditForm} ComponentProps={{ studentID, setIsModalOpen }} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} width={"w-1/2"} height={"h-3/4"} />}
            {studentTableData.student ?
                <div className="bg-slate-200 m-2 p-6 rounded-lg shadow-md ">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold mb-2">Student ID: {studentTableData.student._id}</h2>
                        <h2 className="text-2xl font-semibold mb-2">Name: {studentTableData.student.name}</h2>
                        {studentTableData.student.securityCode > 1 ? (
                            <button className="mb-2 h-9 text-sm bg-gray-500 hover:bg-black-700 text-white font-bold py-2 px-4 rounded" onClick={() => { setIsModalOpen(true); }}>
                                Edit Student Details
                            </button>) : (<h2 className="text-2xl font-semibold mb-2"></h2>)
                        }
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <p className="text-black-600"><strong>Roll No: </strong>{studentTableData.student.rollno}</p>
                        <p className="text-black-600"><strong>Date of Birth: </strong>{studentTableData.student.dob ? format(new Date(studentTableData.student.dob), 'dd/MM/yyyy') : ''}</p>
                        <p className="text-black-600"><strong>Gender: </strong>{studentTableData.student.gender}</p>
                        <p className="text-black-600"><strong>Father Name: </strong>{studentTableData.student.fatherName}</p>
                        <p className="text-black-600"><strong>Admission: </strong>{studentTableData.student.typeOfAdmission}</p>
                        <p className="text-black-600"><strong>Phone Number: </strong>{studentTableData.student.mobileNumber}</p>
                        <p className="text-black-600"><strong>Course: </strong>{studentTableData.student.course.replace('_', ' ')}</p>
                        <p className="text-black-600"><strong>Joining Year: </strong>{studentTableData.student.joiningYear}</p>
                        {studentTableData.student.currentYear === -1 ?
                            <p className="text-black-600"><strong>Passed Out Year: </strong>{studentTableData.student.outgoingYear}</p> :
                            <p className="text-black-600"><strong>Current Year: </strong>{studentTableData.student.currentYear}</p>
                        }
                    </div>
                </div> : (<div className='flex flex-col items-center'>
                    <NoDataFound />
                    <button className="m-2 h-9 w-1/4 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => { navigate('/report'); }}>
                        Go Back to Student Report
                    </button>
                </div>)
            }
            {finalStudentTableData.length > 0 && (<StudentTable data={finalStudentTableData} />)}
            <br />
            {finalTableData.length > 0 && <TranscationTable data={finalTableData} columns={columns} />}
            {studentTableData.student?.history?.length > 0 && (
                <div className='overflow-auto m-[10px]'>
                    <div className='flex justify-between'>
                        <div className="py-8 w-1/2">
                            <h2 className="mb-2 mt-0 text-2xl font-medium leading-tight text-primary">Student History</h2>
                            <HistoryList history={studentTableData.student?.history.toReversed()} />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default TranscationTableWrapper