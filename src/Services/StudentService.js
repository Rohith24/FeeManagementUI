import axios from "axios";
import { API_URL, getHeaders } from './BaseService'

export async function getStudentDataByID(studentId) {
    try {
        const headers = getHeaders();
        const response = await axios(
            `${API_URL}/student/viewbyId?studentId=${studentId}`, { headers }
        );
        return response.data;
    } catch (error) {
        throw new Error("Network request failed");
    }

}

export async function studentSave(formData) {
    const headers = getHeaders();
    try {
        const response = await axios.post(`${API_URL}/student/save`, formData, { headers });
        return response.data;
    } catch (err) {
        throw new Error(err.message || " Network request failed");
    }

}