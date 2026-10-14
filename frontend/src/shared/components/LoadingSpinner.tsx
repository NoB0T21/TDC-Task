interface Props {
  fullPage?: boolean;
  size?: number;
  label?: string;
}

export function LoadingSpinner({ fullPage = false, size = 36, label }: Props) {
  return (
    <div
      className={`inline-flex flex-col items-center justify-center gap-3 ${
        fullPage ? 'min-h-[60vh] w-full' : ''
      }`}
      role="status"
      aria-label={label ?? 'Loading…'}
    >
      <div
        className="rounded-full border-solid border-white/20 border-t-pink-500 animate-spin"
        style={{
          width: size,
          height: size,
          borderWidth: size < 24 ? 2 : 3,
        }}
      />
      {label && <p className="text-sm font-medium text-slate-400">{label}</p>}
    </div>
  );
}
