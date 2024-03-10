import { format } from 'date-fns'
import React from 'react'

import { Link } from 'react-router-dom';

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}

export const GROUPED_COLUMNS = (financialYear) => {
    return [
    // {
    //   Header: 'SL No',
    //   Footer: 'SL No',
    //   accessor: 'SLNo',
    //   //disableFilters: true,
    //   //sticky: 'left'
    // },
    {
        Header: 'Unique ID',
        Footer: 'Total',
        accessor: '_id',
        Cell: ({ value, row }) => {
            return (<div className='underline cursor-pointer'>
                <Link to={'/report/' + value} title='click here to see transactions'>{value}</Link>
            </div>)
        }
        //sticky: 'left'
    },
    {
        Header: 'Roll No',
        accessor: 'rollno',
    },
    {
        Header: 'Name',
        accessor: 'name',
        width: 300
        //sticky: 'left'
    },
    {
        Header: 'Father Name',
        accessor: 'fatherName',
        show: false,
        //sticky: 'left'
    },
    //{
    //  Header: 'Date of Birth',
    //  accessor: 'dob',
    //  Cell: ({ value }) => {
    //    return format(new Date(value), 'dd/MM/yyyy')
    //  }
    //  //sticky: 'left'
    //},
    //{
    //  Header: 'Gender',
    //  accessor: 'gender',
    //  //sticky: 'left'
    //},
    //{
    //  Header: 'Father Name',
    //  accessor: 'fatherName',
    //  //sticky: 'left'
    //},
    //{
    //    Header: 'Category',
    //  accessor: 'category',
    //  //sticky: 'left'
    //},
    {
        Header: 'Phone Number',
        accessor: 'mobileNumber',
        //sticky: 'left'
    },
    {
        Header: 'Joining Year',
        accessor: 'joiningYear',
        //sticky: 'left'
    },
    {
        Header: 'Course',
        Cell: ({ value }) => value.replace('_', ' '),
        accessor: 'course',
        //sticky: 'left'
    },
    {
        Header: 'Opening Balance',
        Footer: (data) => {
            var splitYears = financialYear.split('-');
            var prevFinancialYear = `${splitYears[0] - 1}-${splitYears[1] - 1}`;
            const total = React.useMemo(
                () => {
                    return data.rows.reduce((sum, row) => {
                        if (row.original.pendingFees && row.original.pendingFees[prevFinancialYear]) {
                            sum = sum + Object.values(row.original.pendingFees[prevFinancialYear]).reduce((s, i) => (s + i), 0) || 0;
                        }
                        return sum;
                    }, 0);
                },
                [data.rows, prevFinancialYear]
            );
            return formatCurrency(total || 0);
        },
        accessor: (item) => {
            if (item.pendingFees) {
                var splitYears = financialYear.split('-');
                var prevFinancialYear = `${splitYears[0] - 1}-${splitYears[1] - 1}`;
                return Object.values(item.pendingFees[prevFinancialYear] || 0).reduce((s, v) => s + v, 0);
            }
            return 0;
        },
        Cell: ({ value }) => formatCurrency(value || 0),
        //sticky: 'left'
    },
    {
        Header: 'Total Fee Demand',
        Footer: (data) => {
            const total = React.useMemo(
                () => {
                    return data.rows.reduce((sum, row) => {
                        if (row.original.yearWiseFees && row.original.yearWiseFees[financialYear]) {
                            sum = sum + Object.values(row.original.yearWiseFees[financialYear]).reduce((s, i) => (s + i), 0) || 0;
                        }
                        return sum;
                    }, 0);
                },
                [data.rows]
            );
            return <>This Year Demand = {formatCurrency(total)}</>;
        },
        columns: [
            {
                Header: 'Tution Fee Demand',
                Footer: (data) => {
                    const total = React.useMemo(
                        () => {
                            return data.rows.reduce((sum, row) => {
                                if (row.original.yearWiseFees && row.original.yearWiseFees[financialYear])
                                    return sum + (row.original.yearWiseFees[financialYear].tuitionFee || 0);
                                return sum;
                            }, 0);
                        },
                        [data.rows]
                    );
                    return <>{formatCurrency(total)}</>;
                },
                accessor: (item) => {
                    if (item.yearWiseFees && item.yearWiseFees[financialYear])
                        return item.yearWiseFees[financialYear].tuitionFee || 0;
                    return 0;
                },
                Cell: ({ value }) => formatCurrency(value || 0),
            },
            {
                Header: 'Other Fees Demand',
                Footer: (data) => {
                    const total = React.useMemo(
                        () => {
                            return data.rows.reduce((sum, row) => {
                                if (row.original.yearWiseFees && row.original.yearWiseFees[financialYear])
                                    return sum + (Object.values(row.original.yearWiseFees[financialYear]).reduce((s, v) => s + v, 0) - (row.original.yearWiseFees[financialYear].tuitionFee || 0));
                                return sum;
                            }, 0);
                        },
                        [data.rows]
                    );
                    return <>{formatCurrency(total)}</>;
                },
                accessor: (item) => {
                    if (item.yearWiseFees && item.yearWiseFees[financialYear])
                        return Object.values(item.yearWiseFees[financialYear]).reduce((s, v) => s + v, 0) - (item.yearWiseFees[financialYear].tuitionFee || 0);
                    return 0;
                },
                Cell: ({ value }) => formatCurrency(value || 0),
            },
        ]
    },

    {
        Header: `This Financial Year (${financialYear}) Collected`,
        Footer: (data) => {
            const total = React.useMemo(
                () => {
                    return data.rows.reduce((sum, row) => {
                        if (row.original.financialYearWiseFeesPaid && row.original.financialYearWiseFeesPaid[financialYear]) {
                            sum = sum + Object.values(row.original.financialYearWiseFeesPaid[financialYear]).reduce((s, i) => (s + i), 0) || 0;
                        }
                        return sum;
                    }, 0);
                },
                [data.rows]
            );
            return <>This Year Collected = {formatCurrency(total)}</>;
        },
        columns: [
            {
                Header: 'Tution Fee',
                Footer: (data) => {
                    const total = React.useMemo(
                        () => {
                            return data.rows.reduce((sum, row) => {
                                if (row.original.financialYearWiseFeesPaid && row.original.financialYearWiseFeesPaid[financialYear])
                                    return sum + (row.original.financialYearWiseFeesPaid[financialYear].tuitionFee || 0);
                                return sum;
                            }, 0);
                        },
                        [data.rows]
                    );
                    return <>{formatCurrency(total)}</>;
                },
                accessor: (item) => {
                    if (item.financialYearWiseFeesPaid && item.financialYearWiseFeesPaid[financialYear])
                        return item.financialYearWiseFeesPaid[financialYear].tuitionFee || 0;
                    return 0;
                },
                Cell: ({ value }) => formatCurrency(value || 0),
            },
            {
                Header: 'Other Fees',
                Footer: (data) => {
                    const total = React.useMemo(
                        () => {
                            return data.rows.reduce((sum, row) => {
                                if (row.original.financialYearWiseFeesPaid && row.original.financialYearWiseFeesPaid[financialYear])
                                    return sum + (Object.values(row.original.financialYearWiseFeesPaid[financialYear] || [0]).reduce((s, v) => s + v, 0) - (row.original.financialYearWiseFeesPaid[financialYear].tuitionFee || 0));
                                return sum;
                            }, 0);
                        },
                        [data.rows]
                    );
                    return <>{formatCurrency(total)}</>;
                },
                accessor: (item) => {
                    if (item.financialYearWiseFeesPaid && item.financialYearWiseFeesPaid[financialYear])
                        return Object.values(item.financialYearWiseFeesPaid[financialYear]).reduce((s, v) => s + v, 0) - (item.financialYearWiseFeesPaid[financialYear].tuitionFee || 0);
                    return 0;
                },
                Cell: ({ value }) => formatCurrency(value || 0),
            },

        ]
    },
    {
        Header: 'Total Fees Collected',
        Footer: (data) => {
            const total = React.useMemo(
                () => data.rows.reduce((sum, row) => {
                    if (row.original.totalFeesPaid && row.original.totalFeesPaid[financialYear]) {
                        return sum + row.original.totalFeesPaid[financialYear];
                    }
                    return sum;
                }, 0),
                [data.rows]
            );
            return <>{formatCurrency(total || 0)}</>;
        },
        accessor: (item) => {
            if (item.totalFeesPaid && item.totalFeesPaid[financialYear])
                return item.totalFeesPaid[financialYear];
            return 0;
        },
        Cell: ({ value }) => formatCurrency(value || 0),
        //sticky: 'left'
    },
    {
        Header: 'Excess Fees',
        Footer: (data) => {
            const total = React.useMemo(
                () => {
                    return data.rows.reduce((sum, row) => {
                        if (row.original.pendingFees && row.original.pendingFees[financialYear]) {
                            var excess = Object.values(row.original.pendingFees[financialYear] || [0]).reduce((s, v) => s + v, 0);
                            return sum + (excess >= 0 ? 0 : -excess);
                        }
                        return sum;
                    }, 0);
                },
                [data.rows]
            );
            return <>{formatCurrency(total)}</>;
        },
        accessor: (item) => {
            if (item.pendingFees && item.pendingFees[financialYear]) {
                var excess = Object.values(item.pendingFees[financialYear]).reduce((s, v) => s + v, 0);
                return excess >= 0 ? 0 : -excess;
            }
            return 0;
        },
        Cell: ({ value }) => formatCurrency(value || 0),
        //sticky: 'left'
    },
    {
        Header: 'Total Due',
        Footer: (data) => {
            const total = React.useMemo(
                () => {
                    return data.rows.reduce((sum, row) => {
                        if (row.original.pendingFees && row.original.pendingFees[financialYear]) {
                            sum = sum + Object.values(row.original.pendingFees[financialYear]).reduce((s, i) => (s + i), 0) || 0;
                        }
                        return sum;
                    }, 0);
                },
                [data.rows]
            );
            return <>This Year Due = {formatCurrency(total)}</>;
        },
        columns: [
            {
                Header: 'Due Tution Fee',
                Footer: (data) => {
                    const total = React.useMemo(
                        () => {
                            return data.rows.reduce((sum, row) => {
                                if (row.original.pendingFees && row.original.pendingFees[financialYear])
                                    return sum + (row.original.pendingFees[financialYear].tuitionFee || 0);
                                return sum;
                            }, 0);
                        },
                        [data.rows]
                    );
                    return <>{formatCurrency(total)}</>;
                },
                accessor: (item) => {
                    if (item.pendingFees && item.pendingFees[financialYear])
                        return item.pendingFees[financialYear].tuitionFee || 0;
                    return 0;
                },
                Cell: ({ value }) => formatCurrency(value || 0),
                //sticky: 'left'
            },
            {
                Header: 'Due Other Fees',
                Footer: (data) => {
                    const total = React.useMemo(
                        () => {
                            return data.rows.reduce((sum, row) => {
                                if (row.original.pendingFees && row.original.pendingFees[financialYear])
                                    return sum + (Object.values(row.original.pendingFees[financialYear] || [0]).reduce((s, v) => s + v, 0) - row.original.pendingFees[financialYear].tuitionFee || 0);
                                return sum;
                            }, 0);
                        },
                        [data.rows]
                    );
                    return <>{formatCurrency(total)}</>;
                },
                accessor: (item) => {
                    if (item.pendingFees && item.pendingFees[financialYear])
                        return Object.values(item.pendingFees[financialYear]).reduce((s, v) => s + v, 0) - (item.pendingFees[financialYear].tuitionFee || 0);
                    return 0;
                },
                Cell: ({ value }) => formatCurrency(value || 0),
                //sticky: 'left'
            },

        ]
    },
    //{
    //    Header: 'Actions',
    //    accessor: 'button',
    //    Cell: () => (
    //        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded">
    //            Send
    //        </button>
    //    ),
    //    width: 200,
    //    //sticky: 'left'
    //},
]
}

