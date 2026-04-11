import React, { useState, useRef } from 'react';

// ✅ FIXED: Clean URL (no spaces, replaced properly)
const API_URL = "https://script.google.com/macros/s/AKfycbzvW82LoDMNTYUycjjdfzS2EJHJqHjCmpsd-hzYkT1g6nIAZ3uI2ga_-7jmLuy-GgQusQ/exec";

// =====================================================================
// 📄 COMPONENT: Full-Screen Result & Edit Page UI (Public View)
// =====================================================================
const VerificationResult = ({ data: initialData, code, onBack }) => {
  const [data] = useState({ ...initialData, email: initialData.email || 'Not provided', additionalInfo: initialData.additionalInfo || 'No additional metadata available.' });
  const isApproved = data.status === 'Approved';

  // Format Date Logic: Converts long GMT strings to "Wed May 07 2025" and hides "- Present"
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d.toDateString();
    return String(dateStr);
  };

  let displayDate = formatDate(data.date1);
  if (data.date2 && String(data.date2).toLowerCase() !== 'present') {
    displayDate += ` - ${formatDate(data.date2)}`;
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 md:py-6 animate-[fadeIn_0.5s_ease-out] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group px-4 py-2 bg-white/[0.03] rounded-full border border-white/5 backdrop-blur-md">
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>
      </div>

      <div className="w-full bg-gradient-to-r from-white/[0.05] to-transparent backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-5 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.3)] mb-6 relative overflow-hidden flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className={`absolute top-0 left-0 w-2 h-full ${isApproved ? 'bg-green-500 shadow-[0_0_30px_#22c55e]' : 'bg-orange-500 shadow-[0_0_30px_#f97316]'}`}></div>
        
        <div className="flex-1 text-center md:text-left w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
            <div>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-2">{data.category || 'Verified Identity'}</p>
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
              Professional Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">Role / Title</label>
                <p className="text-lg text-gray-200 font-medium">{data.secondaryRole}</p>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">Date Details</label>
                <p className="text-lg text-gray-200 font-medium">{displayDate}</p>
              </div>
              {data.lead && (
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">Lead</label>
                  <p className="text-lg text-gray-200 font-medium">{data.lead}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="bg-[#050505] border border-white/5 rounded-2xl p-5 shadow-inner">
            <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">System Record</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Global Verification Code</p>
                <div className="bg-black/60 border border-white/5 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-xl font-mono text-white tracking-widest">{code}</span>
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2-2v8a2 2 0 002 2z" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// =====================================================================
// 🏠 MAIN APP COMPONENT
// =====================================================================
function App() {
  const [currentView, setCurrentView] = useState('home'); 
  const [isAdminAuth, setIsAdminAuth] = useState(false);

  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [activeCategory, setActiveCategory] = useState('Internship'); 
  const [activeTab, setActiveTab] = useState('single'); 
  const [adminFormData, setAdminFormData] = useState({ field1: '', field2: '', field3: '', field4: '', field5: '' });
  const [csvFile, setCsvFile] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [successCode, setSuccessCode] = useState(null);
  const fileInputRef = useRef(null);

  const [searchCode, setSearchCode] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState('');

  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [adminSearchResults, setAdminSearchResults] = useState([]);
  const [isSearchingAdmin, setIsSearchingAdmin] = useState(false);
  const [hasSearchedAdmin, setHasSearchedAdmin] = useState(false);
  
  const [generatingCode, setGeneratingCode] = useState(null);


  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');
    try {
      const response = await fetch(API_URL, { method: 'POST', body: JSON.stringify({ action: 'login', ...loginData }), headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
      const result = await response.json();
      if (result.success) { setIsAdminAuth(true); setCurrentView('admin_dashboard'); } else { setLoginError(result.error || 'Invalid credentials'); }
    } catch (err) { setLoginError('Connection failed.'); }
    setLoading(false);
  };

  const handleAdminInputChange = (e) => setAdminFormData({ ...adminFormData, [e.target.name]: e.target.value });
  
  const parseCSV = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split('\n').filter(row => row.trim().length > 0);
        const data = rows.slice(1).map(row => {
          const values = row.split(',').map(v => v.trim());
          return { field1: values[0]||'', field2: values[1]||'', field3: values[2]||'', field4: values[3]||'', field5: values[4]||'' };
        });
        resolve(data);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setSuccessCode(null);

    try {
      let payload = { action: activeTab === 'single' ? 'single_upload' : 'bulk_upload', category: activeCategory };
      if (activeTab === 'single') { payload.data = adminFormData; } else {
        if (!csvFile) { setMessage("Please select a CSV file."); setLoading(false); return; }
        payload.data = await parseCSV(csvFile);
      }

      const response = await fetch(API_URL, { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
      const result = await response.json();
      
      if (result.success) {
        setMessage(result.message || 'Success!');
        if (result.code) setSuccessCode(result.code);
        setAdminFormData({ field1: '', field2: '', field3: '', field4: '', field5: '' });
        setCsvFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else { setMessage(result.error || 'Upload failed.'); }
    } catch (error) { setMessage('Network error.'); }
    setLoading(false);
  };

  const handleAdminQuickSearch = async (e) => {
    e.preventDefault();
    if (!adminSearchQuery.trim()) return;

    setIsSearchingAdmin(true);
    setHasSearchedAdmin(true);
    try {
      const response = await fetch(API_URL, { method: 'POST', body: JSON.stringify({ action: 'search_users', query: adminSearchQuery }), headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
      const result = await response.json();
      if (result.success) setAdminSearchResults(result.results); else setAdminSearchResults([]);
    } catch (error) { setAdminSearchResults([]); }
    setIsSearchingAdmin(false);
  };

  const handleGenerateCertificate = async (userCode) => {
    setGeneratingCode(userCode); 
    try {
      const response = await fetch(API_URL, { 
        method: 'POST', 
        body: JSON.stringify({ action: 'generate_certificate', code: userCode }), 
        headers: { 'Content-Type': 'text/plain;charset=utf-8' } 
      });
      const result = await response.json();
      
      if (result.success) {
        setAdminSearchResults(prevResults => 
          prevResults.map(u => u.code === userCode ? { ...u, pdfLink: result.url } : u)
        );
        alert(`Success! Certificate PDF generated for ${userCode}`);
      } else {
        alert("Failed to generate: " + result.error);
      }
    } catch (error) {
      alert("Network error during generation.");
    }
    setGeneratingCode(null);
  };

  const handleLookupSubmit = async (e) => {
    e.preventDefault();
    if (!searchCode) return;
    setSearchLoading(true); setSearchError(''); setSearchResult(null);
    try {
      const response = await fetch(`${API_URL}?code=${searchCode}`);
      const result = await response.json();
      if (result.error) { setSearchError(result.error); } 
      else { setSearchResult(result); setCurrentView('result'); }
    } catch (error) { setSearchError('Failed to search database.'); }
    setSearchLoading(false);
  };

  const resetToHome = () => { setCurrentView('home'); setSearchCode(''); setSearchResult(null); };

  const inputClass = "w-full bg-[#050505] border border-white/[0.05] rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all shadow-inner placeholder-gray-700";
  const labelClass = "block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1";

  const renderDynamicFields = () => {
    if (activeCategory === 'Webinar') {
      return (
        <div className="space-y-5">
          <div><label className={labelClass}>Webinar Title</label><input type="text" name="field1" value={adminFormData.field1} onChange={handleAdminInputChange} required className={inputClass} /></div>
          <div><label className={labelClass}>Author Name</label><input type="text" name="field2" value={adminFormData.field2} onChange={handleAdminInputChange} required className={inputClass} /></div>
          <div className="grid grid-cols-2 gap-5">
            <div><label className={labelClass}>Date</label><input type="date" name="field3" value={adminFormData.field3} onChange={handleAdminInputChange} required className={inputClass} /></div>
            <div><label className={labelClass}>Time</label><input type="time" name="field4" value={adminFormData.field4} onChange={handleAdminInputChange} required className={inputClass} /></div>
          </div>
          <div className="p-4 mt-2 bg-[#030303] border border-white/[0.03] rounded-xl text-xs text-gray-500 text-center font-bold uppercase tracking-[0.2em] shadow-inner">Conducted by Tiesverse</div>
        </div>
      );
    } else if (activeCategory === 'Internship') {
      return (
        <div className="space-y-5">
          <div><label className={labelClass}>Intern Name</label><input type="text" name="field1" value={adminFormData.field1} onChange={handleAdminInputChange} required className={inputClass} /></div>
          <div><label className={labelClass}>Role / Position</label><input type="text" name="field2" value={adminFormData.field2} onChange={handleAdminInputChange} required className={inputClass} /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div><label className={labelClass}>Start Date</label><input type="date" name="field3" value={adminFormData.field3} onChange={handleAdminInputChange} required className={inputClass} /></div>
            <div><label className={labelClass}>End Date (Or 'Present')</label><input type="text" name="field4" value={adminFormData.field4} onChange={handleAdminInputChange} required placeholder="YYYY-MM-DD or Present" className={inputClass} /></div>
          </div>
          <div><label className={labelClass}>Lead</label><input type="text" name="field5" value={adminFormData.field5} onChange={handleAdminInputChange} required className={inputClass} placeholder="Enter Lead Name..." /></div>
        </div>
      );
    } else {
      return (
        <div className="space-y-5">
          <div><label className={labelClass}>Recipient Name</label><input type="text" name="field1" value={adminFormData.field1} onChange={handleAdminInputChange} required className={inputClass} /></div>
          <div><label className={labelClass}>Role / Domain</label><input type="text" name="field2" value={adminFormData.field2} onChange={handleAdminInputChange} required className={inputClass} /></div>
          <div><label className={labelClass}>Issued Date</label><input type="date" name="field3" value={adminFormData.field3} onChange={handleAdminInputChange} required className={inputClass} /></div>
          <div><label className={labelClass}>Additional Details (Optional)</label><input type="text" name="field4" value={adminFormData.field4} onChange={handleAdminInputChange} className={inputClass} /></div>
        </div>
      );
    }
  };

  const renderCsvInstructions = () => {
    let cols = "";
    if(activeCategory === 'Webinar') cols = "Title, Author, Date, Time";
    if(activeCategory === 'Internship') cols = "Name, Role, Start Date, End Date, Lead";
    if(activeCategory === 'Certification') cols = "Name, Domain, Issue Date, Details";
    return <span className="text-[10px] text-gray-500 mt-3 font-mono tracking-widest uppercase">Required Columns: {cols}</span>;
  };

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-orange-500/30 flex flex-col pb-8 md:pb-12">
      
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-orange-900/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

      <nav className="relative z-20 flex items-center justify-between px-6 py-6 max-w-[1400px] mx-auto w-full lg:px-10">
        <div className="flex items-center gap-2 cursor-pointer" onClick={resetToHome}>
          <div className="flex items-center">
             <span className="text-orange-500 text-xl font-bold">.ties</span>
             <span className="text-white text-xl font-bold">verse</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {isAdminAuth && currentView === 'admin_dashboard' && (
            <button onClick={resetToHome} className="text-xs md:text-sm text-gray-400 hover:text-white transition-colors font-medium tracking-wide">Public View</button>
          )}
          <button 
            onClick={() => setCurrentView(isAdminAuth ? 'admin_dashboard' : 'admin_login')}
            className={`px-5 py-2 text-sm rounded-full border transition-all duration-300 bg-transparent ${currentView.includes('admin') ? 'border-orange-500/50 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.15)]' : 'border-gray-600 hover:border-white text-white'}`}
          >
            {isAdminAuth ? 'Command Center' : 'Admin Login'}
          </button>
        </div>
      </nav>

      <div className="relative z-10 flex-1 flex flex-col w-full">

        {currentView === 'home' && (
          <div className="animate-[fadeIn_0.4s_ease-out] flex-1 flex flex-col">
            
            <main className="relative z-10 flex flex-col items-center text-center mt-6 md:mt-10 px-4">
              <h1 className="text-5xl sm:text-6xl md:text-[80px] font-extrabold leading-[1.1] tracking-tight max-w-5xl">
                Build ‘<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-orange-500 to-orange-600 drop-shadow-[0_0_30px_rgba(249,115,22,0.3)]">Trust</span>’ with Instant <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 drop-shadow-[0_0_30px_rgba(249,115,22,0.3)]">Role Verification.</span>
              </h1>

              {/* ✅ RESTORED: Get Started Button */}
              <button className="mt-8 md:mt-10 px-8 py-3.5 rounded-full border border-orange-500 text-white text-lg font-medium bg-black/50 hover:bg-orange-500/10 transition-all shadow-[0_0_20px_rgba(249,115,22,0.2)] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] backdrop-blur-md">
                Get Started
              </button>

              {/* ✅ RESTORED: Mouse/Scroll Indicator */}
              <div className="mt-8 md:mt-10 mb-4 opacity-50">
                <svg className="w-6 h-10 text-gray-400" viewBox="0 0 24 36" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="5" y="2" width="14" height="28" rx="7" />
                  <path d="M12 10v4" strokeLinecap="round" />
                </svg>
              </div>
            </main>

            <section className="relative z-10 max-w-[1400px] w-full mx-auto px-6 lg:px-10 mt-6 mb-10 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              
              <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 h-full">
                
                {/* Pos 1: Secure Submission */}
                <div className="bg-[#080808] border border-white/5 rounded-2xl p-6 transition-all hover:border-orange-500/20 hover:bg-[#0c0c0c] flex flex-col h-full">
                  <div className="w-10 h-10 rounded-lg bg-[#111] border border-white/5 flex items-center justify-center mb-5 text-orange-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  </div>
                  <h3 className="text-white text-base font-semibold mb-2">Secure Submission</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">Input Name, Company, & Role. Or upload via CSV.</p>
                </div>

                {/* Pos 2: Enter 10 Digit Code */}
                <div className="flex flex-col gap-4 w-full h-full justify-end">
                  <div className="bg-[#080808] border border-white/5 rounded-2xl p-5 flex-1 flex flex-col justify-center w-full">
                    <form onSubmit={handleLookupSubmit} className="flex gap-2">
                      <input type="text" value={searchCode} onChange={(e) => setSearchCode(e.target.value)} maxLength="10" required placeholder="Enter 10-Digit Code" className="flex-1 bg-[#030303] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors font-mono" />
                      <button type="submit" disabled={searchLoading} className="bg-white/5 hover:bg-white/10 border border-white/5 text-white text-sm px-5 py-3 rounded-xl transition-all disabled:opacity-50">
                        {searchLoading ? '...' : 'Search'}
                      </button>
                    </form>
                    {searchError && <p className="text-red-400 text-xs mt-3 text-center">{searchError}</p>}
                  </div>
                  <div className="bg-[#080808] border border-white/5 p-4 rounded-xl text-center">
                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      Sign up for users to get lose the TIESVERSE<br />premium, and uncluttered.
                    </p>
                  </div>
                </div>
              </div>

              <div className="xl:col-span-4 flex flex-col gap-4 w-full h-full justify-end">
                 {/* Pos 3: Unique 10-Digit Code */}
                 <div className="bg-[#080808] border border-white/5 rounded-2xl p-6 transition-all hover:border-orange-500/20 hover:bg-[#0c0c0c] flex flex-col h-full">
                  <div className="w-10 h-10 rounded-lg bg-[#111] border border-white/5 flex items-center justify-center mb-5 text-orange-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                  </div>
                  <h3 className="text-white text-base font-semibold mb-2">Unique 10-Digit Code</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">Receive a globally unique identifier instantly.</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentView === 'result' && searchResult && (
          <div className="max-w-7xl mx-auto w-full px-4 md:px-6">
            <VerificationResult data={searchResult} code={searchCode} onBack={resetToHome} />
          </div>
        )}

        {currentView === 'admin_login' && (
          <div className="animate-[fadeIn_0.4s_ease-out] max-w-[400px] mx-auto w-full pt-20 px-4">
            <div className="bg-[#080808]/90 backdrop-blur-3xl border border-white/[0.05] p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"></div>
              
              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-4 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <h3 className="text-xl font-bold tracking-wide uppercase">Restricted Access</h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Authorized Personnel Only</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Admin Identity</label>
                  <input type="text" value={loginData.username} onChange={e => setLoginData({...loginData, username: e.target.value})} className="w-full bg-[#050505] border border-white/[0.05] rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all font-mono" required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Security Passcode</label>
                  <input type="password" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} className="w-full bg-[#050505] border border-white/[0.05] rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all font-mono tracking-widest" required />
                </div>
                <button type="submit" disabled={loading} className="w-full mt-2 bg-orange-500/10 border border-orange-500/30 text-orange-500 font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-orange-500/20 hover:border-orange-500/50 transition-all disabled:opacity-50 text-xs shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                  {loading ? 'Authenticating...' : 'Initialize Session'}
                </button>
                {loginError && <p className="text-red-400 text-[11px] font-bold uppercase tracking-widest text-center mt-4">{loginError}</p>}
              </form>
            </div>
          </div>
        )}

        {currentView === 'admin_dashboard' && (
          <div className="animate-[fadeIn_0.4s_ease-out] w-full max-w-5xl mx-auto pt-6 md:pt-10 px-4 md:px-6">
            
            <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/[0.05] pb-6 relative">
               <div className="absolute bottom-0 left-0 w-1/3 h-[1px] bg-gradient-to-r from-orange-500/50 to-transparent"></div>
               <div>
                  <div className="flex items-center gap-3 mb-2">
                     <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]"></div>
                     <h2 className="text-3xl font-bold tracking-tight text-white uppercase" style={{ letterSpacing: '1px' }}>Command Center</h2>
                  </div>
                  <p className="text-gray-500 text-xs font-mono tracking-wide">SECURE CREDENTIAL GENERATION NETWORK</p>
               </div>
               
               <div className="mt-6 md:mt-0 flex bg-[#050505] p-1.5 rounded-xl border border-white/5 shadow-inner">
                  {['Internship', 'Webinar', 'Certification'].map(cat => (
                    <button key={cat} onClick={() => {setActiveCategory(cat); setMessage(''); setSuccessCode(null);}} className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${activeCategory === cat ? 'bg-orange-500/10 border border-orange-500/30 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.15)]' : 'bg-transparent border border-transparent text-gray-600 hover:text-gray-300'}`}>
                      {cat}
                    </button>
                  ))}
               </div>
            </div>

            <div className="bg-[#080808]/90 backdrop-blur-3xl border border-white/[0.05] rounded-3xl p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden mb-12">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent"></div>
              
              <div className="flex bg-[#030303] p-1.5 rounded-xl mb-8 border border-white/[0.03] shadow-inner">
                <button onClick={() => {setActiveTab('single'); setMessage(''); setSuccessCode(null);}} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-lg transition-all duration-300 ${activeTab === 'single' ? 'bg-white/[0.08] text-white shadow-sm border border-white/5' : 'text-gray-600 hover:text-gray-400 border border-transparent'}`}>Single Issuance</button>
                <button onClick={() => {setActiveTab('bulk'); setMessage(''); setSuccessCode(null);}} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-lg transition-all duration-300 ${activeTab === 'bulk' ? 'bg-white/[0.08] text-white shadow-sm border border-white/5' : 'text-gray-600 hover:text-gray-400 border border-transparent'}`}>Batch Processor (CSV)</button>
              </div>

              <form onSubmit={handleAdminSubmit} className="space-y-5">
                {activeTab === 'single' ? renderDynamicFields() : (
                  <div className="border-2 border-dashed border-white/10 hover:border-orange-500/50 rounded-2xl p-12 text-center transition-all duration-300 bg-[#050505] group">
                    <input type="file" accept=".csv" onChange={e => setCsvFile(e.target.files[0])} className="hidden" id="csv-upload" ref={fileInputRef}/>
                    <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/[0.05] flex items-center justify-center mb-5 group-hover:bg-orange-500/10 group-hover:border-orange-500/30 transition-all duration-300 shadow-inner">
                        <svg className="w-7 h-7 text-gray-500 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                      </div>
                      <span className="text-white font-medium mb-2 tracking-wide">{csvFile ? csvFile.name : `Secure Data Upload: ${activeCategory}`}</span>
                      {renderCsvInstructions()}
                    </label>
                  </div>
                )}
                <button type="submit" disabled={loading} className="w-full mt-6 px-6 py-4 rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-500 font-bold uppercase tracking-widest hover:bg-orange-500/20 hover:border-orange-500/50 transition-all shadow-[0_0_20px_rgba(249,115,22,0.1)] hover:shadow-[0_0_30px_rgba(249,115,22,0.2)] disabled:opacity-50 text-xs">
                  {loading ? 'Processing Protocol...' : activeTab === 'single' ? `Authorize & Generate ${activeCategory}` : `Execute Batch ${activeCategory} Upload`}
                </button>
              </form>

              {message && <p className={`mt-6 text-center text-[11px] uppercase tracking-widest font-bold ${message.includes('error') || message.includes('failed') ? 'text-red-400' : 'text-green-400'}`}>{message}</p>}
              
              {successCode && (
                <div className="mt-8 p-8 bg-[#050505] border border-orange-500/30 rounded-2xl text-center shadow-[inset_0_0_20px_rgba(0,0,0,0.8),0_0_30px_rgba(249,115,22,0.1)] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50"></div>
                  <p className="text-[10px] text-orange-500 mb-3 font-bold uppercase tracking-[0.3em]">Official Code Generated</p>
                  <p className="text-4xl md:text-5xl font-mono font-bold text-white tracking-[0.2em] drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{successCode}</p>
                </div>
              )}
            </div>

            <div className="bg-[#080808]/90 backdrop-blur-3xl border border-white/[0.05] rounded-3xl p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden mb-12">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent"></div>
              
              <div className="flex items-center gap-3 mb-6">
                 <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                 <h3 className="text-lg font-bold tracking-wide uppercase text-white">Database Query Tool</h3>
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
                    <div className="text-center p-8 bg-[#050505] border border-white/5 rounded-xl border-dashed">
                      <p className="text-sm text-gray-500 font-mono">NO RECORDS MATCHING QUERY</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {adminSearchResults.map((user, idx) => (
                        <div key={idx} className="bg-[#050505] border border-white/[0.05] p-5 rounded-2xl hover:border-orange-500/30 transition-colors group relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center">
                          <div className="absolute top-0 left-0 w-1 h-full bg-orange-500/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          
                          <div className="mb-4 md:mb-0 w-full">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500 bg-orange-500/10 px-2 py-1 rounded-md">{user.category}</span>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-1 rounded-md">{user.status}</span>
                            </div>
                            <h4 className="text-lg font-bold text-white mb-1">{user.primaryName}</h4>
                            <p className="text-xs text-gray-400 font-mono">CODE: <span className="text-white tracking-widest">{user.code}</span></p>
                          </div>
                          
                          <div className="flex-shrink-0 w-full md:w-auto">
                            {user.pdfLink ? (
                               <a href={user.pdfLink} target="_blank" rel="noreferrer" className="block text-center px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:border-white/30 text-[10px] font-bold uppercase tracking-widest transition-all w-full">
                                 View Generated PDF
                               </a>
                            ) : (
                               <button 
                                 onClick={() => handleGenerateCertificate(user.code)} 
                                 disabled={generatingCode === user.code}
                                 className="px-6 py-3 rounded-xl border border-orange-500/50 bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50 w-full"
                               >
                                 {generatingCode === user.code ? 'Generating...' : 'Generate PDF'}
                               </button>
                            )}
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
      <style dangerouslySetInnerHTML={{__html: `@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}} />
    </div>
  );
}

export default App;