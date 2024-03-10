import { fireEvent, render, screen } from "@testing-library/react";
import { StaticRouter } from "react-router-dom/server";
import { AuthContext } from "../../Context/AuthContext";
import { CommonContext } from "../../Context/CommonContext";
import { TableContext } from "../../Context/TableContext";
import '@testing-library/jest-dom'
import NavBar from "../NavBar";
const mockedSetFn = jest.fn();
const BaseComponent = ({ component: Component, props }) => {
    return (<StaticRouter>
        <AuthContext.Provider value={{ isLoggedIn: true, setIsLoggedIn: mockedSetFn, isAdmin: true, setIsAdmin: mockedSetFn }}>
            <CommonContext.Provider value={{ errorMessage: "", setErrorMessage: mockedSetFn }}>
                <TableContext.Provider value={{ tableData: null, setTableData: mockedSetFn, organizationList: [], setOrganizationList: mockedSetFn, tableColumnData: null, setTableColumnData: mockedSetFn }}>
                    <Component {...props} />
                </TableContext.Provider>
            </CommonContext.Provider>
        </AuthContext.Provider>
    </StaticRouter>);
}
describe("NavBar Section", () => {
    beforeEach(() => {
        localStorage.setItem("userDetails", JSON.stringify({
            "sub": "127890",
            "username": "John Doe",
            "isAdmin": true,
            "iat": 1717239022
        }))
        return render(<><BaseComponent component={NavBar} props={{}} /></>)
    });
    it("should contain Report", () => {
        const navElement = screen.getByText(/Report/i);
        screen.debug()
        expect(navElement).toBeInTheDocument();
    });
    it("Should contain Upload", () => {
        const headerElement = screen.getByText(/Upload/i);
        expect(headerElement).toBeInTheDocument();
    });
});

