import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import NSEUccRegistration from './NSEUccRegistration';
import { UCC_NOMINEE_FIELDS } from '../services/nseUccNomineeService';
import { NSE_TOKEN_KEY } from '../services/nseApi';
import { validUccValues as v } from '../services/fixtures/nseUccRegistration';

afterEach(() => { cleanup(); vi.unstubAllGlobals(); sessionStorage.clear(); });
const fill = (label: string, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } });
function reviewRegistration(onClose = vi.fn(), onViewReport = vi.fn(), nomineeCount = 0) {
  sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token');
  render(<NSEUccRegistration onClose={onClose} onViewReport={onViewReport} />);
  for (const [label, key] of [['Client code', 'client_code'], ['First name', 'primary_holder_first_name'], ['Last name (optional)', 'primary_holder_last_name'], ['Investor type', 'tax_status'], ['Gender', 'gender'], ['Date of birth', 'primary_holder_dob_incorporation'], ['Occupation', 'occupation_code'], ['PAN', 'primary_holder_pan']]) fill(label, v[key]);
  fireEvent.click(screen.getByRole('button', { name: '2. Bank details' }));
  for (const [label, key] of [['Account type', 'account_type_1'], ['Bank account number', 'account_no_1'], ['Confirm bank account number', 'confirm_account'], ['IFSC', 'ifsc_code_1'], ['Receive dividends by', 'div_pay_mode']]) fill(label, v[key]);
  fireEvent.click(screen.getByRole('button', { name: '3. Contact and address' }));
  for (const [label, key] of [['Address line 1', 'address_1'], ['Address line 2', 'address_2'], ['Address line 3', 'address_3'], ['City', 'city'], ['State', 'state'], ['Pincode', 'pincode'], ['Country', 'country'], ['Email', 'email'], ['Communication preference', 'communication_mode'], ['Mobile number', 'indian_mobile_no']]) fill(label, v[key]);
  fireEvent.click(screen.getByRole('button', { name: '4. KYC and declarations' }));
  for (const [label, key] of [['KYC type', 'primary_holder_kyc_type'], ['Aadhaar updated', 'aadhaar_updated'], ['Registration method', 'paperless_flag'], ['Mobile number belongs to', 'mobile_declaration_flag'], ['Email address belongs to', 'email_declaration_flag']]) fill(label, v[key]);
  fireEvent.click(screen.getByRole('button', { name: '5. Nomination' }));
  if (!nomineeCount) {
    fill('Nomination choice', 'N'); fill('Confirm nomination using', 'O'); fill('Nominee opt-out reference number', 'TESTOTP001');
  } else {
    fill('Nomination choice', 'Y'); fill('Confirm nomination using', 'O'); fill('Show nominee name on statements', 'Y');
    for (let index = 1; index <= nomineeCount; index++) {
      if (index > 1) fireEvent.click(screen.getByRole('button', { name: '+ Add another nominee' }));
      for (const field of UCC_NOMINEE_FIELDS) {
        const value = field.suffix === 'applicable' ? (index === 1 ? '60' : '40') : field.suffix === 'name' ? (index === 1 ? 'First' : 'Second') : v[`nominee_1_${field.suffix}`] || '';
        fill(index === 1 ? field.label : `Nominee ${index}: ${field.label}`, value);
      }
    }
  }
  fireEvent.click(screen.getByRole('button', { name: 'Review registration' }));
  expect(screen.getByRole('heading', { name: 'Review investor registration' })).toBeInTheDocument();
}
it('requires consent, submits once, blocks edits while pending and displays the matching Mutual funds registration', async () => {
  let finish!: (value: unknown) => void;
  const fetcher = vi.fn((_url: string, _init: RequestInit) => new Promise(resolve => { finish = resolve; })); vi.stubGlobal('fetch', fetcher);
  const onClose = vi.fn(), onViewReport = vi.fn();
  reviewRegistration(onClose, onViewReport);
  expect(screen.getByRole('button', { name: "Submit to Mutual funds" })).toBeDisabled();
  expect(fetcher).not.toHaveBeenCalled();
  expect(screen.queryByText(v.primary_holder_pan)).not.toBeInTheDocument();
  expect(screen.queryByText(v.account_no_1)).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('checkbox', { name: /I confirm these investor details/ }));
  const submit = screen.getByRole('button', { name: "Submit to Mutual funds" });
  fireEvent.click(submit); fireEvent.click(submit);
  expect(fetcher).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('button', { name: 'Edit registration' })).toBeDisabled();
  fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
  expect(onClose).not.toHaveBeenCalled();
  const body = JSON.parse(String(fetcher.mock.calls[0][1].body));
  expect(body.reg_details[0]).toMatchObject({ client_code: v.client_code, primary_holder_dob_incorporation: '02/01/1990', holding_nature: 'SI', client_type: 'P', country: 'INDIA', nomination_opt: 'N', nominee_opt_out_ref_no: 'TESTOTP001' });
  expect(body.reg_details[0]).not.toHaveProperty('confirm_account');
  finish({ ok: true, status: 200, text: async () => JSON.stringify({ reg_details: [{ client_code: v.client_code, reg_status: 'REG_SUCCESS', reg_id: '12345', reg_remark: 'Client registered' }] }) });
  expect(await screen.findByRole('heading', { name: "Mutual funds investor registered" })).toBeInTheDocument();
  expect(screen.getByText('Registration ID: 12345')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'View Client Registration Report' }));
  expect(onViewReport).toHaveBeenCalledTimes(1);
});
it('shows an uncertain network result without allowing a blind retry', async () => {
  const fetcher = vi.fn().mockRejectedValue(new Error('timeout')); vi.stubGlobal('fetch', fetcher);
  reviewRegistration();
  fireEvent.click(screen.getByRole('checkbox', { name: /I confirm these investor details/ }));
  fireEvent.click(screen.getByRole('button', { name: "Submit to Mutual funds" }));
  expect(await screen.findByRole('heading', { name: 'Registration confirmation unknown' })).toBeInTheDocument();
  expect(fetcher).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole('button', { name: "Submit to Mutual funds" })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Correct registration details' })).not.toBeInTheDocument();
});
it('shows a confirmed rejection and allows corrections with fresh consent', async () => {
  const fetcher = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ reg_details: [{ client_code: v.client_code, reg_status: 'REG_FAILED', reg_remark: 'Client code already exists' }] }) }); vi.stubGlobal('fetch', fetcher);
  reviewRegistration();
  fireEvent.click(screen.getByRole('checkbox', { name: /I confirm these investor details/ }));
  fireEvent.click(screen.getByRole('button', { name: "Submit to Mutual funds" }));
  expect(await screen.findByRole('heading', { name: "Mutual funds registration rejected" })).toBeInTheDocument();
  expect(screen.getByRole('alert')).toHaveTextContent('Client code already exists');
  fireEvent.click(screen.getByRole('button', { name: 'Correct registration details' }));
  fireEvent.click(screen.getByRole('button', { name: 'Review registration' }));
  expect(screen.getByRole('button', { name: "Submit to Mutual funds" })).toBeDisabled();
  expect(fetcher).toHaveBeenCalledTimes(1);
});

