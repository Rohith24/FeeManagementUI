import axios from "axios";
import { API_URL } from './BaseService'

export async function login(formData) {
    try {
        const response = await axios.post(`${API_URL}/login`, formData);

        if (response.data.code == "0") {
            const receivedToken = response.data.token;
            const decodedToken = JSON.parse(window.atob(receivedToken.split('.')[1]));
            localStorage.setItem('token', receivedToken);
            localStorage.setItem('userDetails', JSON.stringify(decodedToken));
            localStorage.setItem('userCode', decodedToken.userCode);
            return decodedToken.firstName + " " + decodedToken.lastName;
        } else {
            throw new Error(response.data.message);
        }
        //below tocken isAdmin=true
        //const receivedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjc4OTAiLCJ1c2VybmFtZSI6IkpvaG4gRG9lIiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNzE3MjM5MDIyfQ.ATERT1xAwEW1a8aYWaLTrP7-dPCDh-i4vGi-vOlu4ts"
        //below tokenisAdmin=false
        //const receivedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjc4OTAiLCJ1c2VybmFtZSI6IkpvaG4gRG9lIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTcxNzIzOTAyMn0.W0TMV71EvELo4Kzotn70kdNoiVCeRREsu6giei0Dcaw"
        //return response.data;
    } catch (err) {
        throw new Error(err.message || " Network request failed");
    }
}
