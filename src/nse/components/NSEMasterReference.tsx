import { NSEButton, NSEHeading } from '../components/NSEPresentation';
import React, { useEffect, useMemo, useState } from 'react';
import { nseApi, NSE_MASTER_FILE_TYPES, type NSEMasterFileType } from '../services/nseApi';
import { parseNSEMasterTable } from './NSEMasterPreview';

const PAGE_SIZE = 25;

export default function NSEMasterReference({ fileType }: { fileType: NSEMasterFileType }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(''); setText(''); setPage(1);
    nseApi.downloadMaster({ file_type: fileType }).then(result => {
      if (!cancelled) setText(result);
    }).catch(failure => {
      if (!cancelled) setError(failure instanceof Error ? failure.message : 'Unable to load master records');
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [fileType, version]);

  const table = useMemo(() => parseNSEMasterTable(text), [text]);
  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return table?.rows.filter(row => !query || row.some(value => value.toLowerCase().includes(query))) || [];
  }, [table, search]);
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages);

  return <section aria-label={`${fileType} reference data`} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <NSEHeading as="h2" className="text-lg font-bold text-slate-900">{NSE_MASTER_FILE_TYPES[fileType]}</NSEHeading>
      <NSEButton type="button" disabled={loading} onClick={() => setVersion(value => value + 1)} className="rounded-lg border border-[#102B78] px-4 py-2 text-sm font-semibold text-[#102B78] disabled:opacity-50">Refresh {fileType}</NSEButton>
    </div>
    {loading && <p role="status" className="text-sm text-[#102B78]">Loading reference data...</p>}
    {error && <div role="alert" className="text-sm text-rose-700"><p>{error}</p><NSEButton type="button" onClick={() => setVersion(value => value + 1)} className="mt-2 underline">Retry {fileType}</NSEButton></div>}
    {!loading && !error && table && <>
      <label className="block text-sm font-semibold">Search reference records<input aria-label={`Search ${fileType} reference`} value={search} onChange={event => { setSearch(event.target.value); setPage(1); }} placeholder="Search any column" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" /></label>
      <p role="status" className="text-xs text-slate-500">{rows.length.toLocaleString('en-IN')} records | {table.headers.length} columns</p>
      <div className="max-h-[65vh] overflow-auto rounded-xl border border-slate-200">
        <table aria-label={`${fileType} master records`} className="w-full text-left text-xs">
          <thead className="sticky top-0 bg-slate-100 text-slate-700"><tr>{table.headers.map((header, index) => <th key={index} scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">{header}</th>)}</tr></thead>
          <tbody>{rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((row, index) => <tr key={`${currentPage}-${index}`} className="border-t border-slate-100 even:bg-slate-50">{row.map((value, column) => <td key={column} className="max-w-md whitespace-nowrap px-4 py-3 text-slate-700">{value || '-'}</td>)}</tr>)}</tbody>
        </table>
      </div>
      {!rows.length && <p className="text-sm text-slate-500">No matching reference records.</p>}
      {pages > 1 && <nav aria-label={`${fileType} reference pagination`} className="flex items-center justify-between gap-3 text-sm">
        <NSEButton disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} className="rounded-lg border px-3 py-2 disabled:opacity-40">Previous records</NSEButton>
        <span>Page {currentPage} of {pages}</span>
        <NSEButton disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)} className="rounded-lg border px-3 py-2 disabled:opacity-40">Next records</NSEButton>
      </nav>}
    </>}
    {!loading && !error && !table && <pre className="max-h-[60vh] overflow-auto rounded-lg bg-slate-50 p-4 text-xs">{text || 'No reference data returned.'}</pre>}
  </section>;
}