export const Transcation_GROUPED_COLUMNS = [
    // {
    //   Header: 'SL No',
    //   Footer: 'SL No',
    //   accessor: 'SLNo',
    //   //disableFilters: true,
    //   //sticky: 'left'
    // },
    {
        Header: 'Date',
        accessor: 'transactionDate',
        Cell: ({ value }) => {
            return format(new Date(value), 'dd/MM/yyyy')
        }
        // sticky: 'left'
    },
    {
        Header: 'Bank Reference No',
        accessor: 'bankReferenceNo',
        //sticky: 'left'
    },
    //{
    //  Header: 'Category Name',
    //  accessor: 'collegeName',
    //    //sticky: 'left'
    //},
    //{
    //    Header: 'STUDENT UNIQUE NUMBER',
    //    accessor: 'studentId',
    //    //sticky: 'left'
    //},
    {
        Header: 'Payment Mode',
        accessor: 'paymentMode',
        //sticky: 'left'
    },

    {
        Header: 'Amount',
        Footer: (data) => {
            const total = React.useMemo(
                () => data.rows.reduce((sum, row) => sum + (row.original.amount || 0), 0),
                [data.rows]
            );
            return <>{formatCurrency(total)}</>;
        },
        accessor: 'amount',
        Cell: ({ value }) => formatCurrency(value || 0),
        //sticky: 'left'
    },


    {
        Header: 'COURSE',
        accessor: 'yearAndBranch',
        //sticky: 'left'
    },
    //{
    //    Header: 'TUITION FEE',
    //    Footer: (data) => {
    //        const total = React.useMemo(
    //            () => {
    //                var s = data.rows.reduce((sum, row) => {
    //                    return sum + row.original.feesPaid.tuitionFee;
    //                }, 0);
    //                return s;
    //            },
    //            [data.rows]
    //        );
    //        return <>{total}</>;
    //    },
    //    accessor: 'tuitionFee',

    //    //sticky: 'left'
    //},
    //{
    //    Header: 'UNIVERSITY DEVP FEE',
    //    accessor: 'universityDevpFee',
    //    //sticky: 'left'
    //},
    //{
    //    Header: 'OTHER UNIVERSITY FEE',
    //    accessor: 'otherUNIVFee',
    //    //sticky: 'left'
    //},
    //{
    //    Header: 'EARLIER DUES IF ANY',
    //    accessor: 'earlierDues',
    //    //sticky: 'left'
    //},
    {
        Header: 'Remarks',
        accessor: 'remarks',
        //sticky: 'left'
    },
    {
        Header: 'Status',
        accessor: 'status',
        //sticky: 'left'
    },
]


