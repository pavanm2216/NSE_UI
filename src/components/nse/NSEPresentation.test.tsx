import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Search } from 'lucide-react';
import { NSEButton, NSEHeading, NSESummary } from './NSEPresentation';

afterEach(cleanup);

it('keeps native form submission and accessible button text with a decorative icon', () => {
  const submit = vi.fn(event => event.preventDefault());
  render(<form onSubmit={submit}><NSEButton>Load transactions</NSEButton></form>);
  const button = screen.getByRole('button', { name: 'Load transactions' });
  expect(button.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  fireEvent.click(button);
  expect(submit).toHaveBeenCalledTimes(1);
});

it('preserves existing icons, disabled state and click behavior', () => {
  const click = vi.fn();
  render(<NSEButton disabled onClick={click}><Search aria-hidden="true" />Search</NSEButton>);
  const button = screen.getByRole('button', { name: 'Search' });
  expect(button.querySelectorAll('svg')).toHaveLength(1);
  fireEvent.click(button);
  expect(click).not.toHaveBeenCalled();
});

it('retains heading levels and native expandable-panel behavior', () => {
  render(<><NSEHeading as="h2">Investor profiles</NSEHeading><details><NSESummary>View bank details</NSESummary><p>Bank information</p></details></>);
  expect(screen.getByRole('heading', { name: 'Investor profiles', level: 2 })).toBeInTheDocument();
  const summary = screen.getByText('View bank details').closest('summary');
  fireEvent.click(summary!);
  expect(summary?.parentElement).toHaveAttribute('open');
});
