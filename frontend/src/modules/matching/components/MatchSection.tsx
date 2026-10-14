import { Sparkles, Users, Compass, ShieldCheck } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import type { Customer } from '@/types';

interface Props {
  customer: Customer;
}

export function MatchSection({ customer }: Props) {
  const targetGender = customer.gender === 'male' ? 'Female' : 'Male';

  return (
    <div className="flex flex-col gap-5 text-left sticky top-20">
      <div className="p-6 rounded-lg bg-gradient-to-b from-brand-surface to-brand-surface/90 border border-brand-pink/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-brand-pink/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-2 text-brand-pink font-bold text-xs uppercase tracking-wider mb-2">
          <Sparkles size={16} />
          <span>AI Match Intelligence</span>
        </div>

        <h3 className="text-xl font-black text-white tracking-tight mb-2">
          Find Compatible Matches
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed mb-5">
          Scan the active candidate pool of verified {targetGender} profiles using our 7-factor algorithmic scoring and Gemini LLM analysis.
        </p>

        <div className="space-y-2.5 mb-6 text-xs text-slate-300">
          <div className="flex items-center justify-between p-2.5 rounded-md bg-white/[0.03] border border-white/5">
            <span className="flex items-center gap-2 text-slate-400">
              <Users size={14} className="text-brand-pink" />
              Target Pool
            </span>
            <span className="font-semibold text-slate-100">{targetGender} Candidates</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-md bg-white/[0.03] border border-white/5">
            <span className="flex items-center gap-2 text-slate-400">
              <Compass size={14} className="text-purple-400" />
              Location Scope
            </span>
            <span className="font-semibold text-slate-100">
              {customer.city} · Pan-India
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-md bg-white/[0.03] border border-white/5">
            <span className="flex items-center gap-2 text-slate-400">
              <ShieldCheck size={14} className="text-emerald-400" />
              Match Pool Status
            </span>
            <span className="font-semibold text-emerald-400">110 Profiles Ready</span>
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          className="w-full shadow-lg shadow-brand-pink/20"
          icon={<Sparkles size={16} />}
          onClick={() => {
            alert(`Ready to run matching algorithm for ${customer.first_name}! This is wired up in Task 08 & Task 09.`);
          }}
        >
          Compute Algorithmic Matches
        </Button>
      </div>

      <div className="p-5 rounded-lg bg-brand-surface/60 border border-brand-border text-xs text-slate-400 space-y-2">
        <span className="font-bold text-slate-200 uppercase tracking-wider block text-[11px] mb-1">
          7-Factor Compatibility Matrix
        </span>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-pink" />
          <span>Age Proximity & Height Compatibility</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-pink" />
          <span>Location & Relocation Willingness</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-pink" />
          <span>Education, Profession & Income Bracket</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-pink" />
          <span>Family, Religion, Caste & Values Alignment</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-pink" />
          <span>Lifestyle, Diet, Drinking & Smoking Habits</span>
        </div>
      </div>
    </div>
  );
}
