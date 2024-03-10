import React, { useState } from 'react';
import StudentEditForm from '../Form/StudentEditForm';

const Modal = ({ Component, ComponentProps, isModalOpen, setIsModalOpen, width, height }) => {
    return (
        <div>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className={`bg-white p-4 rounded ${width} ${height} overflow-y-auto`}>
                        <div className="flex justify-end">
                            <button className=" text-gray-600" onClick={() => setIsModalOpen(false)}>
                                {/* Close Icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <Component {...ComponentProps} />

                    </div>
                </div>
            )}
        </div>
    );
};

export default Modal;