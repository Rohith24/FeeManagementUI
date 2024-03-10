import { fireEvent, render, screen } from "@testing-library/react";
import Header from "../Header";
import { StaticRouter } from "react-router-dom/server";
import { AuthContext } from "../../Context/AuthContext";
import { CommonContext } from "../../Context/CommonContext";
import { TableContext } from "../../Context/TableContext";
import '@testing-library/jest-dom'
import Login from "../Authentication/Login";
import { MemoryRouter } from "react-router-dom";
const mockedSetFn = jest.fn();
const BaseComponent = ({ component: Component, props }) => {
    return (<MemoryRouter>
        <AuthContext.Provider value={{ isLoggedIn: true, setIsLoggedIn: mockedSetFn, isAdmin: false, setIsAdmin: mockedSetFn }}>
            <CommonContext.Provider value={{ errorMessage: "", setErrorMessage: mockedSetFn }}>
                <TableContext.Provider value={{ tableData: [], setTableData: mockedSetFn, organizationList: [], setOrganizationList: mockedSetFn, tableColumnData: [], setTableColumnData: mockedSetFn }}>
                    <Component {...props} />
                </TableContext.Provider>
            </CommonContext.Provider>
        </AuthContext.Provider>
    </MemoryRouter>);
}
describe("Header Section", () => {
    beforeEach(() => {
        return render(<><BaseComponent component={Header} props={{}} /></>)
    })
    it("should render the same text passed into title prop", () => {
        const headerElement = screen.getByText(/FEE MANAGEMENT/i);
        expect(headerElement).toBeInTheDocument();
    });
    it("should render logout button", () => {
        const headerElement = screen.getByText(/logout/i);
        expect(headerElement).toBeInTheDocument();
    });
});

