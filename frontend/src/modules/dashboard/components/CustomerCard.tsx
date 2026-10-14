import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Briefcase, IndianRupee } from 'lucide-react';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { getAge, formatIncome } from '@/shared/utils/format';
import type { Customer } from '@/types';

interface Props {
  customer: Customer;
}

export function CustomerCard({ customer }: Props) {
  const navigate = useNavigate();
  const age = getAge(customer.date_of_birth);
  const initials = `${customer.first_name[0]}${customer.last_name[0]}`.toUpperCase();

  return (
    <div
      id={`customer-card-${customer.id}`}
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/customers/${customer.id}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`/customers/${customer.id}`);
        }
      }}
      className="group relative flex flex-col justify-between p-5 rounded-lg bg-brand-surface/75 hover:bg-brand-surface border border-brand-border hover:border-brand-pink/40 shadow-lg hover:shadow-xl hover:shadow-brand-pink/5 hover:-translate-y-1 transition-all duration-200 cursor-pointer text-left"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="relative">
            <div className="w-13 h-13 rounded-md overflow-hidden bg-gradient-to-tr from-brand-pink to-brand-purple flex items-center justify-center text-white font-bold text-base shadow-md border border-white/10 shrink-0">
              {customer.profile_photo_url ? (
                <img
                  src={customer.profile_photo_url}
                  alt={`${customer.first_name} ${customer.last_name}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <span
              className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-brand-surface ${
                customer.gender === 'female' ? 'bg-pink-400' : 'bg-blue-400'
              }`}
            />
          </div>

          <StatusBadge status={customer.status_tag} size="sm" />
        </div>

        <div className="mb-3">
          <h3 className="text-base font-bold text-slate-100 group-hover:text-pink-300 transition-colors flex items-center gap-1.5 leading-snug">
            <span>
              {customer.first_name} {customer.last_name}
            </span>
            <span className="text-xs font-normal text-slate-400">({age}y)</span>
          </h3>

          <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
            <MapPin size={13} className="shrink-0 text-slate-400" />
            <span className="truncate">{customer.city}, {customer.country}</span>
            <span>·</span>
            <span className="capitalize">{customer.marital_status}</span>
          </div>
        </div>

        <div className="space-y-1 mb-4 text-xs text-slate-300">
          {customer.designation && (
            <div className="flex items-center gap-1.5 truncate">
              <Briefcase size={13} className="text-slate-400 shrink-0" />
              <span className="truncate">
                {customer.designation}
                {customer.company ? ` at ${customer.company}` : ''}
              </span>
            </div>
          )}

          {customer.income_lpa !== undefined && customer.income_lpa !== null && (
            <div className="flex items-center gap-1.5 text-slate-400">
              <IndianRupee size={13} className="text-slate-400 shrink-0" />
              <span>{formatIncome(customer.income_lpa)}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-2">
          {customer.religion && (
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-300 border border-white/5">
              {customer.religion}
            </span>
          )}
          {customer.caste && (
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-300 border border-white/5">
              {customer.caste}
            </span>
          )}
          {customer.dietary_preference && (
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-300 border border-white/5 capitalize">
              {customer.dietary_preference}
            </span>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-brand-border flex items-center justify-between text-xs text-slate-400 group-hover:text-slate-200 transition-colors">
        <span className="text-[11px]">View full biodata</span>
        <div className="w-6 h-6 rounded-md bg-white/[0.04] group-hover:bg-brand-pink group-hover:text-white flex items-center justify-center transition-all">
          <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
}
