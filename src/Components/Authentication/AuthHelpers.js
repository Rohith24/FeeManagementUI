export const removeLocalStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userCode');
    localStorage.removeItem('userDetails');

}