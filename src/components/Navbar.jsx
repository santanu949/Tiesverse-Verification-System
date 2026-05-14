/**
 * Navbar component — top navigation bar with logo, admin controls, and view switching.
 */
const Navbar = ({ currentView, isAdminAuth, resetToHome, onAdminClick }) => (
  <nav className="relative z-20 flex items-center justify-between px-6 py-6 max-w-[1400px] mx-auto w-full lg:px-10">
    <div className="flex items-center gap-2 cursor-pointer" onClick={resetToHome}>
      <div className="flex items-center"><span className="text-orange-500 text-xl font-bold">.ties</span><span className="text-white text-xl font-bold">verse</span></div>
    </div>
    <div className="flex items-center gap-4">
      {isAdminAuth && currentView === 'admin_dashboard' && <button onClick={resetToHome} className="text-xs md:text-sm text-gray-400 hover:text-white transition-colors font-medium tracking-wide">Public View</button>}
      <button onClick={onAdminClick} className={`px-5 py-2 text-sm rounded-full border transition-all duration-300 bg-transparent ${currentView.includes('admin') ? 'border-orange-500/50 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.15)]' : 'border-gray-600 hover:border-white text-white'}`}>
        {isAdminAuth ? 'Command Center' : 'Admin Login'}
      </button>
    </div>
  </nav>
);

export default Navbar;
