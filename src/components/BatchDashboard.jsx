/**
 * BatchDashboard — CSV batch review table with gender/template assignment and execution.
 */
const BatchDashboard = ({ activeCategory, pendingBatchData, setPendingBatchData, setShowBatchDashboard, executeBatchUpload, loading }) => (
  <div className="animate-[fadeIn_0.3s_ease-out]">
     <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
        <h3 className="text-lg font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Batch Review: {activeCategory}
        </h3>
        <button onClick={() => setShowBatchDashboard(false)} className="text-gray-500 hover:text-white text-xs uppercase tracking-widest font-bold">Cancel</button>
     </div>
     
     {activeCategory === 'Offer Letter' && (
         <div className="flex gap-4 mb-4">
            <button onClick={() => setPendingBatchData(prev => prev.map(item => ({...item, offerTemplate: 'TechTies'})))} className="flex-1 py-2 bg-[#050505] border border-white/10 rounded-lg text-xs font-bold text-gray-300 hover:text-white hover:border-white/30 uppercase tracking-widest transition-all">Set All: TechTies Template</button>
            <button onClick={() => setPendingBatchData(prev => prev.map(item => ({...item, offerTemplate: 'TiesVerse'})))} className="flex-1 py-2 bg-[#050505] border border-white/10 rounded-lg text-xs font-bold text-gray-300 hover:text-white hover:border-white/30 uppercase tracking-widest transition-all">Set All: TiesVerse Template</button>
         </div>
     )}
     {activeCategory !== 'Webinar' && (
         <div className="flex gap-4 mb-6">
            <button onClick={() => setPendingBatchData(prev => prev.map(item => ({...item, gender: 'Male'})))} className="flex-1 py-2 bg-[#050505] border border-white/10 rounded-lg text-xs font-bold text-gray-300 hover:text-white hover:border-white/30 uppercase tracking-widest transition-all">Set All: Male</button>
            <button onClick={() => setPendingBatchData(prev => prev.map(item => ({...item, gender: 'Female'})))} className="flex-1 py-2 bg-[#050505] border border-white/10 rounded-lg text-xs font-bold text-gray-300 hover:text-white hover:border-white/30 uppercase tracking-widest transition-all">Set All: Female</button>
         </div>
     )}

     <div className="max-h-[400px] overflow-y-auto mb-6 rounded-xl border border-white/5 bg-[#030303]">
        <table className="w-full text-left text-sm text-gray-400">
           <thead className="bg-[#080808] text-xs uppercase font-bold tracking-widest text-gray-500 sticky top-0 z-10 shadow-md border-b border-white/5">
              <tr>
                 <th className="px-4 py-3">Name</th>
                 <th className="px-4 py-3">Role</th>
                 {activeCategory === 'Offer Letter' && <th className="px-4 py-3">Template</th>}
                 {activeCategory !== 'Webinar' && <th className="px-4 py-3">Gender</th>}
              </tr>
           </thead>
           <tbody className="divide-y divide-white/5">
              {pendingBatchData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                     <td className="px-4 py-3 font-medium text-white">{row.name}</td>
                     <td className="px-4 py-3">{row.role}</td>
                     {activeCategory === 'Offer Letter' && (
                         <td className="px-4 py-3">
                             <select value={row.offerTemplate} onChange={(e) => { const nd=[...pendingBatchData]; nd[idx].offerTemplate=e.target.value; setPendingBatchData(nd); }} className="bg-[#050505] border border-white/10 text-white rounded-lg px-2 py-1 text-xs outline-none focus:border-orange-500 transition-colors">
                                <option value="TechTies">TechTies</option>
                                <option value="TiesVerse">TiesVerse</option>
                             </select>
                         </td>
                     )}
                     {activeCategory !== 'Webinar' && (
                         <td className="px-4 py-3">
                             <select value={row.gender} onChange={(e) => { const nd=[...pendingBatchData]; nd[idx].gender=e.target.value; setPendingBatchData(nd); }} className={`bg-[#050505] border ${row.gender ? 'border-white/10 text-white' : 'border-red-500/50 text-red-400'} rounded-lg px-2 py-1 text-xs outline-none focus:border-orange-500 transition-colors`}>
                                <option value="" disabled>Select...</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                             </select>
                         </td>
                     )}
                  </tr>
              ))}
           </tbody>
        </table>
     </div>
     
     <button onClick={executeBatchUpload} disabled={loading} className="w-full px-6 py-4 rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-500 font-bold uppercase tracking-widest hover:bg-orange-500/20 hover:border-orange-500/50 transition-all shadow-[0_0_20px_rgba(249,115,22,0.1)] disabled:opacity-50 text-xs">
        {loading ? 'Executing Batch...' : `Execute Template Routing (${pendingBatchData.length} Records)`}
     </button>
  </div>
);

export default BatchDashboard;
