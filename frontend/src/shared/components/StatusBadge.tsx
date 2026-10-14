export type CustomerStatus = 'new' | 'active' | 'matched' | 'paused' | 'closed';

interface Props {
  status: CustomerStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<
  CustomerStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  new: {
    label: 'New',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/25',
    dot: 'bg-blue-400',
  },
  active: {
    label: 'Active',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/25',
    dot: 'bg-emerald-400',
  },
  matched: {
    label: 'Matched',
    bg: 'bg-fuchsia-500/10',
    text: 'text-fuchsia-400',
    border: 'border-fuchsia-500/25',
    dot: 'bg-fuchsia-400',
  },
  paused: {
    label: 'Paused',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/25',
    dot: 'bg-amber-400',
  },
  closed: {
    label: 'Closed',
    bg: 'bg-slate-500/10',
    text: 'text-slate-400',
    border: 'border-slate-500/25',
    dot: 'bg-slate-400',
  },
};

export function StatusBadge({ status, size = 'sm' }: Props) {
  const config = statusConfig[status] ?? statusConfig.new;
  const isSm = size === 'sm';

  return (
    <span
      className={`inline-flex items-center rounded-md font-semibold border capitalize leading-none tracking-wide ${
        config.bg
      } ${config.text} ${config.border} ${
        isSm ? 'px-2.5 py-1 text-[11px] gap-1.5' : 'px-3.5 py-1.5 text-xs gap-2'
      }`}
    >
      <span className={`rounded-full shrink-0 ${config.dot} ${isSm ? 'w-1.5 h-1.5' : 'w-2 h-2'}`} />
      <span>{config.label}</span>
    </span>
  );
}
