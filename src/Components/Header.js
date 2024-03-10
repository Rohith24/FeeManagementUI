import React, { useState } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { removeLocalStorage } from './Authentication/AuthHelpers';


const Header = () => {
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const isSuperAdmin = JSON.parse(localStorage.getItem("userDetails"))?.isSuperAdmin ?? false;
    const { userName } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleLogoutClick = () => {
        removeLocalStorage();
        setIsLoggedIn(false);
        setIsDropdownOpen((prevState) => !prevState);
        navigate('/login')
    }
    const handleDropdownToggle = () => {
        setIsDropdownOpen((prevState) => !prevState);
    };

    const handleChangePassword = () => {
        setIsDropdownOpen((prevState) => !prevState);
        navigate('/changepassword')
    };

    const handleResetPassword = () => {
        setIsDropdownOpen((prevState) => !prevState);
        navigate('/resetpassword')
    };
    return (
        <header className="p-2 flex justify-between shadow-md bg-slate-50">
            <div className="ml-5 text-2xl font-bold text-green-500" onClick={() => navigate("/")}>
                FEE MANAGEMENT
            </div>

            {isLoggedIn && (
                <div className='flex hover:text-blue-400'>

                    <span
                        className="cursor-pointer font-bold "
                        onClick={handleDropdownToggle}
                    >
                        {`Logged in As: ${userName}`}
                    </span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`w-4 h-4 m-1 cursor-pointer ${isDropdownOpen ? 'transform rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        onClick={handleDropdownToggle}
                    >
                        {isDropdownOpen ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        )}
                    </svg>
                    {isDropdownOpen && (
                        <div className="absolute top-8 right-0 mt-2 mr-2 w-fit bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                            <ul>
                                <li>
                                    <button
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                                        onClick={handleChangePassword}
                                    >
                                        Change Password
                                    </button>
                                </li>
                                {isSuperAdmin && (<li>
                                    <button
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                                        onClick={handleResetPassword}
                                    >
                                        Reset Password
                                    </button>
                                </li>)}
                                <li>
                                    <button
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                                        onClick={handleLogoutClick}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>)}
        </header>
    )
}

export default Header