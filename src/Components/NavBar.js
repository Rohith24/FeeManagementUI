import React, { useContext, useEffect, useMemo, useState } from 'react'
import StudentFilter from './StudentFilter';
import { AuthContext } from '../Context/AuthContext';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ExportButton from './Common/ExportButton';
import { finacialYears } from '../Data/CommonData';
import { TableContext } from '../Context/TableContext';

const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedButton, setSelectedButton] = useState("Report");
    const { pathname } = location;
    const { isAdmin, setIsAdmin, setIsLoggedIn } = useContext(AuthContext);
    const { userName, setUserName } = useContext(AuthContext);
    const params = useParams();
    const { studentID } = params;

    const [selectedOrganization, setSelectedOrganization] = useState();
    const [selectedCourse, setSelectedCourse] = useState();
    const [selectedYear, setSelectedYear] = useState();
    const [selectedFinancialYear, setSelectedFinancialYear] = useState(finacialYears[0]);
    const { tableData } = useContext(TableContext);

    useEffect(() => {
        if (pathname === '/' || pathname === '/report') {
            setSelectedButton("Report");
        } else if (pathname === '/upload') {
            setSelectedButton("Upload");
        }
    }, [pathname])
    useEffect(() => {
        const token = localStorage.getItem("token")
        const userDetails = JSON.parse(localStorage.getItem("userDetails"))
        setIsLoggedIn(token ? true : false)
        if (userDetails.isSuperAdmin) {
            setIsAdmin(true);
        } else {
            var maxSecurityCode = Math.max(...userDetails.organizationCodes.map(o => o.securityCode));
            setIsAdmin(maxSecurityCode == 8)
        }
        setUserName(userDetails.firstName + " " + userDetails.lastName);
    }, [location])

    //build fileName for export and Remove any special characters in it
    let fileName = useMemo(() => {
        let name = `${selectedOrganization?.display}_${selectedCourse?.display}_${selectedYear?.display}_${selectedFinancialYear?.display}`
        return name.replace(/[/\\?%*:|"<>]/g, '-');
    }, [selectedOrganization?.display, selectedCourse?.display, selectedYear?.display, selectedFinancialYear?.display]);

    const activeButtonClass = "mx-2 h-9 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    const deActiveButtonClass = "mx-2 h-9 text-sm bg-transparent hover:bg-blue-700 text-blue-700 font-semibold hover:text-green-500 py-2 px-4 border border-blue-500 hover:border-transparent rounded"
    return (
        <div className="flex flex-row flex-wrap justify-between">
            <StudentFilter selectedButton={selectedButton}
                selectedOrganization={selectedOrganization}
                setSelectedOrganization={setSelectedOrganization}
                selectedCourse={selectedCourse}
                setSelectedCourse={setSelectedCourse}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                selectedFinancialYear={selectedFinancialYear}
                setSelectedFinancialYear={setSelectedFinancialYear}
            />
            {isAdmin && !studentID && (<div className="flex flex-row justify-end mx-2 p-2">
                {(selectedButton === "Report" && tableData?.results?.length > 0) && <ExportButton tableId={"student-table-to-export"} fileName={fileName} />}
                <button className={selectedButton === "Report" ? activeButtonClass : deActiveButtonClass} onClick={() => { navigate('/report'); }}>
                    Report
                </button>
                <button className={selectedButton === "Upload" ? activeButtonClass : deActiveButtonClass} onClick={() => { navigate('/upload'); }}>
                    Upload
                </button>
            </div>)}
        </div>
    )
}

export default NavBar