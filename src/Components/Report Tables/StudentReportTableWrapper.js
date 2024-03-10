import React, { useContext, useEffect, useState } from 'react'
import { CommonContext } from '../../Context/CommonContext';
import { TableContext } from '../../Context/TableContext';
import LoadingIcon from '../Common/LoadingIcon';
import NetworkError from '../Common/NetworkError';
import NoDataFound from '../Common/NoDataFound';
import { StudentReportTable } from './StudentReportTable'
const StudentReportTableWrapper = () => {
    //const [tableData, setTableData] = useState([])
    const [finalTableData, setFinalTableData] = useState([])
    const [loading, setLoading] = useState(false);
    const { tableData, tableColumnData } = useContext(TableContext);
    const { errorMessage } = useContext(CommonContext);
    useEffect(() => {
        const studentList = tableData?.results ? [...tableData.results] : []
        setLoading(true)
        const finalStudentList = studentList.map(student => {
            return { ...student }
        })
        setFinalTableData(finalStudentList);
        setLoading(false)
    }, [tableData]);


    if (loading)
        return <LoadingIcon />
    if (errorMessage) {
        return <NetworkError />
    }
    return (
        finalTableData.length > 0 ? <StudentReportTable data={finalTableData} columns={tableColumnData ? tableColumnData : []} /> : <NoDataFound />
    )
}

export default StudentReportTableWrapper