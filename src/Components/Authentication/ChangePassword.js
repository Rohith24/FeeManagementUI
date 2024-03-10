import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../../Services/UserService';
import { AuthContext } from '../../Context/AuthContext';
import { useContext } from 'react';
import { removeLocalStorage } from './../Authentication/AuthHelpers';

const ChangePassword = () => {
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const oldPasswordRef = useRef();
    const newPasswordRef = useRef();
    const confirmPasswordRef = useRef();
    const [message, setMessage] = useState('');
    const [isPasswordChanged, setIsPasswordChanged] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const email = localStorage.getItem('userCode');
        const oldPassword = oldPasswordRef.current.value;
        const newPassword = newPasswordRef.current.value;
        const confirmPassword = confirmPasswordRef.current.value;
        if (newPassword !== confirmPassword) {
            newPasswordRef.current.value = "";
            confirmPasswordRef.current.value = "";
            setMessage("New Password and Confirm Password does not match");
            return;
        }
        changePassword({
            userCode: email, currentpassword: oldPassword, newpassword: newPassword
        }).then((response) => {
            if (response.code === "0") {
                setMessage(response.message);
                setIsPasswordChanged(true);
            } else {
                oldPasswordRef.current.value = "";
                newPasswordRef.current.value = "";
                confirmPasswordRef.current.value = "";
                setIsPasswordChanged(false)
                setMessage(response.message);
            }
        }).catch((msg) => {
            setMessage(msg);
        });

    };
    const handleLogoutClick = () => {
        removeLocalStorage();
        setIsLoggedIn(false);
        navigate('/login')
    }
    return (
        <div className="flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        Change Password
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {!isPasswordChanged && (
                        <>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="rounded-md shadow-sm -space-y-px">
                                    <label htmlFor="old-password" className="sr-only">
                                        Old Password
                                    </label>
                                    <input
                                        id="old-password"
                                        name="old-password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Old Password"
                                        ref={oldPasswordRef}
                                    />
                                </div>
                                <div className="rounded-md shadow-sm -space-y-px">
                                    <label htmlFor="new-password" className="sr-only">
                                        New Password
                                    </label>
                                    <input
                                        id="new-password"
                                        name="new-password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="New Password"
                                        ref={newPasswordRef}
                                    />
                                </div>
                                <div className="rounded-md shadow-sm -space-y-px">
                                    <label htmlFor="confirm-password" className="sr-only">
                                        Confirm Password
                                    </label>
                                    <input
                                        id="confirm-password"
                                        name="confirm-password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Confirm Password"
                                        ref={confirmPasswordRef}
                                    />
                                </div>
                            </div>
                            {/*<p className="text-gray-500 text-sm m-2">
                                <Link to="/login" className="text-blue-500 hover:text-blue-700 hover:underline">
                                    Back to Login
                                </Link>
                            </p>*/}
                            {message && (
                                <div id="success-alert" className="mt-4 text-red-500 font-bold">
                                    {message}
                                </div>
                            )}
                            <div>
                                <button
                                    type="submit"
                                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="feather feather-save"
                                        >
                                            <path d="M19 21H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h8l2 2h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2z" />
                                            <polyline points="17 21 17 13 7 13 7 21" />
                                            <polyline points="7 3 7 8 15 8" />
                                        </svg>
                                    </span>
                                    Change Password
                                </button>

                            </div>
                        </>
                    )}

                    {isPasswordChanged && (<>
                        <div id="success-alert" className="mt-4 text-green-500 font-bold">
                            {message}
                        </div>
                        <div>
                            <button
                                type="button"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={handleLogoutClick}
                            >
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-log-in"
                                    >
                                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                        <polyline points="10 17 15 12 10 7" />
                                        <line x1="15" y1="12" x2="3" y2="12" />
                                    </svg>
                                </span>
                                Log in
                            </button>
                        </div>
                    </>)}
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
