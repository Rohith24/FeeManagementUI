import { useContext, useEffect, useState } from 'react';
import Body from './Components/Body';
import Footer from './Components/Footer';
import Header from './Components/Header';
import NavBar from './Components/NavBar';
import { CommonContext } from './Context/CommonContext';
import { TableContext } from './Context/TableContext';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import ErrorPage from './Components/Common/ErrorPage';
import Login from './Components/Authentication/Login';
import { AuthContext } from './Context/AuthContext';
import UploadFile from './Components/FileUpload/FileUpload';
import StudentReportTableWrapper from './Components/Report Tables/StudentReportTableWrapper';
import TranscationTableWrapper from './Components/Report Tables/TranscationTableWrapper';
import ChangePassword from './Components/Authentication/ChangePassword';
import ResetPassword from './Components/Authentication/ResetPassword';
import Modal from './Components/Common/Modal';
import SessionExpired from './Components/Authentication/SessionExpired';
import { removeLocalStorage } from './Components/Authentication/AuthHelpers';


const AppLayout = () => {
    return (
        <div className='flex flex-col min-h-screen'>
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}


const checkJwtTokenExpiry = (token) => {
    if (!token) return null;
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) return null;

    const payload = JSON.parse(window.atob(tokenParts[1]));
    if (!payload.exp) return null;

    return payload.exp * 1000; // Convert expiry time to milliseconds
};


function App() {
    const [errorMessage, setErrorMessage] = useState("");
    const [tableData, setTableData] = useState([]);
    const [isStudentDataEdited, setIsStudentDataEdited] = useState(false);
    const [organizationList, setOrganizationList] = useState([]);
    const [tableColumnData, setTableColumnData] = useState([]);
    const token = localStorage.getItem("token")
    const userDetails = JSON.parse(localStorage.getItem("userDetails"))
    const [isLoggedIn, setIsLoggedIn] = useState(token ? true : false);
    //const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [isAdmin, setIsAdmin] = useState(userDetails ? userDetails.isSuperAdmin : false);
    const [userName, setUserName] = useState(userDetails ? userDetails.firstName + " " + userDetails.lastName : "");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isSessionExpired, setIsSessionExpired] = useState(false);

    //below useeffect is used for token expiry
    useEffect(() => {
        let intervalId;
        const checkSessionExpiry = () => {
            const expiryTime = checkJwtTokenExpiry(token);
            if (expiryTime) {
                const currentTime = Date.now();
                if (currentTime >= expiryTime) {
                    // Session has expired
                    setIsSessionExpired(true);
                    setIsModalOpen(true);
                    clearInterval(intervalId);
                }
            }
        };

        // Check session expiry initially
        checkSessionExpiry();

        // Set up interval to check session expiry periodically
        intervalId = setInterval(checkSessionExpiry, 1000); // Check every second (you can adjust this interval)

        // Clear the interval on component unmount
        return () => clearInterval(intervalId);
    }, [token]);

    const goToLoginPage = () => {
        setIsSessionExpired(false);
        removeLocalStorage();
        setIsLoggedIn(false);
        setIsModalOpen(false);
    }

    if (isSessionExpired) {
        return (
            <Modal Component={SessionExpired} ComponentProps={{ goToLoginPage }} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} width={"w-1/4"} height={"h-1/4"}></Modal>
        );
    }
    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, isAdmin, setIsAdmin, userName, setUserName, isSessionExpired, setIsSessionExpired }}>
            <CommonContext.Provider value={{ errorMessage, setErrorMessage }}>
                <TableContext.Provider value={{ tableData, setTableData, organizationList, setOrganizationList, tableColumnData, setTableColumnData, isStudentDataEdited, setIsStudentDataEdited }}>
                    <RouterProvider router={appRouter} />
                </TableContext.Provider>
            </CommonContext.Provider>
        </AuthContext.Provider>
    );
}
const appRouter = createBrowserRouter([
    {
        path: "/",
        //element: <PrivateRoute><AppLayout /></PrivateRoute>,
        element: <AppLayout />,
        errorElement: <><Header /><ErrorPage /></>,
        children: [
            {
                path: "/",
                element: <PrivateRoute element={<><NavBar /><Body /></>} />,
                children: [
                    {
                        path: "/",
                        element: <Navigate to="/report" />,
                    },
                    {
                        path: "/report",
                        element: <StudentReportTableWrapper />,
                    },
                    {
                        path: "/report/:studentID",
                        element: <TranscationTableWrapper />,
                    },
                    {
                        path: "/upload",
                        element: <AdminRoute element={<UploadFile />} />,
                    },
                ]
            },
            {
                path: "/",
                element: <PrivateRoute element={<><Body /></>} />,
                children: [
                    {
                        path: "/report/:studentID",
                        element: <TranscationTableWrapper />,
                    },
                    {
                        path: "/changepassword",
                        element: <ChangePassword />,
                    },
                    {
                        path: "/resetpassword",
                        element: <SuperAdminRoute element={<ResetPassword />} />,
                    },
                    {
                        path: "*",
                        element: <Navigate to="/report" />,
                    },
                ]
            },
            {
                path: "/login",
                element: <LoginRoute element={<Login />}></LoginRoute>,
                //element: <Login />,
            },

        ]
    }
])

function PrivateRoute({ element }) {
    const { isLoggedIn } = useContext(AuthContext);
    return isLoggedIn ? element : <Navigate to="/login" />;
}

function LoginRoute({ element }) {
    const { isLoggedIn } = useContext(AuthContext);
    return !isLoggedIn ? element : <Navigate to="/" />;
}

function AdminRoute({ element }) {
    const { isAdmin } = useContext(AuthContext);
    return isAdmin ? element : <Navigate to="/" />;
}

function SuperAdminRoute({ element }) {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"))
    return userDetails.isSuperAdmin ? element : <Navigate to="/" />;
}

export default App;
