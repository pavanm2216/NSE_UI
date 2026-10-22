import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';
import App from './App';

const login = vi.hoisted(() => vi.fn());
vi.mock('./services/nseAuth', () => ({ loginToNSE: login }));
vi.mock('./pages/dashboard/NSEDashboard', () => ({ default: () => {
  const location = useLocation();
  return <h1>Dashboard {location.pathname}{location.search}</h1>;
} }));
beforeEach(() => login.mockReset().mockResolvedValue('test-token'));
afterEach(cleanup);

it('opens the current dashboard after signing in on the standalone login page', async () => {
  render(<MemoryRouter initialEntries={['/nse-login']}><App /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'member' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
  fireEvent.click(screen.getByRole('button', { name: 'Sign in to Mutual funds' }));
  await waitFor(() => expect(screen.getByRole('heading', { name: 'Dashboard /mutual-funds/explore-funds' })).toBeInTheDocument());
  expect(login).toHaveBeenCalledWith('member', 'password');
});

it('keeps the section and query when opening an older dashboard link', () => {
  render(<MemoryRouter initialEntries={['/nse-dashboard/sip-and-other-plans?view=xsips']}><App /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: 'Dashboard /mutual-funds/sip-and-other-plans?view=xsips' })).toBeInTheDocument();
});
