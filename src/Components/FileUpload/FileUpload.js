import React, { useContext, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";
import "tailwindcss/tailwind.css";
import { getOrganizations, uploadFile } from "../../Services/ReportService";
import LoadingIcon from "../Common/LoadingIcon";
import SelectCollege from "./SelectCollege";
import { TableContext } from "../../Context/TableContext";
import { useLocation } from "react-router-dom";
import { finacialYears } from "../../Data/CommonData";
import SelectFinancialYear from "./SelectFinacialYear";

const UploadFile = () => {
    const location = useLocation();

    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [fileUploadedResult, setFileUploadedResult] = useState({
        isValid: 0,
        message: "",
    });
    const { organizationList, setOrganizationList } = useContext(TableContext);
    const [loading, setLoading] = useState(false);
    const [selectedCollege, setSelectedCollege] = useState(organizationList[0]);
    const [selectedFinancialYear, setSelectedFinancialYear] = useState(finacialYears[0]);

    const [uploadStudentData, setUploadStudentData] = useState(true);
    const [expanded, setExpanded] = useState(false);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    const activeButtonClass = "mx-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    const deActiveButtonClass = "mx-2 bg-transparent hover:bg-blue-700 text-blue-700 font-semibold hover:text-green-500 py-2 px-4 border border-blue-500 hover:border-transparent rounded"
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: "image/*",
        onDrop: (acceptedFiles) => {
            setFile(acceptedFiles[0]);
            setFileName(acceptedFiles[0].name);
            setFileUploadedResult({ isValid: 0, message: "" });
            setExpanded(false);
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("Attachment", file);
        setLoading(true);
        setFileUploadedResult({ isValid: 0, message: "" });
        uploadFile(formData, uploadStudentData, selectedCollege.organizationCode, selectedFinancialYear.display).then((resp) => {
            if (resp.code !== -1) {
                setFileUploadedResult({ isValid: 1, message: resp.message });
            } else {
                setFileUploadedResult({ isValid: -1, message: resp.message });
            }
            setExpanded(false);
            setLoading(false);
        }).catch((message) => {
            setFileUploadedResult({ isValid: -1, message });
            setExpanded(false);
            setLoading(false);
        })

    };
    const clearFiles = () => {
        setFile(null);
        setFileName("");
        setExpanded(false);
        setFileUploadedResult({ isValid: 0, message: "" });
    }

    useEffect(() => {
        if (organizationList.length === 0) {
            getOrganizations().then(response => {
                var organizations = response?.Organizations;
                var orgList = Object.keys(organizations).filter(item => item.securityCode == 8).map((key, index) => ({ id: index, display: organizations[key].organizationName, branches: organizations[key].branches, organizationCode: organizations[key].organizationCode, securityCode: organizations[key].securityCode }));
                setOrganizationList(orgList);
                setSelectedCollege(orgList[0])

            }).catch((error) => {

            })
        }
    }, [organizationList, location])

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center mb-2">
                <button onClick={() => { setUploadStudentData(true); clearFiles() }} className={uploadStudentData ? activeButtonClass : deActiveButtonClass}>
                    Upload Student Data
                </button>
                <button onClick={() => { setUploadStudentData(false); clearFiles() }} className={uploadStudentData ? deActiveButtonClass : activeButtonClass}>
                    Upload Transaction Data
                </button>
            </div>
            <div className="bg-blue-100 rounded-lg w-full max-w-md">
                {uploadStudentData && selectedCollege?.display && <SelectCollege selectedCollege={selectedCollege} setSelectedCollege={setSelectedCollege} />}
                <SelectFinancialYear selectedFinancialYear={selectedFinancialYear} setSelectedFinancialYear={setSelectedFinancialYear} />
            </div>
            <div
                {...getRootProps()}
                className="w-full max-w-md p-8 mx-auto my-2 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ease-in-out hover:border-gray-500"
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className="text-2xl font-semibold text-gray-500">Drop your file here</p>
                ) : (
                    <p className="text-2xl font-semibold text-gray-500">
                        <FiUpload className="inline-block mb-1 mr-2 text-gray-400" />
                        Drag &amp; drop or{" "}
                        <span className="underline text-blue-500 hover:text-blue-700">
                            browse
                        </span>{" "}
                        your file here
                    </p>
                )}
                <p className="mt-2 text-sm text-gray-500">{fileName}</p>
            </div>
            {fileUploadedResult.isValid ? (
                <div className={`p-4  text-sm dark:bg-gray-800 rounded-lg   ${fileUploadedResult.isValid > 0 ? ' text-green-800 bg-green-50 dark:text-green-400' : 'text-red-800 bg-red-50 dark:text-red-400'}`} role="alert">
                    {
                        typeof fileUploadedResult.message === "string" ? (
                            <div>
                                {!expanded && (
                                    <p>
                                        <span className="font-medium" dangerouslySetInnerHTML={{ __html: fileUploadedResult.message.slice(0, 1000).replace(/\n/g, '<br />') }} />
                                        {
                                            fileUploadedResult.message?.length > 1000 && (<button onClick={toggleExpanded}>...View more</button>)
                                        }
                                    </p>
                                )}
                                {expanded && (
                                    <p>
                                        <span className="font-medium" dangerouslySetInnerHTML={{ __html: fileUploadedResult.message.replace(/\n/g, '<br />') }} />
                                        <button onClick={toggleExpanded}>...View less</button>
                                    </p>
                                )}
                            </div>
                        ) :
                            (<span className="font-medium">{fileUploadedResult.message?.toString()}</span>)
                    }

                </div>) : <div />}
            {loading && <LoadingIcon />}
            {file && (
                <div>
                    <button
                        onClick={handleSubmit}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Upload
                    </button>
                    <button
                        onClick={clearFiles}
                        className="mt-4 mx-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Clear
                    </button>
                </div>
            )}
        </div>
    );
};

export default UploadFile;