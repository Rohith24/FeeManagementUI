import React from 'react';
import HistoryCard from './HistoryCard';

const HistoryList = ({ history }) => {
    return (
        <div className='overflow-auto flex flex-col'>
            {history.map((historyItem) => (
                <HistoryCard key={historyItem.historyId} historyItem={historyItem} />
            ))}
        </div>
    );
};

export default HistoryList;