export const Student_GROUPED_COLUMNS = (data) => {

    var myData = Object.keys(data[0]).map((financialYear) => ({
        Header: `Year - ${financialYear}`,
        columns: [
            {
                Header: `Fee Demand`,
                Footer: (data) => {
                    const total = React.useMemo(
                        () => {
                            return data.rows.reduce((sum, row) => {
                                if (row[financialYear] && row[financialYear].yearWiseFees)
                                    return sum + row[financialYear].yearWiseFees;
                                return sum;
                            }, 0);
                        },
                        [data.rows]
                    );
                    return <>{formatCurrency(total)}</>;
                },
                accessor: `${financialYear}.yearWiseFees`,
                Cell: ({ value }) => formatCurrency(value || 0),
            },
            //{
            //    Header: `Edu year Fee Collected`,
            //    Footer: (data) => {
            //        const total = React.useMemo(
            //            () => {
            //                return data.rows.reduce((sum, row) => {
            //                    if (row[financialYear] && row[financialYear].yearWiseFeesPaid)
            //                        return sum + row[financialYear].yearWiseFeesPaid;
            //                    return sum;
            //                }, 0);
            //            },
            //            [data.rows]
            //        );
            //        return <>{formatCurrency(total)}</>;
            //    },
            //    accessor: `${financialYear}.yearWiseFeesPaid`,
            //    Cell: ({ value }) => formatCurrency(value || 0),
            //},
            {
                Header: `Fee Collected`,
                Footer: (data) => {
                    const total = React.useMemo(
                        () => {
                            return data.rows.reduce((sum, row) => {
                                if (row[financialYear] && row[financialYear].financialYearWiseFeesPaid)
                                    return sum + row[financialYear].financialYearWiseFeesPaid;
                                return sum;
                            }, 0);
                        },
                        [data.rows]
                    );
                    return <>{formatCurrency(total)}</>;
                },
                accessor: `${financialYear}.financialYearWiseFeesPaid`,
                Cell: ({ value }) => formatCurrency(value || 0),
            },
            {
                Header: `Pending Fees`,
                Footer: (data) => {
                    const total = React.useMemo(
                        () => {
                            return data.rows.reduce((sum, row) => {
                                if (row[financialYear] && row[financialYear].pendingFees)
                                    return sum + row[financialYear].pendingFees;
                                return sum;
                            }, 0);
                        },
                        [data.rows]
                    );
                    return <>{formatCurrency(total)}</>;
                },
                accessor: `${financialYear}.pendingFees`,
                Cell: ({ value }) => formatCurrency(value || 0),
            }
        ],
        Footer: `Year - ${financialYear}`
    })).splice(1);

    myData.sort(function (a, b) {
        var headerA = a.Header;
        var headerB = b.Header;

        if (headerA > headerB) {
            return 1;
        } else if (headerA < headerB) {
            return -1;
        } else {
            return 0;
        }
    });
    let finalData =
        [
            {
                Header: 'Title',
                accessor: (item) => item.title.excelColumnName,
                Footer: 'Total',
            },
            ...myData
        ];
    return finalData;
};