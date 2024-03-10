import axios from "axios";
import { API_URL, getHeaders } from './BaseService'

export async function getReportData(selectedCollegeOrgCode, selectedCourseCode, selectedYearValue, selectedFinancialYear) {
    try {

        const headers = getHeaders();
        const response = await axios(
            `${API_URL}/student/retrieve?organizationCode=${selectedCollegeOrgCode}&course=${encodeURIComponent(selectedCourseCode)}&year=${selectedYearValue}&financialYear=${selectedFinancialYear}`, { headers }
        );
        return response.data;
    } catch (error) {
        throw new Error("Network request failed");
    }

}

export async function getTranscationData(studentId) {
    try {
        const headers = getHeaders();
        const response = await axios(
            `${API_URL}/student/viewstudenttransactions?studentId=${studentId}`, { headers }
        );
        return response.data;
    } catch (error) {
        throw new Error("Network request failed");
    }

}

export async function uploadFile(formData, uploadStudentData, courseCode, finacialYear) {
    const headers = getHeaders();
    const studentUploadURL = `upload/students?organizationName=${courseCode}&financialYear=${finacialYear}`;
    const trasactionUploadURL = `upload/transactions?financialYear=${finacialYear}`;
    const finalFileUploadURL = uploadStudentData ? studentUploadURL : trasactionUploadURL;
    try {
        const response = await axios.post(`${API_URL}/${finalFileUploadURL}`, formData, { headers });
        return response.data;
    } catch (err) {
        throw new Error(err.message || " Network request failed");
    }

}


export async function getOrganizations() {
    try {
        const headers = getHeaders();
        const response = await axios(
            `${API_URL}/organization/vieworganizations`, { headers }
        );
        return response.data;
    } catch (error) {
        throw new Error("Network request failed");
    }

}