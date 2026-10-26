import React from 'react';

export default function NSEFlowSteps({ steps, current }: { steps: string[]; current: number }) {
  return <ol aria-label="Your progress" className="flex flex-wrap gap-x-4 gap-y-2 rounded-xl bg-slate-50 p-3">
    {steps.map((label, index) => <li key={label} aria-current={index === current ? 'step' : undefined} className={`flex items-center gap-2 text-xs leading-5 ${index === current ? 'font-semibold text-[#102B78]' : 'text-slate-500'}`}>
      <span aria-hidden="true" className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${index === current ? 'bg-[#102B78] text-white' : 'border border-slate-200 bg-white'}`}>{index + 1}</span>{label}
    </li>)}
  </ol>;
}
