export const API_URL = "http://localhost:1337/api"

export function getHeaders() {
    return {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'userCode': localStorage.getItem('userCode'),
    };
}
