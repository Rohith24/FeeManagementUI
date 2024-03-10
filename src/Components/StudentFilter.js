import React, { useCallback, useContext, useEffect, useState } from 'react'
import { CommonContext } from '../Context/CommonContext';
import { TableContext } from '../Context/TableContext';
import { getOrganizations, getReportData } from '../Services/ReportService';
import { useNavigate, useParams } from 'react-router-dom';
import { finacialYears } from '../Data/CommonData';
import LoadingIcon from './Common/LoadingIcon';
import { GROUPED_COLUMNS } from '../Configs/columns';

const StudentFilter = ({ selectedButton, selectedOrganization, setSelectedOrganization, selectedCourse, setSelectedCourse, selectedYear, setSelectedYear, selectedFinancialYear, setSelectedFinancialYear }) => {

    const { setErrorMessage } = useContext(CommonContext);
    const { organizationList, setOrganizationList, isStudentDataEdited } = useContext(TableContext);
    const [courseList, setCourseList] = useState([])
    const [yearList, setYearList] = useState([]);
    const [financialYearList, setFinancialYearList] = useState(finacialYears);
    const [loadFilters, setLoadFilters] = useState(false);
    const [loading, setLoading] = useState(false);



    const navigate = useNavigate();
    const { setTableData, setTableColumnData } = useContext(TableContext);

    const params = useParams();
    const { studentID } = params;


    //console.log(selectedOrganization, selectedCourse, selectedYear)
    const loadStudentReport = useCallback(() => {
        //console.log(selectedOrganization, selectedCourse, selectedYear)
        setLoading(true);
        getReportData(selectedOrganization.organizationCode, selectedCourse.courseCode, selectedYear.display === "Passed out" ? -1 : selectedYear.display, selectedFinancialYear.display).then(response => {
            setTableData({ results: response?.Students });
            setTableColumnData(() => GROUPED_COLUMNS(selectedFinancialYear?.display))
            setLoading(false);
        }).catch((error) => {
            setErrorMessage(error.message);
            setLoading(false);
        })
    }, [selectedOrganization, selectedCourse, selectedYear, selectedFinancialYear, setTableData, setErrorMessage])

    const loadOrganizations = useCallback(() => {
        getOrganizations().then(response => {
            setLoading(true);
            var organizations = response?.Organizations;
            var orgList = Object.keys(organizations).map((key, index) => ({ id: index, display: organizations[key].organizationName, branches: organizations[key].branches, organizationCode: organizations[key].organizationCode, securityCode: organizations[key].securityCode  }));
            setOrganizationList(orgList);
            setLoading(false);
        }).catch((error) => {
            setErrorMessage(error.message);
            setLoading(false);
        })
    }, [setOrganizationList, setErrorMessage])

    useEffect(() => {
        loadOrganizations();
    }, [])

    useEffect(() => {
        if (loadFilters) {
            loadStudentReport();
        }
    }, [loadFilters, isStudentDataEdited])

    useEffect(() => {
        if (organizationList.length) {
            setSelectedOrganization(organizationList[0]);
            let crcList = Object.keys(organizationList[0].branches).map((key, index) => ({ id: index, display: key.replace('_', ' '), courseCode: key, years: organizationList[0].branches[key].years }))
            setCourseList(crcList);
            let yrsList = crcList[0].years.map((year, index) => ({ id: index, display: year }))
            yrsList.push({ id: -1, display: "Passed out" });
            setYearList(yrsList);
        }
    }, [organizationList]);

    useEffect(() => {
        if (selectedOrganization) {
            const crcList = Object.keys(selectedOrganization.branches).map((key, index) => ({ id: index, display: key.replace('_', ' '), courseCode: key, years: selectedOrganization.branches[key].years }))
            setCourseList(crcList);
            setSelectedCourse(crcList[0]);
        }


    }, [selectedOrganization])

    useEffect(() => {
        if (selectedCourse) {
            const yrsList = selectedCourse.years.map((year, index) => ({ id: index, display: year }));
            yrsList.push({ id: -1, display: "Passed out" });
            setYearList(yrsList);
            setSelectedYear(yrsList[0]);
            setLoadFilters(true);
        }

    }, [selectedCourse])

    const onRefreshButtonClick = () => {
        navigate('/report');
        loadStudentReport();
    }
    //handle filters
    const handleSelectOrganization = (event) => {
        const organizationId = parseInt(event.target.value);
        const organization = organizationList.find((opt) => opt.id === organizationId);
        setSelectedOrganization(organization);
    }
    const handleSelectCourse = (event) => {
        const courseId = parseInt(event.target.value);
        const course = courseList.find((opt) => opt.id === courseId);
        setSelectedCourse(course);
    }
    const handleSelectYear = (event) => {
        const yearId = parseInt(event.target.value);
        const year = yearList.find((opt) => opt.id === yearId);
        setSelectedYear(year);
    }
    const handleSelectFinancialYear = (event) => {
        const yearId = parseInt(event.target.value);
        const year = financialYearList.find((opt) => opt.id === yearId);
        setSelectedFinancialYear(year);
    }
    if (loading)
        return <LoadingIcon />
    return (
        <div>
            {selectedButton === "Report" && loadFilters && !studentID && (

                <div className="flex flex-row justify-end p-2 overflow-auto">
                    <div className="relative inline-block w-72 mx-2" title={selectedOrganization.display}>
                        <select className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline overflow-x-scroll cursor-pointer" value={selectedOrganization.id} onChange={handleSelectOrganization}>
                            {organizationList.map((item) => <option key={item.id} value={item.id}>{item.display}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M14.707 7.293a1 1 0 00-1.414 0L10 10.586 6.707 7.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 000-1.414z" /></svg>
                        </div>
                    </div>
                    <div className="relative inline-block w-40 mx-2" title={selectedCourse.display}>
                        <select className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline overflow-x-scroll cursor-pointer" value={selectedCourse.id} onChange={handleSelectCourse}>
                            {courseList.map((item) => <option key={item.id} value={item.id}>{item.display}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M14.707 7.293a1 1 0 00-1.414 0L10 10.586 6.707 7.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 000-1.414z" /></svg>
                        </div>
                    </div>
                    <div className="relative inline-block w-24 mx-2" title={selectedYear.display}>
                        <select className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline overflow-x-scroll cursor-pointer" value={selectedYear.id} onChange={handleSelectYear}>
                            {yearList.map((item) => <option key={item.id} value={item.id}>{item.display}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M14.707 7.293a1 1 0 00-1.414 0L10 10.586 6.707 7.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 000-1.414z" /></svg>
                        </div>
                    </div>
                    <div className="relative inline-block w-30 mx-2" title={selectedFinancialYear?.display}>
                        <select className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline overflow-x-scroll cursor-pointer" value={selectedFinancialYear?.id} onChange={handleSelectFinancialYear}>
                            {financialYearList.map((item) => <option key={item.id} value={item.id}>{item.display}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M14.707 7.293a1 1 0 00-1.414 0L10 10.586 6.707 7.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 000-1.414z" /></svg>
                        </div>
                    </div>
                    <button type="button" onClick={onRefreshButtonClick} className="inline-flex items-center justify-center w-auto px-3 py-2 space-x-2 text-sm font-medium text-white transition bg-blue-500 border  rounded appearance-none cursor-pointer select-none hover:border-blue-800 hover:bg-blue-800 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:pointer-events-none disabled:opacity-75">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd"
                                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                clipRule="evenodd" />
                        </svg>
                        <span>Refresh...</span>
                    </button>
                </div>



            )}
        </div>

    )
}

export default StudentFilter