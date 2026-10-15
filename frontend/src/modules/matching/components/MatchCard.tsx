import { Send, MapPin, Building2, Briefcase } from 'lucide-react';
import type { MatchResult } from '../hooks/useMatches';
import { getAge, formatHeight, formatIncome, getInitials } from '@/shared/utils/format';
import { Button } from '@/shared/components/Button';

interface Props {
  match: MatchResult;
  onSendMatch: (match: MatchResult) => void;
}

export function MatchCard({ match, onSendMatch }: Props) {
  const c = match.candidate;
  const age = getAge(c.date_of_birth);
  const score = match.aiScore ?? Math.min(100, Math.round((match.rawScore / 115) * 100));
  const label = match.aiLabel || getLabel(score);
  const { colorClasses, emoji } = getScoreStyle(score);

  return (
    <div className="p-4 rounded-xl bg-brand-surface/90 border border-brand-border/80 hover:border-brand-pink/40 transition-all duration-200 shadow-md flex flex-col gap-3 group text-left">
      {/* Top row: Avatar + Name + Score Badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-pink to-purple-600 flex items-center justify-center font-bold text-white text-sm shrink-0 overflow-hidden shadow-inner">
            {c.profile_photo_url ? (
              <img
                src={c.profile_photo_url}
                alt={`${c.first_name} ${c.last_name}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{getInitials(c.first_name, c.last_name)}</span>
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-brand-pink transition-colors">
              {c.first_name} {c.last_name}
            </h4>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <MapPin size={11} />
              <span>
                {c.city} · {age} yrs
              </span>
            </p>
          </div>
        </div>

        {/* Score badge */}
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${colorClasses}`}
        >
          <span>{emoji}</span>
          <span>{score}</span>
          <span className="text-[10px] opacity-75 font-normal">/100</span>
        </div>
      </div>

      {/* Designation & Company */}
      <div className="text-xs text-slate-300 space-y-0.5">
        <div className="flex items-center gap-1.5 truncate">
          <Briefcase size={12} className="text-slate-400 shrink-0" />
          <span className="truncate">{c.designation || 'Professional'}</span>
        </div>
        {c.company && (
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] truncate">
            <Building2 size={12} className="shrink-0" />
            <span className="truncate">{c.company}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 text-[11px]">
        {c.religion && (
          <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/5 text-slate-300">
            {c.religion}
          </span>
        )}
        <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/5 text-slate-300">
          {formatHeight(c.height_cm)}
        </span>
        {c.income_lpa !== undefined && c.income_lpa > 0 && (
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
            {formatIncome(c.income_lpa)}
          </span>
        )}
      </div>

      {/* Label & Explanation */}
      <div className="pt-2 border-t border-white/5 space-y-1">
        <p className="text-xs font-semibold text-slate-200">{label}</p>
        {match.aiExplanation && (
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
            {match.aiExplanation}
          </p>
        )}
      </div>

      {/* Action */}
      <div className="pt-1">
        <Button
          id={`send-match-${c.id}`}
          variant="outline"
          size="sm"
          className="w-full text-xs font-semibold hover:bg-brand-pink hover:text-white"
          icon={<Send size={13} />}
          onClick={() => onSendMatch(match)}
        >
          Send Match
        </Button>
      </div>
    </div>
  );
}

function getLabel(score: number): string {
  if (score >= 80) return '🔥 High Potential Match';
  if (score >= 60) return '✨ Good Match';
  return '💫 Possible Match';
}

function getScoreStyle(score: number): { colorClasses: string; emoji: string } {
  if (score >= 80) {
    return {
      colorClasses: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      emoji: '🔥',
    };
  }
  if (score >= 60) {
    return {
      colorClasses: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      emoji: '✨',
    };
  }
  return {
    colorClasses: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    emoji: '💫',
  };
}
