import React from 'react';

function labelText(node: React.ReactNode): string {
  return React.Children.toArray(node).map(child => {
    if (typeof child === 'string' || typeof child === 'number') return String(child);
    if (!React.isValidElement<{ children?: React.ReactNode }>(child)) return '';
    if (child.type === 'input' || child.type === 'select' || child.type === 'option') return '';
    return labelText(child.props.children);
  }).join(' ');
}

export default function NSESearchFields({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) {
  const fields = React.Children.toArray(children);
  const isPrimary = (field: React.ReactNode) => /client codes?|from date|to date/i.test(labelText(field));
  const primary = fields.filter(isPrimary);
  const advanced = fields.filter(field => !isPrimary(field));
  return <fieldset disabled={disabled} className="min-w-0 space-y-4">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{primary.length ? primary : fields}</div>
    {primary.length > 0 && advanced.length > 0 && <details className="rounded-xl border border-slate-200 bg-slate-50/40 p-4">
      <summary className="cursor-pointer text-sm font-medium text-[#102B78]">More search options</summary>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{advanced}</div>
    </details>}
  </fieldset>;
}
