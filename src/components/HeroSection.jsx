/**
 * 🏠 HeroSection — Landing page hero with headline, CTA, scroll indicator, and feature cards.
 */
const HeroSection = ({ searchCode, setSearchCode, searchLoading, searchError, handleLookupSubmit, scrollToNextSection }) => (
  <div className="animate-[fadeIn_0.4s_ease-out] flex-1 flex flex-col">
    <main className="relative z-10 flex flex-col items-center text-center mt-6 md:mt-10 px-4">
      <h1 className="text-5xl sm:text-6xl md:text-[80px] font-extrabold leading-[1.1] tracking-tight max-w-5xl">Build '<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-orange-500 to-orange-600 drop-shadow-[0_0_30px_rgba(249,115,22,0.3)]">Trust</span>' with Instant <br className="hidden md:block" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 drop-shadow-[0_0_30px_rgba(249,115,22,0.3)]">Role Verification.</span></h1>
      <button className="mt-8 md:mt-10 px-8 py-3.5 rounded-full border border-orange-500 text-white text-lg font-medium bg-black/50 hover:bg-orange-500/10 transition-all shadow-[0_0_20px_rgba(249,115,22,0.2)] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] backdrop-blur-md">Get Started</button>
      
      <div id="scroll-indicator" onClick={scrollToNextSection} className="mt-8 md:mt-10 mb-4 flex justify-center opacity-50 transition-opacity duration-300 cursor-pointer hover:opacity-80">
        <svg className="w-6 h-10 text-gray-400 drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] transition-colors hover:text-orange-500" viewBox="0 0 24 36" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="5" y="2" width="14" height="28" rx="7" />
          <path className="scroll-wheel" d="M12 10v4" strokeLinecap="round" />
        </svg>
      </div>
    </main>

    <section id="next-section" className="relative z-10 max-w-[1400px] w-full mx-auto px-6 lg:px-10 mt-6 mb-10 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 h-full">
        <div className="bg-[#080808] border border-white/5 rounded-2xl p-6 transition-all hover:border-orange-500/20 hover:bg-[#0c0c0c] flex flex-col h-full"><div className="w-10 h-10 rounded-lg bg-[#111] border border-white/5 flex items-center justify-center mb-5 text-orange-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></div><h3 className="text-white text-base font-semibold mb-2">Secure Lookup</h3><p className="text-gray-500 text-sm leading-relaxed">Enter an official verification code to authenticate any document.</p></div>
        <div className="flex flex-col gap-4 w-full h-full justify-end">
          <div className="bg-[#080808] border border-white/5 rounded-2xl p-5 flex-1 flex flex-col justify-center w-full">
            <form onSubmit={handleLookupSubmit} className="flex gap-2">
              <input type="text" value={searchCode} onChange={(e) => setSearchCode(e.target.value)} maxLength="10" required placeholder="Enter 10-Digit Code" className="flex-1 bg-[#030303] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors font-mono" />
              <button type="submit" disabled={searchLoading} className="bg-white/5 hover:bg-white/10 border border-white/5 text-white text-sm px-5 py-3 rounded-xl transition-all disabled:opacity-50">{searchLoading ? '...' : 'Verify'}</button>
            </form>
            {searchError && <p className="text-red-400 text-xs mt-3 text-center">{searchError}</p>}
          </div>
        </div>
      </div>
      <div className="xl:col-span-4 flex flex-col gap-4 w-full h-full justify-end">
         <div className="bg-[#080808] border border-white/5 rounded-2xl p-6 transition-all hover:border-orange-500/20 hover:bg-[#0c0c0c] flex flex-col h-full"><div className="w-10 h-10 rounded-lg bg-[#111] border border-white/5 flex items-center justify-center mb-5 text-orange-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg></div><h3 className="text-white text-base font-semibold mb-2">Unique Identifier</h3><p className="text-gray-500 text-sm leading-relaxed">Every document possesses a globally unique, tamper-proof ID.</p></div>
      </div>
    </section>
  </div>
);

export default HeroSection;
