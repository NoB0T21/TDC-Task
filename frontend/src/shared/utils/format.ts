import { differenceInYears, parseISO, format } from 'date-fns';

/** Returns age in full years from an ISO date string */
export function getAge(dateOfBirth: string): number {
  return differenceInYears(new Date(), parseISO(dateOfBirth));
}

/** Formats an ISO date string to a human-readable date */
export function formatDate(date: string, fmt = 'dd MMM yyyy'): string {
  return format(parseISO(date), fmt);
}

/** Formats height in cm to feet+inches display */
export function formatHeight(cm: number): string {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}" (${cm}cm)`;
}

/** Formats income in LPA to readable string */
export function formatIncome(lpa: number): string {
  if (lpa >= 100) return `₹${(lpa / 100).toFixed(1)}Cr LPA`;
  return `₹${lpa % 1 === 0 ? lpa : lpa.toFixed(1)}L LPA`;
}

/** Returns initials from first and last name */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/** Capitalises first letter of a string */
export function capitalise(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Truncates a string to maxLen chars and adds ellipsis */
export function truncate(str: string, maxLen = 80): string {
  if (!str || str.length <= maxLen) return str;
  return str.slice(0, maxLen).trimEnd() + '…';
}
