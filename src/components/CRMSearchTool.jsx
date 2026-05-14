/**
 * CRMSearchTool — Admin search panel for querying users by name, role, or code.
 */
const CRMSearchTool = ({ adminSearchQuery, setAdminSearchQuery, handleAdminQuickSearch, isSearchingAdmin, hasSearchedAdmin, adminSearchResults, loadCRMDashboard, searchLoading }) => (
  <div className="bg-[#080808]/90 backdrop-blur-3xl border border-white/[0.05] rounded-3xl p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden mb-12">
    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent"></div>
    <div className="flex items-center gap-3 mb-6">
       <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
       <h3 className="text-lg font-bold tracking-wide uppercase text-white">CRM / Database Query Tool</h3>
    </div>
    <form onSubmit={handleAdminQuickSearch} className="flex gap-3 mb-8">
      <input type="text" value={adminSearchQuery} onChange={(e) => setAdminSearchQuery(e.target.value)} placeholder="Search by Name, Role, or Unique Code..." className="flex-1 bg-[#050505] border border-white/[0.05] rounded-xl px-5 py-4 text-white text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all shadow-inner placeholder-gray-600" />
      <button type="submit" disabled={isSearchingAdmin} className="px-8 py-4 rounded-xl border border-white/10 bg-white/5 text-white font-bold uppercase tracking-widest hover:bg-white/10 transition-all disabled:opacity-50 text-xs">
        {isSearchingAdmin ? 'Searching...' : 'Execute'}
      </button>
    </form>

    {hasSearchedAdmin && (
      <div className="mt-4">
        {adminSearchResults.length === 0 ? (
          <div className="text-center p-8 bg-[#050505] border border-white/5 rounded-xl border-dashed"><p className="text-sm text-gray-500 font-mono">NO RECORDS MATCHING QUERY</p></div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {adminSearchResults.map((user, idx) => (
              <div key={idx} className="bg-[#050505] border border-white/[0.05] p-5 rounded-2xl hover:border-orange-500/30 transition-colors group relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="mb-4 md:mb-0 w-full">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500 bg-orange-500/10 px-2 py-1 rounded-md">ID: {user.primaryId}</span>
                    {user.gender && <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-white/5 border border-white/10 px-2 py-1 rounded-md">{user.gender}</span>}
                  </div>
                  <h4 className="text-lg font-bold text-white mb-1">{user.primaryName}</h4>
                  <p className="text-xs text-gray-400 font-mono">ROLE: <span className="text-white tracking-widest">{user.secondaryRole}</span></p>
                </div>
                <div className="flex-shrink-0 w-full md:w-auto">
                     <button onClick={() => loadCRMDashboard(user.codeOffer || user.codeIntern || user.codeMember || user.codeWebinar)} disabled={searchLoading} className="px-6 py-3 rounded-xl border border-orange-500/50 bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50 w-full">
                       Open CRM Profile
                     </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
);

export default CRMSearchTool;
