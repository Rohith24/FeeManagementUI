import React from 'react';

const HistoryCard = ({ historyItem }) => {
    function formatDate(date) {
        date = new Date(date);
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const day = days[date.getDay()];
        const month = months[date.getMonth()];
        const dayOfMonth = date.getDate();
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
        const seconds = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();

        return `${day} ${month} ${dayOfMonth}, ${year} ${hours}:${minutes}:${seconds}`;
    }
    return (
        <div className="bg-slate-200 rounded-lg shadow-md p-4 mb-4">
            <span className="text-gray-500 mx-2">by <strong>{historyItem.user}</strong> at <strong>{historyItem.dateCreated ? formatDate(historyItem.dateCreated) : "not known"}</strong></span>
            {historyItem.comments && <div className="mx-2 text-gray-600 mt-2">{historyItem.comments}</div>}
        </div>
    );
};

export default HistoryCard;