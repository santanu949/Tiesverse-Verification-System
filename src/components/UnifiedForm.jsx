import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import StrictDateInput from './ui/StrictDateInput';
import { ROLES_LIST, inputClass, labelClass } from '../constants';

/**
 * UnifiedForm — Dynamic form for single record issuance.
 * Adapts fields based on active category (Internship, Webinar, Offer Letter, Member Certificate).
 */
const UnifiedForm = ({ activeCategory, adminFormData, setAdminFormData, handleAdminInputChange, handleDateChange, isCurrentlyEmployed, setIsCurrentlyEmployed }) => {
  const isGenderAware = activeCategory === 'Internship' || activeCategory === 'Member Certificate' || activeCategory === 'Offer Letter';
  const isWebinar = activeCategory === 'Webinar';
  const isOfferLetter = activeCategory === 'Offer Letter';
  
  return (
    <div className="space-y-5">
      {isOfferLetter && (
        <div className="flex bg-[#030303] p-1.5 rounded-xl border border-white/[0.03] shadow-inner mb-6">
          <button type="button" onClick={() => setAdminFormData({...adminFormData, offerTemplate: 'TechTies'})} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-lg transition-all duration-300 ${adminFormData.offerTemplate === 'TechTies' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/30' : 'text-gray-600 hover:text-gray-400 border border-transparent'}`}>TechTies Template</button>
          <button type="button" onClick={() => setAdminFormData({...adminFormData, offerTemplate: 'TiesVerse'})} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-lg transition-all duration-300 ${adminFormData.offerTemplate === 'TiesVerse' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/30' : 'text-gray-600 hover:text-gray-400 border border-transparent'}`}>TiesVerse Template</button>
        </div>
      )}

      {isGenderAware && (
        <div className="flex bg-[#030303] p-1.5 rounded-xl border border-white/[0.03] shadow-inner mb-6">
          <button type="button" onClick={() => setAdminFormData({...adminFormData, gender: 'Male'})} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-lg transition-all duration-300 ${adminFormData.gender === 'Male' ? 'bg-white/[0.08] text-white shadow-sm border border-white/5' : 'text-gray-600 hover:text-gray-400 border border-transparent'}`}>Male Identity</button>
          <button type="button" onClick={() => setAdminFormData({...adminFormData, gender: 'Female'})} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-lg transition-all duration-300 ${adminFormData.gender === 'Female' ? 'bg-white/[0.08] text-white shadow-sm border border-white/5' : 'text-gray-600 hover:text-gray-400 border border-transparent'}`}>Female Identity</button>
        </div>
      )}

      <div>
        <label className={labelClass}>{isWebinar ? 'Webinar Title' : isOfferLetter ? 'Employee Name' : 'Full Name'}</label>
        <input type="text" name="name" value={adminFormData.name} onChange={handleAdminInputChange} required className={inputClass} placeholder={isWebinar ? 'Enter title' : 'e.g., Mr. M. Devi Charan'} />
      </div>

      <div>
        <label className={labelClass}>{isWebinar ? 'Author Name' : isOfferLetter ? 'Job Title' : 'Role / Position'}</label>
        <input type="text" name="role" list="roles-datalist" value={adminFormData.role} onChange={handleAdminInputChange} required className={inputClass} placeholder={isOfferLetter ? 'e.g., Software Engineer' : 'Select from dropdown or type custom role...'} />
        {!isOfferLetter && !isWebinar && <datalist id="roles-datalist">{ROLES_LIST.map((r, i) => <option key={i} value={r} />)}</datalist>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-50">
        <div>
          <label className={labelClass}>{isWebinar ? 'Date' : isOfferLetter ? 'Issuance Date' : 'Start Date'}</label>
          <DatePicker selected={adminFormData.dateStart} onChange={(date) => handleDateChange('dateStart', date)} dateFormat="dd/MM/yyyy" customInput={<StrictDateInput placeholder="DD/MM/YYYY" />} required />
        </div>
        <div>
          <label className={labelClass}>{isWebinar ? 'Time' : isOfferLetter ? 'Joining Date' : "End Date (Or 'Present')"}</label>
          {isWebinar ? (
            <StrictDateInput isTime value={adminFormData.dateEnd} onChange={handleAdminInputChange} name="dateEnd" required />
          ) : isOfferLetter ? (
            <DatePicker selected={adminFormData.dateEnd} onChange={(date) => handleDateChange('dateEnd', date)} minDate={adminFormData.dateStart} dateFormat="dd/MM/yyyy" customInput={<StrictDateInput placeholder="DD/MM/YYYY" />} required />
          ) : (
            <div>
              <DatePicker selected={adminFormData.dateEnd} onChange={(date) => handleDateChange('dateEnd', date)} minDate={adminFormData.dateStart} dateFormat="dd/MM/yyyy" customInput={<StrictDateInput disabled={isCurrentlyEmployed} placeholder="DD/MM/YYYY" />} required={!isCurrentlyEmployed} />
              <label className="flex items-center gap-2 mt-3 ml-1 cursor-pointer">
                <input type="checkbox" checked={isCurrentlyEmployed} onChange={(e) => { setIsCurrentlyEmployed(e.target.checked); if(e.target.checked) setAdminFormData({...adminFormData, dateEnd: null}); }} className="rounded border-gray-600 text-orange-500 focus:ring-orange-500 bg-transparent" />
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Currently working here (Present)</span>
              </label>
            </div>
          )}
        </div>
      </div>

      {!isWebinar && (
        <div>
          <label className={labelClass}>{isOfferLetter ? 'Manager Name' : 'Reporting Lead Name (Optional)'}</label>
          <input type="text" name="lead" value={adminFormData.lead} onChange={handleAdminInputChange} required={isOfferLetter} className={inputClass} placeholder="e.g., Jane Doe" />
        </div>
      )}
    </div>
  );
};

export default UnifiedForm;
