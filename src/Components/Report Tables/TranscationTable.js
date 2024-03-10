import React from 'react'
import { useTable, useSortBy, useGlobalFilter } from 'react-table'
import { GlobalFilter } from './GlobalFilter'

export const TranscationTable = ({ data, columns }) => {

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        footerGroups,
        rows,
        prepareRow,
        state, 
        setGlobalFilter
    } = useTable(
        {
            columns,
            data
        },
        useGlobalFilter,
        useSortBy
    )
    const { globalFilter } = state
    //{`${index % 2 === 0 ? 'bg-green-100' : 'bg-white'} hover:bg-green-300`}
    return (
        <div className='overflow-auto m-[10px]'>
            <div className='flex justify-between'>
                <div className="mb-2 mt-0 text-2xl font-medium leading-tight text-primary">
                    Transaction Details
                </div>
                <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
            </div>

            <table {...getTableProps()} className="table-auto w-full">
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()} className="bg-green-300">
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
                            <tr {...row.getRowProps()} className='bg-white hover:bg-green-100'>
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
                        <tr {...footerGroup.getFooterGroupProps()} className="bg-green-300">
                            {footerGroup.headers.map(column => (
                                <td {...column.getFooterProps()} className="p-2 font-semibold border border-gray-300">{column.render('Footer')}</td>
                            ))}
                        </tr>
                    ))}
                </tfoot>
            </table>
        </div>
    )
}