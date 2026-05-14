/**
 * Formats a Date object to YYYY-MM-DD string for backend API consumption.
 * Handles timezone offset to prevent date shift issues.
 */
export const formatDateForBackend = (dateObj) => {
  if (!dateObj) return '';
  if (typeof dateObj === 'string') return dateObj;
  const offsetDate = new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000));
  return offsetDate.toISOString().split('T')[0];
};

/**
 * Parses a date string from the backend into a Date object for the frontend.
 * Returns null for empty, 'present', or invalid date strings.
 */
export const parseDateForFrontend = (dateStr) => {
  if (!dateStr || dateStr.toLowerCase() === 'present') return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
};

/**
 * Formats a date string for human-readable display (DD-Mon-YYYY).
 */
export const displayFormat = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
    return String(dateStr);
  } catch(e) { return String(dateStr); }
};
