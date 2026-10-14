import { useState, useMemo } from 'react';
import { Search, Users, Sparkles, CheckCircle2, UserPlus, Filter, X } from 'lucide-react';
import { Navbar } from '@/shared/components/Navbar';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Button } from '@/shared/components/Button';
import { CustomerCard } from '../components/CustomerCard';
import { useCustomers } from '@/modules/customers/hooks/useCustomers';
import { useAuth } from '@/modules/auth/context/AuthContext';
import type { CustomerStatus } from '@/shared/components/StatusBadge';

const STATUS_FILTERS: Array<{ id: string; label: string }> = [
  { id: 'all', label: 'All Clients' },
  { id: 'active', label: 'Active' },
  { id: 'new', label: 'New' },
  { id: 'matched', label: 'Matched' },
  { id: 'paused', label: 'Paused' },
  { id: 'closed', label: 'Closed' },
];

export function DashboardPage() {
  const { user } = useAuth();
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [page, setPage] = useState(1);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    clearTimeout((window as any)._searchTimeout);
    (window as any)._searchTimeout = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 350);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setPage(1);
  };

  const { customers, total, page: currentPage, limit, isLoading, error, refetch } = useCustomers({
    page,
    limit: 12,
    search: debouncedSearch,
    statusTag: statusFilter === 'all' ? undefined : (statusFilter as CustomerStatus),
    gender: genderFilter === 'all' ? undefined : genderFilter,
  });

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const stats = useMemo(() => {
    const active = customers.filter((c) => c.status_tag === 'active').length;
    const matched = customers.filter((c) => c.status_tag === 'matched').length;
    const newClients = customers.filter((c) => c.status_tag === 'new').length;
    return {
      total,
      active,
      matched,
      newClients,
    };
  }, [customers, total]);

  return (
    <div className="min-h-screen bg-brand-dark text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <span>Client Portfolio</span>
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-brand-pink/15 text-brand-pink font-semibold border border-brand-pink/30">
                {total} Assigned
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Welcome back, <strong className="text-slate-200">{user?.name}</strong>. Manage your assigned clients and discover high-intent matches.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Connected to PostgreSQL Matchmaker Pool</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-lg bg-brand-surface/60 border border-brand-border flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Users size={18} />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">Total Clients</span>
              <span className="text-xl font-bold text-slate-100">{total}</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-brand-surface/60 border border-brand-border flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Sparkles size={18} />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">Active Searches</span>
              <span className="text-xl font-bold text-emerald-400">{stats.active}</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-brand-surface/60 border border-brand-border flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-md bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center shrink-0">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">Matched</span>
              <span className="text-xl font-bold text-fuchsia-400">{stats.matched}</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-brand-surface/60 border border-brand-border flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <UserPlus size={18} />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">New Profiles</span>
              <span className="text-xl font-bold text-amber-400">{stats.newClients}</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-brand-surface/70 border border-brand-border mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              id="search-input"
              type="text"
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by client name, email, or city..."
              className="w-full h-10 pl-10 pr-9 bg-white/[0.04] border border-brand-border rounded-lg text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-brand-pink/60 transition-colors"
            />
            {searchInput && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center rounded-lg bg-white/[0.04] border border-brand-border p-0.5 text-xs">
              {(['all', 'female', 'male'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    setGenderFilter(g);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-md font-medium capitalize transition-all cursor-pointer ${
                    genderFilter === g
                      ? 'bg-brand-pink text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {STATUS_FILTERS.map((s) => (
                <button
                  key={s.id}
                  id={`filter-${s.id}`}
                  onClick={() => {
                    setStatusFilter(s.id);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === s.id
                      ? 'bg-brand-surface text-brand-pink border-brand-pink/50 shadow-sm'
                      : 'bg-white/[0.02] border-brand-border text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="min-h-[350px] flex items-center justify-center">
            <LoadingSpinner size={42} label="Loading clients portfolio..." />
          </div>
        ) : error ? (
          <div className="min-h-[300px] flex flex-col items-center justify-center p-8 text-center bg-brand-surface/40 border border-brand-border rounded-lg">
            <p className="text-red-400 font-medium mb-3">{error}</p>
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        ) : customers.length === 0 ? (
          <div className="min-h-[350px] flex flex-col items-center justify-center p-8 text-center bg-brand-surface/40 border border-brand-border rounded-lg">
            <div className="w-12 h-12 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center text-slate-400 mb-4">
              <Filter size={22} />
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-1">No clients found</h3>
            <p className="text-sm text-slate-400 max-w-md mb-4">
              {debouncedSearch
                ? `No assigned clients match "${debouncedSearch}". Try adjusting your keywords or clearing the filter.`
                : 'No clients match the selected status or gender filter.'}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStatusFilter('all');
                setGenderFilter('all');
                handleClearSearch();
              }}
            >
              Reset All Filters
            </Button>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {customers.map((customer) => (
                <CustomerCard key={customer.id} customer={customer} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 pt-6 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-slate-400">
                  Showing{' '}
                  <strong className="text-slate-200">
                    {(currentPage - 1) * limit + 1}
                  </strong>{' '}
                  to{' '}
                  <strong className="text-slate-200">
                    {Math.min(currentPage * limit, total)}
                  </strong>{' '}
                  of <strong className="text-slate-200">{total}</strong> assigned clients
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    ← Previous
                  </Button>
                  <span className="text-xs font-semibold px-2.5 py-1.5 rounded-md bg-white/[0.04] border border-brand-border text-slate-300">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next →
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
