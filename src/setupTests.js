// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
// src/setupTests.js
import { server } from './mocks/server';

// Start the mock server
beforeAll(() => server.listen());

// Clean up the mock server after all tests are done
afterAll(() => server.close());
