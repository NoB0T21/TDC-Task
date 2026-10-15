import { useState } from 'react';
import { Sparkles, Users, Compass, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { useAiMatches, type MatchResult } from '../hooks/useMatches';
import { MatchCard } from './MatchCard';
import { SendMatchModal } from './SendMatchModal';
import { Button } from '@/shared/components/Button';
import type { Customer } from '@/types';

interface Props {
  customer: Customer;
}

export function MatchSection({ customer }: Props) {
  const targetGender = customer.gender === 'male' ? 'Female' : 'Male';
  const { matches, isLoading, error, hasComputed, fetchMatches } = useAiMatches(customer.id);
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null);

  return (
    <div className="flex flex-col gap-5 text-left sticky top-20">
      {/* If matches haven't been computed yet, show the Match Intelligence Hero Card */}
      {!hasComputed && !isLoading && (
        <>
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
              id="compute-matches-btn"
              variant="primary"
              size="lg"
              className="w-full shadow-lg shadow-brand-pink/20"
              icon={<Sparkles size={16} />}
              onClick={fetchMatches}
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
        </>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="p-8 rounded-xl bg-brand-surface border border-brand-pink/30 flex flex-col items-center justify-center gap-4 text-center">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-3 border-brand-pink/20 border-t-brand-pink animate-spin" />
            <Sparkles className="absolute inset-0 m-auto text-brand-pink animate-pulse" size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-1">
              Finding Compatible Matches
            </h4>
            <p className="text-xs text-slate-400 max-w-xs">
              Running gender-specific compatibility algorithm & Gemini AI evaluation for {customer.first_name}…
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="p-5 rounded-xl bg-red-500/10 border border-red-500/30 flex flex-col items-center gap-3 text-center">
          <AlertCircle className="text-red-400" size={24} />
          <p className="text-xs text-red-200">{error}</p>
          <Button variant="secondary" size="sm" onClick={fetchMatches}>
            Try Again
          </Button>
        </div>
      )}

      {/* Computed Matches List */}
      {hasComputed && !isLoading && !error && (
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between p-3.5 rounded-lg bg-brand-surface/80 border border-brand-border">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-brand-pink/15 text-brand-pink flex items-center justify-center">
                <Sparkles size={14} />
              </div>
              <h3 className="text-sm font-bold text-white">
                Suggested Matches
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 text-slate-300">
                {matches.length} found
              </span>
            </div>
            <button
              onClick={fetchMatches}
              title="Refresh / Re-compute"
              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/5 transition-colors cursor-pointer flex items-center gap-1 text-xs"
            >
              <RefreshCw size={13} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {matches.length === 0 ? (
            <div className="p-8 rounded-xl bg-brand-surface/60 border border-brand-border text-center text-slate-400 text-xs">
              No matching profiles found in the active pool.
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
              {matches.map((m) => (
                <MatchCard
                  key={m.candidate.id}
                  match={m}
                  onSendMatch={setSelectedMatch}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Send Match Modal */}
      {selectedMatch && (
        <SendMatchModal
          client={customer}
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </div>
  );
}
