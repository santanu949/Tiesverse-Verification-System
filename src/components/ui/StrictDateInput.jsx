import React from 'react';

/**
 * 🔒 CUSTOM COMPONENT: Strict Date Picker (FIXED PROP SPREADING)
 * Custom input component for react-datepicker that prevents manual typing
 * and supports both date and time modes.
 */
const StrictDateInput = React.forwardRef(({ isTime, disabled, placeholder, className, ...rest }, ref) => (
  <input
    {...rest} // CRITICAL FIX: Spreads all internal react-datepicker props safely
    ref={ref}
    type={isTime ? "time" : "text"}
    placeholder={placeholder}
    disabled={disabled}
    readOnly={!isTime}
    onKeyDown={(e) => {
        if (!isTime) e.preventDefault(); // Kills manual typing
        if (rest.onKeyDown) rest.onKeyDown(e);
    }}
    className={`w-full bg-[#050505] border border-white/[0.05] rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all shadow-inner placeholder-gray-700 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className || ''}`}
  />
));

export default StrictDateInput;
