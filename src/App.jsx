import { useState, useRef } from 'react';
import { INITIAL_ADMIN_FORM } from './constants';
import { formatDateForBackend } from './utils/dateUtils';
import { loginAdmin, lookupByCode, singleUpload, bulkUpload, searchUsers } from './api/verificationApi';

// Components
import DatePickerStyles from './components/ui/DatePickerStyles';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import VerificationResult from './components/VerificationResult';
import CRMDashboard from './components/CRMDashboard';

// =====================================================================
// 🏠 MAIN APP COMPONENT — Slim Orchestrator
// =====================================================================
function App() {
  // View & auth state
  const [currentView, setCurrentView] = useState('home'); 
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Admin dashboard state
  const [activeCategory, setActiveCategory] = useState('Offer Letter'); 
  const [activeTab, setActiveTab] = useState('single'); 
  
  const [adminFormData, setAdminFormData] = useState(INITIAL_ADMIN_FORM);
  const [isCurrentlyEmployed, setIsCurrentlyEmployed] = useState(false);
  
  // Batch upload state
  const [csvFile, setCsvFile] = useState(null);
  const [pendingBatchData, setPendingBatchData] = useState([]); 
  const [showBatchDashboard, setShowBatchDashboard] = useState(false);

  // Global loading/messaging
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [successCode, setSuccessCode] = useState(null);
  const fileInputRef = useRef(null);

  // Public search state
  const [searchCode, setSearchCode] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState('');

  // Admin CRM search state
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [adminSearchResults, setAdminSearchResults] = useState([]);
  const [isSearchingAdmin, setIsSearchingAdmin] = useState(false);
  const [hasSearchedAdmin, setHasSearchedAdmin] = useState(false);

  // ── Handlers ──

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setLoginError('');
    try {
      const result = await loginAdmin(loginData);
      if (result.success) { setIsAdminAuth(true); setCurrentView('admin_dashboard'); } else { setLoginError(result.error || 'Invalid credentials'); }
    } catch (err) { setLoginError('Connection failed.'); }
    setLoading(false);
  };

  const handleAdminInputChange = (e) => { setAdminFormData({ ...adminFormData, [e.target.name]: e.target.value }); };
  const handleDateChange = (field, date) => { setAdminFormData({ ...adminFormData, [field]: date }); };
  
  const parseCSV = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split('\n').filter(row => row.trim().length > 0);
        if (rows.length < 2) { setMessage("CSV is empty or missing headers."); return; }
        
        const parsedData = rows.slice(1).map(row => {
          const values = row.split(',').map(v => v.trim());
          return { gender: '', name: values[1]||values[0]||'', role: values[2]||values[1]||'', dateStart: values[3]||values[2]||'', dateEnd: values[4]||values[3]||'', lead: values[5]||values[4]||'', offerTemplate: 'TechTies' };
        });
        setPendingBatchData(parsedData); setShowBatchDashboard(true); setMessage('');
      };
      reader.readAsText(file);
    });
  };

  const executeBatchUpload = async () => {
      if (activeCategory !== 'Webinar') {
          if (pendingBatchData.some(row => !row.gender)) { setMessage("Error: Assign a gender to all rows."); return; }
      }
      setLoading(true); setMessage('');
      try {
        const result = await bulkUpload(activeCategory, pendingBatchData);
        if (result.success) {
          setMessage(result.message || 'Batch Success!'); setPendingBatchData([]); setShowBatchDashboard(false); setCsvFile(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        } else { setMessage(result.error || 'Batch upload failed.'); }
      } catch (error) { setMessage('Network error during batch execution.'); }
      setLoading(false);
  };

  const handleAdminSubmitSingle = async (e) => {
    e.preventDefault();
    setLoading(true); setMessage(''); setSuccessCode(null);

    if (!adminFormData.name || !adminFormData.role || !adminFormData.dateStart) {
        setMessage("Error: Name, Role, and Start/Issue Date are mandatory."); setLoading(false); return;
    }
    try {
        const payload = { ...adminFormData, dateStart: formatDateForBackend(adminFormData.dateStart), dateEnd: isCurrentlyEmployed ? 'Present' : formatDateForBackend(adminFormData.dateEnd) };
        const result = await singleUpload(activeCategory, payload);
        if (result.success) {
          setMessage('Success!'); if (result.code) setSuccessCode(result.code);
          setAdminFormData(INITIAL_ADMIN_FORM);
          setIsCurrentlyEmployed(false);
        } else { setMessage(result.error || 'Upload failed.'); }
    } catch (error) { setMessage('Network error.'); }
    setLoading(false);
  };

  const handleAdminQuickSearch = async (e) => {
    e.preventDefault();
    if (!adminSearchQuery.trim()) return;
    setIsSearchingAdmin(true);
    try {
      const result = await searchUsers(adminSearchQuery);
      if (result.success) setAdminSearchResults(result.results); else setAdminSearchResults([]);
    } catch (error) { setAdminSearchResults([]); }
    setIsSearchingAdmin(false);
    setHasSearchedAdmin(true);
  };

  const loadCRMDashboard = async (userCode) => {
      setSearchLoading(true); setSearchError(''); setSearchResult(null);
      try {
        const result = await lookupByCode(userCode);
        if (result.error) { setSearchError(result.error); } else { setSearchResult(result); setCurrentView('result'); }
      } catch (error) { setSearchError('Failed to fetch CRM record.'); }
      setSearchLoading(false);
  };

  const handleLookupSubmit = async (e) => { e.preventDefault(); if (!searchCode) return; await loadCRMDashboard(searchCode); };
  const resetToHome = () => { setCurrentView('home'); setSearchCode(''); setSearchResult(null); };
  const scrollToNextSection = () => { window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' }); };

  // ── Render ──

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-orange-500/30 flex flex-col pb-8 md:pb-12">
      
      <DatePickerStyles />

      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-orange-900/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

      <Navbar
        currentView={currentView}
        isAdminAuth={isAdminAuth}
        resetToHome={resetToHome}
        onAdminClick={() => setCurrentView(isAdminAuth ? 'admin_dashboard' : 'admin_login')}
      />

      <div className="relative z-10 flex-1 flex flex-col w-full">
        {currentView === 'home' && (
          <HeroSection
            searchCode={searchCode}
            setSearchCode={setSearchCode}
            searchLoading={searchLoading}
            searchError={searchError}
            handleLookupSubmit={handleLookupSubmit}
            scrollToNextSection={scrollToNextSection}
          />
        )}

        {currentView === 'result' && searchResult && (isAdminAuth ? <CRMDashboard initialData={searchResult} searchCodeUsed={searchCode} onBack={resetToHome} isAdmin={isAdminAuth} /> : <VerificationResult data={searchResult} code={searchCode} onBack={resetToHome} />)}

        {currentView === 'admin_login' && (
          <AdminLogin
            loginData={loginData}
            setLoginData={setLoginData}
            handleLoginSubmit={handleLoginSubmit}
            loading={loading}
            loginError={loginError}
          />
        )}

        {currentView === 'admin_dashboard' && (
          <AdminDashboard
            activeCategory={activeCategory} setActiveCategory={setActiveCategory}
            activeTab={activeTab} setActiveTab={setActiveTab}
            adminFormData={adminFormData} setAdminFormData={setAdminFormData}
            handleAdminInputChange={handleAdminInputChange} handleDateChange={handleDateChange}
            isCurrentlyEmployed={isCurrentlyEmployed} setIsCurrentlyEmployed={setIsCurrentlyEmployed}
            csvFile={csvFile} setCsvFile={setCsvFile}
            pendingBatchData={pendingBatchData} setPendingBatchData={setPendingBatchData}
            showBatchDashboard={showBatchDashboard} setShowBatchDashboard={setShowBatchDashboard}
            parseCSV={parseCSV} executeBatchUpload={executeBatchUpload}
            handleAdminSubmitSingle={handleAdminSubmitSingle}
            loading={loading} message={message} successCode={successCode}
            setMessage={setMessage} setSuccessCode={setSuccessCode}
            adminSearchQuery={adminSearchQuery} setAdminSearchQuery={setAdminSearchQuery}
            handleAdminQuickSearch={handleAdminQuickSearch}
            isSearchingAdmin={isSearchingAdmin} hasSearchedAdmin={hasSearchedAdmin}
            adminSearchResults={adminSearchResults}
            loadCRMDashboard={loadCRMDashboard} searchLoading={searchLoading}
            fileInputRef={fileInputRef}
          />
        )}
      </div>
    </div>
  );
}

export default App;