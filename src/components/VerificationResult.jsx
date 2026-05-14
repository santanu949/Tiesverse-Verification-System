import { displayFormat } from '../utils/dateUtils';

/**
 * 📄 PUBLIC VIEW (Locked Down - No Downloads)
 * Displays verification result for public users — read-only view of a verified record.
 */
const VerificationResult = ({ data, code, onBack }) => {
  const isApproved = data.status === 'Active';

  let displayDate = displayFormat(data.date1);
  if (data.date2 && String(data.date2).toLowerCase() !== 'present') displayDate += ` to ${displayFormat(data.date2)}`;
  else if (String(data.date2).toLowerCase() === 'present') displayDate += ` to Present`;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 md:py-6 animate-[fadeIn_0.5s_ease-out] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group px-4 py-2 bg-white/[0.03] rounded-full border border-white/5 backdrop-blur-md">
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <span className="text-sm font-medium">Back to Verification</span>
        </button>
      </div>

      <div className="w-full bg-gradient-to-r from-white/[0.05] to-transparent backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-5 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.3)] mb-6 relative overflow-hidden flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className={`absolute top-0 left-0 w-2 h-full ${isApproved ? 'bg-green-500 shadow-[0_0_30px_#22c55e]' : 'bg-orange-500 shadow-[0_0_30px_#f97316]'}`}></div>
        <div className="flex-1 text-center md:text-left w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
            <div>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-2">Verified Identity</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">{data.primaryName}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-[#080808] border border-white/5 rounded-2xl p-5 md:p-8 flex-1 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Professional Record
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">Role / Title</label>
                <p className="text-lg text-gray-200 font-medium">{data.secondaryRole}</p>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">Duration</label>
                <p className="text-lg text-gray-200 font-medium">{displayDate}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="bg-[#050505] border border-white/5 rounded-2xl p-5 shadow-inner">
            <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">System Validation</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Global Query Code</p>
                <div className="bg-black/60 border border-white/5 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-xl font-mono text-white tracking-widest">{code}</span>
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationResult;
