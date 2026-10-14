import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      className = '',
      required,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`flex flex-col gap-1.5 w-full text-left ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1"
          >
            <span>{label}</span>
            {required && <span className="text-pink-500 font-bold">*</span>}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center justify-center text-slate-400 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            required={required}
            className={`w-full h-11 bg-white/[0.05] border rounded-xl text-sm text-slate-100 placeholder-slate-500 outline-none transition-all duration-200 focus:bg-white/[0.08] disabled:opacity-50 disabled:cursor-not-allowed ${
              leftIcon ? 'pl-10' : 'pl-3.5'
            } ${rightIcon ? 'pr-10' : 'pr-3.5'} ${
              error
                ? 'border-red-500/80 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
                : 'border-white/10 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20'
            }`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-red-400 mt-0.5">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-400 mt-0.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
