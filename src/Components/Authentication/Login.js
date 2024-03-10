import React, { useContext, useRef, useState } from 'react'
import { AuthContext } from '../../Context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../Services/AuthService';
import { CommonContext } from '../../Context/CommonContext';
const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
const Login = () => {
    const { setIsLoggedIn } = useContext(AuthContext);
    const { userName, setUserName } = useContext(AuthContext);
    const { setErrorMessage } = useContext(CommonContext);
    const [message, setMessage] = useState(String);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        setMessage("");
        e.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        if (email.trim() === '' || password.trim() === '') {
            setMessage("Please enter both Email and Password.");
        } else {
            login({ "userCode": email, password }).then(response => {
                // Reset input fields
                emailRef.current.value = '';
                passwordRef.current.value = '';
                setIsLoggedIn(true);
                navigate('/');
                setUserName(response);
                setErrorMessage("");
            }).catch((ex) => {
                setMessage(ex.message);
            })
        }


    };
    return (
        <div className="flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Log in to your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6">
                    <div className="grid grid-cols-1 gap-3">
                        <div className="rounded-md shadow-sm -space-y-px">
                            <label htmlFor="email-address" className="sr-only">
                                User Name
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="User Name"
                                ref={emailRef}
                            />
                        </div>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                ref={passwordRef}
                            />
                        </div>
                    </div>
                    {
                        message && (<div id="failedalert" className="mt-4 text-red-500 font-bold">{message}</div>)
                    }
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={handleSubmit}
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-log-in"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                            </span>
                            Log in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login