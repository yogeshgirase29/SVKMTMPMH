/**
 * Helper to get Indian Standard Time (IST) date string in YYYY-MM-DD format.
 * This ensures that today's date represents India's date regardless of client timezone.
 */
export const getISTDateString = (dateInput: Date = new Date()): string => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const parts = formatter.formatToParts(dateInput);
  const mm = parts.find(p => p.type === 'month')?.value || '01';
  const dd = parts.find(p => p.type === 'day')?.value || '01';
  const yyyy = parts.find(p => p.type === 'year')?.value || '1970';
  return `${yyyy}-${mm}-${dd}`;
};

/**
 * Format any date string or Date object using en-IN locale and Asia/Kolkata timezone.
 */
export const formatISTDate = (dateVal: string | Date | undefined | null, includeTime: boolean = false): string => {
  if (!dateVal) return '';
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return '';
  
  if (includeTime) {
    return date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  }
  
  // For pure dates (DOB / Appointment Date) that are stored as midnight UTC (e.g. 2026-06-22T00:00:00.000Z),
  // using Asia/Kolkata is safe as it shifts it to 05:30 AM on the same day.
  return date.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
};
