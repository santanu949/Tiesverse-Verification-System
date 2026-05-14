// Live deployment URL
export const API_URL = "https://script.google.com/macros/s/AKfycbzk_HxmdyL3nH653_OYBTioj0WZcJmyaWJC8IL3yvgv1dkjxBLBqCRt91kDfuRkRbOb/exec";

export const ROLES_LIST = [
  "Tech and Content Team", "Graphics Team", "Content, Research and Foreign Policy India (FPI) Team",
  "Nimble and Content Team", "Engagement Team", "Content Team", "Foreign Policy India (FPI)", "Webinar Team"
];

export const CATEGORY_LIST = ['Internship', 'Webinar', 'Offer Letter', 'Member Certificate'];

export const PIPELINE_STAGES = ['Offer Letter', 'Internship', 'Member Certificate'];

// Shared Tailwind class strings
export const inputClass = "w-full bg-[#050505] border border-white/[0.05] rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all shadow-inner placeholder-gray-700";

export const labelClass = "block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1";

// Default admin form state
export const INITIAL_ADMIN_FORM = {
  gender: 'Male', name: '', role: '', dateStart: null, dateEnd: null, lead: '', offerTemplate: 'TechTies'
};
