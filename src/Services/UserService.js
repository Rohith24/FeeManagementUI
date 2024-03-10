import axios from "axios";
import { API_URL, getHeaders } from './BaseService'

export async function changePassword(formData) {
    try {
        const headers = getHeaders();
        const response = await axios.post(`${API_URL}/user/changepassword`, formData, { headers });
        return response.data;
    } catch (err) {
        throw new Error(err.message || " Network request failed");
    }
}

export async function resetPassword(formData) {
    try {
        const headers = getHeaders();
        const response = await axios.post(`${API_URL}/user/resetpassword`, formData, { headers });
        return response.data;
    } catch (err) {
        throw new Error(err.message || " Network request failed");
    }
}