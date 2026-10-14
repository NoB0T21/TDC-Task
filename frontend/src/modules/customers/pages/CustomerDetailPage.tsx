import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Navbar } from '@/shared/components/Navbar';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Button } from '@/shared/components/Button';
import { StatusBadge, CustomerStatus } from '@/shared/components/StatusBadge';
import { BiodataPanel } from '../components/BiodataPanel';
import { NotesEditor } from '../components/NotesEditor';
import { MatchSection } from '@/modules/matching/components/MatchSection';
import { useCustomer } from '../hooks/useCustomer';

const STATUS_OPTIONS: Array<{ value: CustomerStatus; label: string }> = [
  { value: 'new', label: 'New' },
  { value: 'active', label: 'Active' },
  { value: 'matched', label: 'Matched' },
  { value: 'paused', label: 'Paused' },
  { value: 'closed', label: 'Closed' },
];

export function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { customer, isLoading, error, updateStatus } = useCustomer(id || '');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleStatusChange = async (newStatus: CustomerStatus) => {
    setIsUpdatingStatus(true);
    await updateStatus(newStatus);
    setIsUpdatingStatus(false);
  };

  const handleSaveNotes = async (notes: string) => {
    if (!customer) return false;
    return await updateStatus(customer.status_tag, notes);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-dark text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size={44} label="Loading client biodata..." />
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="min-h-screen bg-brand-dark text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-4">
            <AlertCircle size={26} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Customer Not Found</h2>
          <p className="text-sm text-slate-400 max-w-md mb-6">
            The requested customer profile could not be retrieved. It may not exist or may not be assigned to your account.
          </p>
          <Button variant="secondary" size="md" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-brand-surface/60 border border-brand-border mb-6">
          <Button
            id="back-btn"
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            icon={<ArrowLeft size={16} />}
            className="text-slate-300 hover:text-white"
          >
            Back to Dashboard
          </Button>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <label htmlFor="status-select" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Status:
            </label>
            <select
              id="status-select"
              value={customer.status_tag}
              disabled={isUpdatingStatus}
              onChange={(e) => handleStatusChange(e.target.value as CustomerStatus)}
              className="h-9 px-3 bg-white/[0.05] border border-brand-border rounded-md text-xs font-semibold text-slate-200 outline-none focus:border-brand-pink/50 cursor-pointer disabled:opacity-50"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-brand-surface text-slate-200">
                  {opt.label}
                </option>
              ))}
            </select>
            <StatusBadge status={customer.status_tag} size="md" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-6 items-start">
          <div className="flex flex-col gap-6">
            <BiodataPanel customer={customer} />
            <NotesEditor
              initialNotes={customer.notes || ''}
              onSave={handleSaveNotes}
            />
          </div>

          <div>
            <MatchSection customer={customer} />
          </div>
        </div>
      </main>
    </div>
  );
}
