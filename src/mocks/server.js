import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { API_URL } from '../Services/ReportService';
import { organizationsResponce } from '../Data/testsData/mockdata';

const server = setupServer(
    // // Define your API request handlers here
    rest.get(`${API_URL}/organization/vieworganizations`, (req, res, ctx) => {
        return res(ctx.json(organizationsResponce));
    }),

    rest.get('/api/data2', (req, res, ctx) => {
        return res(ctx.json({ data: 'Mocked data for /api/data2' }));
    }),
);

export { server };