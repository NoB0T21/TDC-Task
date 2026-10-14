import { useState, useEffect } from 'react';
import { FileText, Save, Check } from 'lucide-react';
import { Button } from '@/shared/components/Button';

interface Props {
  initialNotes?: string;
  onSave: (notes: string) => Promise<boolean>;
}

export function NotesEditor({ initialNotes = '', onSave }: Props) {
  const [notes, setNotes] = useState(initialNotes);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    setNotes(initialNotes || '');
  }, [initialNotes]);

  const handleSave = async () => {
    setIsSaving(true);
    const success = await onSave(notes);
    setIsSaving(false);
    if (success) {
      setHasSaved(true);
      setTimeout(() => setHasSaved(false), 2500);
    }
  };

  const isChanged = notes !== (initialNotes || '');

  return (
    <div className="p-5 rounded-lg bg-brand-surface/75 border border-brand-border text-left">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <FileText size={15} className="text-brand-pink" />
          <span>Private Matchmaker Notes</span>
        </h3>
        <span className="text-[11px] text-slate-400 font-mono">
          {notes.length} / 2000 chars
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-3 leading-relaxed">
        Internal notes about this client's expectations, partner preferences, conversation updates, and dealbreakers. Visible only to TDC staff.
      </p>

      <textarea
        id="customer-notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add private matchmaker observations, feedback from previous dates, specific astrological or family requirements..."
        rows={4}
        maxLength={2000}
        className="w-full p-3.5 rounded-md bg-white/[0.04] border border-brand-border text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-brand-pink/60 transition-colors resize-y min-h-[110px]"
      />

      <div className="mt-3.5 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          {isChanged ? (
            <span className="text-amber-400 font-medium">Unsaved modifications</span>
          ) : hasSaved ? (
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <Check size={13} /> Notes saved
            </span>
          ) : null}
        </span>

        <Button
          id="save-notes-btn"
          variant="primary"
          size="sm"
          isLoading={isSaving}
          disabled={!isChanged && !isSaving}
          onClick={handleSave}
          icon={<Save size={14} />}
        >
          {isSaving ? 'Saving Notes...' : 'Save Notes'}
        </Button>
      </div>
    </div>
  );
}
