/**
 * Admin login form — authentication gate for the Command Center.
 */
const AdminLogin = ({ loginData, setLoginData, handleLoginSubmit, loading, loginError }) => (
  <div className="animate-[fadeIn_0.4s_ease-out] max-w-[400px] mx-auto w-full pt-20 px-4">
    <div className="bg-[#080808]/90 backdrop-blur-3xl border border-white/[0.05] p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"></div>
      <div className="text-center mb-8"><div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-4 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></div><h3 className="text-xl font-bold tracking-wide uppercase">Restricted Access</h3></div>
      <form onSubmit={handleLoginSubmit} className="space-y-5">
        <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Admin Identity</label><input type="text" value={loginData.username} onChange={e => setLoginData({...loginData, username: e.target.value})} className="w-full bg-[#050505] border border-white/[0.05] rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all font-mono" required /></div>
        <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Security Passcode</label><input type="password" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} className="w-full bg-[#050505] border border-white/[0.05] rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all font-mono tracking-widest" required /></div>
        <button type="submit" disabled={loading} className="w-full mt-2 bg-orange-500/10 border border-orange-500/30 text-orange-500 font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-orange-500/20 hover:border-orange-500/50 transition-all disabled:opacity-50 text-xs shadow-[0_0_20px_rgba(249,115,22,0.1)]">{loading ? 'Authenticating...' : 'Initialize Session'}</button>
        {loginError && <p className="text-red-400 text-[11px] font-bold uppercase tracking-widest text-center mt-4">{loginError}</p>}
      </form>
    </div>
  </div>
);

export default AdminLogin;
