/**
 * Inline styles for react-datepicker dark theme customization.
 * Extracted from dangerouslySetInnerHTML in App.jsx to keep the main component clean.
 */
const DatePickerStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    .react-datepicker-wrapper { width: 100%; display: block; }
    .react-datepicker { background-color: #0c0c0c !important; border: 1px solid rgba(255,255,255,0.1) !important; font-family: inherit !important; color: white !important; box-shadow: 0 10px 30px rgba(0,0,0,0.8); }
    .react-datepicker__header { background-color: #050505 !important; border-bottom: 1px solid rgba(255,255,255,0.1) !important; }
    .react-datepicker__current-month, .react-datepicker__day-name, .react-datepicker-time__header { color: #9ca3af !important; }
    .react-datepicker__day { color: #e5e7eb !important; }
    .react-datepicker__day:hover { background-color: rgba(249,115,22,0.2) !important; }
    .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected { background-color: #f97316 !important; color: white !important; font-weight: bold; }
    .react-datepicker__day--disabled { color: #374151 !important; opacity: 0.5; }
    @keyframes scrollAnimation { 0% { transform: translateY(0); opacity: 1; } 50% { transform: translateY(6px); opacity: 0.5; } 100% { transform: translateY(0); opacity: 1; } }
    .scroll-wheel { animation: scrollAnimation 2s ease-in-out infinite; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `}} />
);

export default DatePickerStyles;
