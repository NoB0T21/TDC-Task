import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { X, Send, Sparkles, Building2, MapPin, HeartHandshake } from 'lucide-react';
import { useMatchIntro, type MatchResult } from '../hooks/useMatches';
import { logMatchAction } from '../hooks/useMatchLog';
import { Button } from '@/shared/components/Button';
import { getAge, formatHeight, formatIncome, getInitials } from '@/shared/utils/format';
import type { Customer } from '@/types';

interface Props {
  client: Customer;
  match: MatchResult;
  onClose: () => void;
}

export function SendMatchModal({ client, match, onClose }: Props) {
  const { intro, isLoading, generateIntro } = useMatchIntro(client.id);

  useEffect(() => {
    generateIntro(match.candidate.id);
  }, [client.id, match.candidate.id, generateIntro]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSend = async () => {
    await logMatchAction(
      client.id,
      match.candidate.id,
      match.aiScore,
      match.aiExplanation,
      intro ?? undefined
    );
    toast.success(
      `Match sent! ${match.candidate.first_name} ${match.candidate.last_name}'s profile has been shared with ${client.first_name}.`,
      { duration: 5000 }
    );
    onClose();
  };

  const c = match.candidate;
  const age = getAge(c.date_of_birth);
  const score = match.aiScore ?? Math.round((match.rawScore / 115) * 100);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-brand-surface border border-brand-border rounded-2xl shadow-2xl p-6 sm:p-7 flex flex-col gap-5 text-left text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-pink/15 text-brand-pink flex items-center justify-center">
              <HeartHandshake size={18} />
            </div>
            <div>
              <h2 id="modal-title" className="text-lg font-bold text-white tracking-tight">
                Send Match Introduction
              </h2>
              <p className="text-xs text-slate-400">
                Sharing {c.first_name}&apos;s profile with {client.first_name}
              </p>
            </div>
          </div>
          <button
            id="modal-close-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Candidate Profile Summary */}
        <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-brand-pink to-purple-600 flex items-center justify-center font-bold text-white text-lg shrink-0 overflow-hidden shadow-inner">
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
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                {c.first_name} {c.last_name}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-pink/15 text-brand-pink border border-brand-pink/30 flex items-center gap-1">
                <Sparkles size={12} />
                {score}/100 · {match.aiLabel || 'Matched'}
              </span>
            </div>
            <p className="text-xs text-slate-300 flex items-center gap-1.5 truncate">
              <Building2 size={13} className="text-slate-400 shrink-0" />
              <span>{c.designation || 'Professional'}</span>
              {c.company && <span className="text-slate-400">at {c.company}</span>}
            </p>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <MapPin size={13} className="shrink-0" />
              <span>
                {c.city} · {age} yrs · {formatHeight(c.height_cm)}
              </span>
              {c.income_lpa && (
                <span className="text-emerald-400 font-medium">· {formatIncome(c.income_lpa)}</span>
              )}
            </p>
          </div>
        </div>

        {/* Why this match / Explanation */}
        {match.aiExplanation && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Compatibility Analysis
            </span>
            <div className="p-3.5 rounded-lg bg-white/[0.02] border-l-3 border-brand-pink text-xs text-slate-300 leading-relaxed">
              {match.aiExplanation}
            </div>
          </div>
        )}

        {/* Personalized Introduction */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Personalized Intro Note
            </span>
            {isLoading && (
              <span className="text-[11px] text-brand-pink flex items-center gap-1">
                <span className="w-2.5 h-2.5 border-2 border-brand-pink/30 border-t-brand-pink rounded-full animate-spin" />
                Generating via Gemini AI…
              </span>
            )}
          </div>

          <div className="p-4 rounded-xl bg-brand-pink/[0.04] border border-brand-pink/20 text-xs text-slate-200 leading-relaxed space-y-2">
            <p className="font-semibold text-slate-100">Dear {client.first_name},</p>
            {isLoading ? (
              <div className="py-4 flex flex-col items-center justify-center gap-2 text-slate-400">
                <span className="w-5 h-5 border-2 border-brand-pink/40 border-t-brand-pink rounded-full animate-spin" />
                <p className="text-xs">Crafting custom matrimonial introduction…</p>
              </div>
            ) : (
              <p className="whitespace-pre-line text-slate-300">
                {intro ||
                  `We'd like to introduce you to ${c.first_name} ${c.last_name}, a ${c.designation || 'professional'} based in ${c.city}. Based on shared lifestyle values and life goals, we believe this could be a promising connection.`}
              </p>
            )}
            <p className="text-slate-400 pt-1 text-[11px]">
              Warm regards,
              <br />
              <span className="text-brand-pink font-semibold">The Date Crew Matchmaking Team</span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            id="cancel-send-btn"
            variant="ghost"
            size="md"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            id="confirm-send-btn"
            variant="primary"
            size="md"
            icon={<Send size={14} />}
            disabled={isLoading}
            onClick={handleSend}
          >
            Send Match to {client.first_name}
          </Button>
        </div>
      </div>
    </div>
  );
}
