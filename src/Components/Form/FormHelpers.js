// Function to generate a list of years for the dropdown
export const generateYears = (startYear, endYear) => {
    const years = [];
    for (let year = startYear; year >= endYear; year--) {
        years.push(year);
    }
    return years;
};

