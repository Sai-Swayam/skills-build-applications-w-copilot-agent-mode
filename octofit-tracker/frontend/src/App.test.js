import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders the octofit navigation menu', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByRole('heading', { name: /frontend connected to the django rest api/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /users/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /activities/i })).toBeInTheDocument();
});
