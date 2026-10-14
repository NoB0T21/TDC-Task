import { ReactNode } from 'react';
import {
  Calendar,
  Ruler,
  Languages,
  Users,
  Utensils,
  Wine,
  Cigarette,
  GraduationCap,
  Briefcase,
  IndianRupee,
  Home,
  Compass,
  Dog,
  Mail,
  Phone,
  Heart,
  MapPin,
} from 'lucide-react';
import { getAge, formatDate, formatHeight, formatIncome } from '@/shared/utils/format';
import type { Customer } from '@/types';

interface FieldProps {
  icon?: ReactNode;
  label: string;
  value?: string | number | null;
}

function Field({ icon, label, value }: FieldProps) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="flex items-start gap-2.5 p-3 rounded-md bg-white/[0.02] border border-white/5">
      {icon && <span className="text-slate-400 mt-0.5 shrink-0">{icon}</span>}
      <div className="flex flex-col min-w-0">
        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide leading-tight">
          {label}
        </span>
        <span className="text-sm font-semibold text-slate-100 truncate mt-0.5 capitalize">
          {String(value)}
        </span>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="p-5 rounded-lg bg-brand-surface/75 border border-brand-border">
      <h3 className="text-xs font-bold uppercase tracking-wider text-brand-pink mb-3.5 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-pink" />
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

export function BiodataPanel({ customer: c }: { customer: Customer }) {
  const age = getAge(c.date_of_birth);
  const initials = `${c.first_name[0]}${c.last_name[0]}`.toUpperCase();

  return (
    <div className="flex flex-col gap-4 text-left">
      <div className="p-5 rounded-lg bg-brand-surface border border-brand-border flex flex-col sm:flex-row items-center sm:items-start gap-4 shadow-xl">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-tr from-brand-pink via-brand-purple to-brand-violet flex items-center justify-center text-white font-extrabold text-xl shadow-md border border-white/10">
            {c.profile_photo_url ? (
              <img
                src={c.profile_photo_url}
                alt={`${c.first_name} ${c.last_name}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <span
            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-brand-surface ${
              c.gender === 'female' ? 'bg-pink-400' : 'bg-blue-400'
            }`}
          />
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {c.first_name} {c.last_name}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-white/[0.05] border border-white/10 text-slate-300 font-semibold self-center sm:self-auto capitalize">
              {c.marital_status}
            </span>
          </div>

          <p className="text-sm text-slate-300 flex items-center justify-center sm:justify-start gap-1.5 mt-1">
            <MapPin size={14} className="text-brand-pink" />
            <span>{c.city}, {c.country}</span>
            <span>·</span>
            <span className="text-slate-400">{age} years old</span>
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mt-3">
            <span className="text-xs px-2 py-0.5 rounded-md bg-pink-500/10 text-pink-300 border border-pink-500/20 font-medium capitalize">
              {c.gender}
            </span>
            {c.religion && (
              <span className="text-xs px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-300 border border-white/10 font-medium">
                {c.religion}
              </span>
            )}
            {c.caste && (
              <span className="text-xs px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-300 border border-white/10 font-medium">
                {c.caste}
              </span>
            )}
            {c.designation && (
              <span className="text-xs px-2 py-0.5 rounded-md bg-brand-purple/15 text-purple-300 border border-brand-purple/30 font-medium truncate max-w-xs">
                {c.designation}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Section title="Personal Information">
          <Field icon={<Calendar size={15} />} label="Date of Birth" value={formatDate(c.date_of_birth)} />
          <Field icon={<Ruler size={15} />} label="Height" value={formatHeight(c.height_cm)} />
          <Field icon={<Languages size={15} />} label="Languages" value={c.languages?.join(', ')} />
          <Field icon={<Users size={15} />} label="Siblings" value={c.siblings ?? 0} />
          <Field icon={<Utensils size={15} />} label="Dietary Preference" value={c.dietary_preference} />
          <Field icon={<Wine size={15} />} label="Drinking" value={c.drinking} />
          <Field icon={<Cigarette size={15} />} label="Smoking" value={c.smoking} />
        </Section>

        <Section title="Education & Professional Background">
          <Field icon={<GraduationCap size={15} />} label="College / University" value={c.college} />
          <Field icon={<GraduationCap size={15} />} label="Degree" value={c.degree} />
          <Field icon={<Briefcase size={15} />} label="Designation" value={c.designation} />
          <Field icon={<Briefcase size={15} />} label="Company / Employer" value={c.company} />
          <Field
            icon={<IndianRupee size={15} />}
            label="Annual Income"
            value={c.income_lpa !== undefined && c.income_lpa !== null ? formatIncome(c.income_lpa) : undefined}
          />
        </Section>

        <Section title="Preferences & Matrimonial Values">
          <Field icon={<Heart size={15} />} label="Wants Children" value={c.want_kids} />
          <Field icon={<Compass size={15} />} label="Open to Relocate" value={c.open_to_relocate} />
          <Field icon={<Dog size={15} />} label="Open to Pets" value={c.open_to_pets} />
          <Field icon={<Home size={15} />} label="Country" value={c.country} />
        </Section>

        <Section title="Direct Contact Details">
          <Field icon={<Mail size={15} />} label="Email Address" value={c.email} />
          <Field icon={<Phone size={15} />} label="Phone Number" value={c.phone} />
        </Section>

        {c.hobbies && c.hobbies.length > 0 && (
          <div className="p-4 rounded-lg bg-brand-surface/75 border border-brand-border">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-pink mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-pink" />
              Hobbies & Personal Interests
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {c.hobbies.map((hobby) => (
                <span
                  key={hobby}
                  className="px-2.5 py-0.5 rounded-md bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-brand-pink/20 text-pink-300 text-xs font-medium capitalize"
                >
                  {hobby}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
