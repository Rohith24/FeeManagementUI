import React from 'react';
const XLSX = require('xlsx');
// exportToExcel.js

const exportToExcel = (tableId, fileName) => {
    const table = document.getElementById(tableId);
    const sheetData = XLSX.utils.table_to_sheet(table);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheetData, 'Sheet1');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

const ExportButton = ({ tableId, fileName }) => {

    const handleExport = () => {
        exportToExcel(tableId, fileName);
    };

    return (
        <button onClick={handleExport} className="mx-2 h-9 text-sm bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded">
            Export to Excel
        </button>
    );
};

export default ExportButton;
