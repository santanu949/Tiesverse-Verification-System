import { useRef } from 'react';
import { CATEGORY_LIST } from '../constants';
import UnifiedForm from './UnifiedForm';
import BatchDashboard from './BatchDashboard';
import CRMSearchTool from './CRMSearchTool';

/**
 * AdminDashboard — Full Command Center view with category tabs, single/batch upload,
 * success code display, and CRM search tool.
 */
const AdminDashboard = ({
  // Category & tab state
  activeCategory, setActiveCategory, activeTab, setActiveTab,
  // Form state
  adminFormData, setAdminFormData, handleAdminInputChange, handleDateChange,
  isCurrentlyEmployed, setIsCurrentlyEmployed,
  // Batch state
  csvFile, setCsvFile, pendingBatchData, setPendingBatchData,
  showBatchDashboard, setShowBatchDashboard, parseCSV, executeBatchUpload,
  // Single submit
  handleAdminSubmitSingle,
  // Loading / messages
  loading, message, successCode, setMessage, setSuccessCode,
  // CRM search
  adminSearchQuery, setAdminSearchQuery, handleAdminQuickSearch,
  isSearchingAdmin, hasSearchedAdmin, adminSearchResults,
  loadCRMDashboard, searchLoading,
  // File input ref
  fileInputRef
}) => {

  return (
    <div className="animate-[fadeIn_0.4s_ease-out] w-full max-w-5xl mx-auto pt-6 md:pt-10 px-4 md:px-6">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/[0.05] pb-6 relative">
         <div className="absolute bottom-0 left-0 w-1/3 h-[1px] bg-gradient-to-r from-orange-500/50 to-transparent"></div>
         <div>
            <div className="flex items-center gap-3 mb-2"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]"></div><h2 className="text-3xl font-bold tracking-tight text-white uppercase" style={{ letterSpacing: '1px' }}>Command Center</h2></div>
         </div>
         <div className="mt-6 md:mt-0 flex flex-wrap bg-[#050505] p-1.5 rounded-xl border border-white/5 shadow-inner gap-1">
            {CATEGORY_LIST.map(cat => (
              <button key={cat} onClick={() => {setActiveCategory(cat); setMessage(''); setSuccessCode(null); setShowBatchDashboard(false);}} className={`px-4 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${activeCategory === cat ? 'bg-orange-500/10 border border-orange-500/30 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.15)]' : 'bg-transparent border border-transparent text-gray-600 hover:text-gray-300'}`}>{cat}</button>
            ))}
         </div>
      </div>

      <div className="bg-[#080808]/90 backdrop-blur-3xl border border-white/[0.05] rounded-3xl p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden mb-12">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent"></div>
        
        {!showBatchDashboard ? (
          <>
            <div className="flex bg-[#030303] p-1.5 rounded-xl mb-8 border border-white/[0.03] shadow-inner">
              <button onClick={() => {setActiveTab('single'); setMessage(''); setSuccessCode(null);}} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-lg transition-all duration-300 ${activeTab === 'single' ? 'bg-white/[0.08] text-white shadow-sm border border-white/5' : 'text-gray-600 hover:text-gray-400 border border-transparent'}`}>Single Issuance</button>
              <button onClick={() => {setActiveTab('bulk'); setMessage(''); setSuccessCode(null);}} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-lg transition-all duration-300 ${activeTab === 'bulk' ? 'bg-white/[0.08] text-white shadow-sm border border-white/5' : 'text-gray-600 hover:text-gray-400 border border-transparent'}`}>Batch Processor (CSV)</button>
            </div>

            <form onSubmit={activeTab === 'single' ? handleAdminSubmitSingle : (e) => e.preventDefault()} className="space-y-5">
              {activeTab === 'single' ? (
                <UnifiedForm
                  activeCategory={activeCategory}
                  adminFormData={adminFormData}
                  setAdminFormData={setAdminFormData}
                  handleAdminInputChange={handleAdminInputChange}
                  handleDateChange={handleDateChange}
                  isCurrentlyEmployed={isCurrentlyEmployed}
                  setIsCurrentlyEmployed={setIsCurrentlyEmployed}
                />
              ) : (
                <div className="border-2 border-dashed border-white/10 hover:border-orange-500/50 rounded-2xl p-12 text-center transition-all duration-300 bg-[#050505] group">
                  <input type="file" accept=".csv" onChange={(e) => { setCsvFile(e.target.files[0]); parseCSV(e.target.files[0]); }} className="hidden" id="csv-upload" ref={fileInputRef}/>
                  <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/[0.05] flex items-center justify-center mb-5 group-hover:bg-orange-500/10 group-hover:border-orange-500/30 transition-all duration-300 shadow-inner">
                      <svg className="w-7 h-7 text-gray-500 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    </div>
                    <span className="text-white font-medium mb-2 tracking-wide">Select CSV to Load Batch Dashboard</span>
                    <span className="text-[10px] text-gray-500 mt-3 font-mono tracking-widest uppercase text-center block">Required Columns: <br/>Ignore(LeaveBlank), Name, Role/JobTitle, StartDate, EndDate, Lead/Manager</span>
                  </label>
                </div>
              )}
              
              {activeTab === 'single' && (
                  <button type="submit" disabled={loading} className="w-full mt-6 px-6 py-4 rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-500 font-bold uppercase tracking-widest hover:bg-orange-500/20 hover:border-orange-500/50 transition-all shadow-[0_0_20px_rgba(249,115,22,0.1)] hover:shadow-[0_0_30px_rgba(249,115,22,0.2)] disabled:opacity-50 text-xs">
                  {loading ? 'Processing Protocol...' : `Authorize & Generate ${activeCategory}`}
                  </button>
              )}
            </form>
          </>
        ) : (
          <BatchDashboard
            activeCategory={activeCategory}
            pendingBatchData={pendingBatchData}
            setPendingBatchData={setPendingBatchData}
            setShowBatchDashboard={setShowBatchDashboard}
            executeBatchUpload={executeBatchUpload}
            loading={loading}
          />
        )}

        {message && <p className={`mt-6 text-center text-[11px] uppercase tracking-widest font-bold ${message.includes('Error') || message.includes('failed') || message.includes('Duplicate') ? 'text-red-400' : 'text-green-400'}`}>{message}</p>}
        
        {successCode && !showBatchDashboard && (
          <div className="mt-8 p-8 bg-[#050505] border border-orange-500/30 rounded-2xl text-center shadow-[inset_0_0_20px_rgba(0,0,0,0.8),0_0_30px_rgba(249,115,22,0.1)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50"></div>
            <p className="text-[10px] text-orange-500 mb-3 font-bold uppercase tracking-[0.3em]">Official Code Generated</p>
            <p className="text-4xl md:text-5xl font-mono font-bold text-white tracking-[0.2em] drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{successCode}</p>
          </div>
        )}
      </div>

      {/* CRM SEARCH TOOL */}
      <CRMSearchTool
        adminSearchQuery={adminSearchQuery}
        setAdminSearchQuery={setAdminSearchQuery}
        handleAdminQuickSearch={handleAdminQuickSearch}
        isSearchingAdmin={isSearchingAdmin}
        hasSearchedAdmin={hasSearchedAdmin}
        adminSearchResults={adminSearchResults}
        loadCRMDashboard={loadCRMDashboard}
        searchLoading={searchLoading}
      />
    </div>
  );
};

export default AdminDashboard;