it('reviews and submits two nominees with their individual allocation and no opt-out field', async () => {
  const fetcher = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ reg_details: [{ client_code: v.client_code, reg_status: 'REG_SUCCESS', reg_id: '12345' }] }) });
  vi.stubGlobal('fetch', fetcher);
  reviewRegistration(vi.fn(), vi.fn(), 2);
  expect(screen.getByText('Nominee 1: Share (%)')).toBeInTheDocument();
  expect(screen.getByText('Nominee 2: Share (%)')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('checkbox', { name: /I confirm these investor details/ }));
  fireEvent.click(screen.getByRole('button', { name: "Submit to Mutual funds" }));
  expect(await screen.findByRole('heading', { name: "Mutual funds investor registered" })).toBeInTheDocument();
  expect(fetcher).toHaveBeenCalledTimes(1);
  const row = JSON.parse(String(fetcher.mock.calls[0][1].body)).reg_details[0];
  expect(row).toMatchObject({ nominee_1_name: 'First', nominee_2_name: 'Second', nominee_1_applicable: '60', nominee_2_applicable: '40', nominee_2_identity_number: v.nominee_1_identity_no, nominee_2_pin: v.nominee_1_pincode });
  for (const key of ['nominee_count', 'nominee_3_name', 'nominee_opt_out_ref_no']) expect(row).not.toHaveProperty(key);
});
