import React from 'react';
import {
  ArrowLeft, ArrowLeftRight, ArrowRight, Banknote, Building2, CalendarDays,
  Check, ChevronDown, ClipboardCheck, Download, Eye, FileCheck2, FileText, Filter,
  History, KeyRound, Landmark, Loader2, Menu, Pencil, Plus, RefreshCw,
  Search, Settings, ShieldCheck, Trash2, Upload, UserPlus, Users, Wallet, X,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DialogTitle } from '@/components/ui/dialog';

function nodeText(children: React.ReactNode): string {
  return React.Children.toArray(children).map(child => {
    if (typeof child === 'string' || typeof child === 'number') return String(child);
    return React.isValidElement<{ children?: React.ReactNode }>(child) ? nodeText(child.props.children) : '';
  }).join(' ');
}

function hasIcon(children: React.ReactNode): boolean {
  return React.Children.toArray(children).some(child => {
    if (!React.isValidElement<{ children?: React.ReactNode }>(child)) return false;
    if (child.type === 'svg' || (typeof child.type !== 'string' && child.type !== React.Fragment)) return true;
    return hasIcon(child.props.children);
  });
}

function iconFor(text: string, fallback: LucideIcon): LucideIcon {
  if (/loading|submitting|uploading|registering|requesting|downloading/i.test(text)) return Loader2;
  if (/close|dismiss|cancel navigation/i.test(text)) return X;
  if (/navigation|menu/i.test(text)) return Menu;
  if (/refresh|retry|reset|recheck|reload/i.test(text)) return RefreshCw;
  if (/download/i.test(text)) return Download;
  if (/upload|attach|signed image/i.test(text)) return Upload;
  if (/delete|remove|cancel/i.test(text)) return Trash2;
  if (/back|previous/i.test(text)) return ArrowLeft;
  if (/review/i.test(text)) return ClipboardCheck;
  if (/confirm|submit|save|approve/i.test(text)) return Check;
  if (/add|new investor|register.*investor/i.test(text)) return /investor|holder|nominee/i.test(text) ? UserPlus : Plus;
  if (/edit|correct|change/i.test(text)) return Pencil;
  if (/search|find|look up|load /i.test(text)) return Search;
  if (/filter/i.test(text)) return Filter;
  if (/credentials|secret|password/i.test(text)) return KeyRound;
  if (/authorization|access|kyc|fatca|compliance/i.test(text)) return ShieldCheck;
  if (/bank|mandate|cheque/i.test(text)) return Landmark;
  if (/folio|switch|transfer|stp/i.test(text)) return ArrowLeftRight;
  if (/sip|swp|plan|installment|schedule|date|step-up|top-up/i.test(text)) return CalendarDays;
  if (/pay|payout|refund|redemption|withdraw/i.test(text)) return Banknote;
  if (/buy|invest|fund/i.test(text)) return Wallet;
  if (/entity|ubo|company|huf/i.test(text)) return Building2;
  if (/investor|client|holder|nominee|users/i.test(text)) return Users;
  if (/history|lifecycle|session/i.test(text)) return History;
  if (/document|image|aof|poa/i.test(text)) return FileCheck2;
  if (/report|master|records|transaction|declaration/i.test(text)) return FileText;
  if (/setting|admin/i.test(text)) return Settings;
  if (/view|details|show/i.test(text)) return Eye;
  return fallback;
}

export function NSEIcon({ label, className, fallback = FileText }: { label?: React.ReactNode; className?: string; fallback?: LucideIcon }) {
  const text = nodeText(label);
  const Icon = iconFor(text, fallback);
  return <Icon aria-hidden="true" focusable="false" data-nse-icon className={cn('h-4 w-4 shrink-0', Icon === Loader2 && 'animate-spin', className)} />;
}

export const NSEButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ children, className, ...props }, ref) => <button ref={ref} className={cn('inline-flex items-center gap-2', className)} {...props}>
    {!hasIcon(children) && <NSEIcon label={props['aria-label'] || children} fallback={ArrowRight} />}
    {children}
  </button>,
);
NSEButton.displayName = 'NSEButton';

export function NSEHeading({ as: Tag = 'h3', children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement> & { as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' }) {
  return <Tag className={cn('flex items-center gap-2', className)} {...props}>
    {!hasIcon(children) && <NSEIcon label={children} />}{children}
  </Tag>;
}

export function NSESummary({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <summary className={cn('cursor-pointer list-none', className)} {...props}>
    <span className="inline-flex items-center gap-2">{!hasIcon(children) && <NSEIcon label={children} />}{children}<ChevronDown aria-hidden="true" className="h-3.5 w-3.5 shrink-0 opacity-60" /></span>
  </summary>;
}

export const NSEDialogTitle = React.forwardRef<React.ElementRef<typeof DialogTitle>, React.ComponentPropsWithoutRef<typeof DialogTitle>>(
  ({ children, className, ...props }, ref) => <DialogTitle ref={ref} className={cn('flex items-center gap-2', className)} {...props}>
    {!hasIcon(children) && <NSEIcon label={children} className="h-5 w-5 text-[#102B78]" />}{children}
  </DialogTitle>,
);
NSEDialogTitle.displayName = 'NSEDialogTitle';
