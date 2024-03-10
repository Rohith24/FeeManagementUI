import React, { useMemo } from 'react'
import { useTable, useSortBy, useGlobalFilter } from 'react-table'
import { Student_GROUPED_COLUMNS } from '../../Configs/columns'
import { useNavigate } from 'react-router-dom'

export const StudentTable = ({ data }) => {

    const columns = useMemo(() => Student_GROUPED_COLUMNS(data), [])
    const navigate = useNavigate();

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        footerGroups,
        rows,
        prepareRow
    } = useTable(
        {
            columns,
            data
        },
        useGlobalFilter,
        useSortBy
    )
    return (
        <div className='overflow-auto m-[10px]'>
            <div className='flex justify-between'>
                <div className="mb-2 mt-0 text-2xl font-medium leading-tight text-primary">
                    Student Fee Details
                </div>
                <div>
                <button className="mx-2 h-9 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => { navigate('/report'); }}>
                    Go Back to Student Report
                    </button>
            </div>
            </div>
            <div className="flex justify-content-center">
                <table {...getTableProps()} className="table-auto mx-auto">
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()} className="bg-blue-200">
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())} className="p-2 font-semibold border border-gray-300">
                                        {column.render('Header')}
                                        <span>
                                            {column.isSorted
                                                ? column.isSortedDesc
                                                    ? ' 🔽'
                                                    : ' 🔼'
                                                : ''}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map((row, index) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()} className='bg-white hover:bg-blue-100'>
                                    {row.cells.map(cell => (
                                        <td {...cell.getCellProps()} className="p-2 border">
                                            {cell.render('Cell')}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        {footerGroups.map(footerGroup => (
                            <tr {...footerGroup.getFooterGroupProps()} className="bg-blue-200">
                                {footerGroup.headers.map(column => (
                                    <th {...column.getFooterProps()} className="p-2 font-semibold border border-gray-300">{column.render('Footer')}</th>
                                ))}
                            </tr>
                        ))}
                    </tfoot>
                </table>
            </div>

        </div>
    )

}
