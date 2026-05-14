import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import StrictDateInput from './ui/StrictDateInput';
import { ROLES_LIST, PIPELINE_STAGES } from '../constants';
import { displayFormat, parseDateForFrontend, formatDateForBackend } from '../utils/dateUtils';
import { updateUser, generatePipeline } from '../api/verificationApi';

/**
 * 📄 CRM DASHBOARD (Admin Panel)
 * Full profile view with edit capabilities, pipeline document generation, and record management.
 */
const CRMDashboard = ({ initialData, searchCodeUsed, onBack, isAdmin }) => {
  const [data, setData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [loadingAction, setLoadingAction] = useState(null);
  const [message, setMessage] = useState('');
  const [crmOfferTemplate, setCrmOfferTemplate] = useState('TechTies');

  const startEdit = () => {
      setEditForm({ gender: data.gender || 'Male', name: data.primaryName, role: data.secondaryRole, dateStart: parseDateForFrontend(data.date1), dateEnd: parseDateForFrontend(data.date2), lead: data.lead, isCurrentlyEmployed: String(data.date2).toLowerCase() === 'present' });
      setIsEditing(true); setMessage('');
  };

  const saveEdit = async () => {
      setLoadingAction('Saving changes...'); setMessage('');
      try {
          const editPayload = { ...editForm, dateStart: formatDateForBackend(editForm.dateStart), dateEnd: editForm.isCurrentlyEmployed ? 'Present' : formatDateForBackend(editForm.dateEnd) };
          const result = await updateUser(data.primaryId, editPayload);
          if (result.success) {
              setData({ ...data, gender: editForm.gender, primaryName: editForm.name, secondaryRole: editForm.role, date1: editPayload.dateStart, date2: editPayload.dateEnd, lead: editForm.lead });
              setIsEditing(false); setMessage('Record updated successfully.');
          } else { setMessage(`Update failed: ${result.error}`); }
      } catch (err) { setMessage('Network error during update.'); }
      setLoadingAction(null);
  };

  const generatePipelineStage = async (targetStage) => {
      setLoadingAction(`Generating ${targetStage}...`); setMessage('');
      try {
          const result = await generatePipeline(data.primaryId, targetStage, targetStage === 'Offer Letter' ? crmOfferTemplate : null);
          if (result.success) {
              let updatedLinks = { ...data.links }; let updatedData = { ...data };
              if (targetStage === 'Offer Letter') { updatedLinks.offer = result.url; updatedData.codeOffer = result.newCode; }
              if (targetStage === 'Internship') { updatedLinks.internship = result.url; updatedData.codeIntern = result.newCode; }
              if (targetStage === 'Member Certificate') { updatedLinks.member = result.url; updatedData.codeMember = result.newCode; }
              setData({ ...updatedData, stage: targetStage !== 'Offer Letter' ? targetStage : data.stage, links: updatedLinks });
              setMessage(`${targetStage} generated & linked!`);
          } else { setMessage(`Generation failed: ${result.error}`); }
      } catch (err) { setMessage('Network error during generation.'); }
      setLoadingAction(null);
  };

  const labelClass = "block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1";
  const inputClass = "w-full bg-[#030303] border border-white/[0.05] rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-orange-500/50 transition-all shadow-inner";

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4 md:py-6 animate-[fadeIn_0.5s_ease-out] flex flex-col gap-6">
      <div className="flex justify-between items-center bg-gradient-to-r from-white/[0.05] to-transparent backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-6 shadow-lg relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-2 h-full bg-orange-500 shadow-[0_0_30px_#f97316]`}></div>
        <div><p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">UNIFIED PROFILE {isAdmin && `| ID: ${data.primaryId}`}</p><h2 className="text-3xl font-bold text-white tracking-tight">{data.primaryName}</h2></div>
        <div className="flex gap-3"><button onClick={onBack} className="px-5 py-2.5 bg-white/[0.05] rounded-xl text-gray-300 hover:text-white border border-white/10 text-sm font-bold transition-all">Close</button>{isAdmin && !isEditing && <button onClick={startEdit} className="px-5 py-2.5 bg-orange-500/10 rounded-xl text-orange-500 hover:bg-orange-500/20 border border-orange-500/30 text-sm font-bold transition-all shadow-[0_0_15px_rgba(249,115,22,0.1)]">Edit Data</button>}</div>
      </div>
      {message && <div className={`p-4 rounded-xl text-xs font-bold uppercase tracking-widest text-center ${message.includes('failed') || message.includes('error') ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-green-500/10 text-green-400 border border-green-500/30'}`}>{message}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 bg-[#080808] border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl">
             <h3 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-4">Core Information</h3>
             {isEditing ? (
                 <div className="space-y-5">
                    <div className="flex bg-[#030303] p-1.5 rounded-xl border border-white/[0.03]">
                       <button type="button" onClick={() => setEditForm({...editForm, gender: 'Male'})} className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${editForm.gender === 'Male' ? 'bg-white/10 text-white' : 'text-gray-600 hover:text-gray-400'}`}>Male Identity</button>
                       <button type="button" onClick={() => setEditForm({...editForm, gender: 'Female'})} className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${editForm.gender === 'Female' ? 'bg-white/10 text-white' : 'text-gray-600 hover:text-gray-400'}`}>Female Identity</button>
                    </div>
                    <div><label className={labelClass}>Full Name</label><input type="text" name="name" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className={inputClass} /></div>
                    <div><label className={labelClass}>Role / Title</label><input type="text" name="role" list="roles-edit-datalist" value={editForm.role} onChange={(e) => setEditForm({...editForm, role: e.target.value})} className={inputClass} /><datalist id="roles-edit-datalist">{ROLES_LIST.map((r, i) => <option key={i} value={r} />)}</datalist></div>
                    <div className="grid grid-cols-2 gap-5">
                       <div><label className={labelClass}>Start / Issue Date</label><DatePicker selected={editForm.dateStart} onChange={(d) => setEditForm({...editForm, dateStart: d})} dateFormat="dd/MM/yyyy" customInput={<StrictDateInput placeholder="DD/MM/YYYY" />} /></div>
                       <div><label className={labelClass}>End / Join Date</label><DatePicker selected={editForm.dateEnd} onChange={(d) => setEditForm({...editForm, dateEnd: d})} minDate={editForm.dateStart} dateFormat="dd/MM/yyyy" customInput={<StrictDateInput disabled={editForm.isCurrentlyEmployed} placeholder="DD/MM/YYYY" />} /><label className="flex items-center gap-2 mt-3 ml-1 cursor-pointer"><input type="checkbox" checked={editForm.isCurrentlyEmployed} onChange={(e) => setEditForm({...editForm, isCurrentlyEmployed: e.target.checked, dateEnd: null})} className="rounded border-gray-600 text-orange-500 focus:ring-orange-500 bg-transparent" /><span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Present / Active</span></label></div>
                    </div>
                    <div><label className={labelClass}>Lead / Manager</label><input type="text" name="lead" value={editForm.lead} onChange={(e) => setEditForm({...editForm, lead: e.target.value})} className={inputClass} /></div>
                    <div className="flex gap-4 pt-4 mt-4 border-t border-white/5">
                        <button onClick={saveEdit} disabled={loadingAction} className="flex-1 py-3 bg-orange-500/20 text-orange-500 border border-orange-500/50 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-orange-500/30 transition-all">{loadingAction ? 'Saving...' : 'Save Updates'}</button>
                        <button onClick={() => setIsEditing(false)} className="flex-1 py-3 bg-white/5 text-gray-300 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all">Cancel</button>
                    </div>
                 </div>
             ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                    <div><p className={labelClass}>Gender / Routing</p><p className="text-base text-gray-200">{data.gender || 'Not Specified'}</p></div>
                    <div><p className={labelClass}>Role / Title</p><p className="text-base text-gray-200">{data.secondaryRole}</p></div>
                    <div><p className={labelClass}>Start / Issue Date</p><p className="text-base text-gray-200">{displayFormat(data.date1)}</p></div>
                    <div><p className={labelClass}>End / Join Date</p><p className="text-base text-gray-200">{String(data.date2).toLowerCase() === 'present' ? 'Present' : displayFormat(data.date2)}</p></div>
                    {data.lead && <div className="md:col-span-2"><p className={labelClass}>Reporting Manager / Lead</p><p className="text-base text-gray-200">{data.lead}</p></div>}
                 </div>
             )}
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
             <div className="bg-[#050505] border border-white/5 rounded-3xl p-6 shadow-inner">
                 <h3 className="text-sm font-bold text-gray-300 mb-5 uppercase tracking-wider flex items-center gap-2">
                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Pipeline Hub
                 </h3>
                 <div className="space-y-3">
                     {PIPELINE_STAGES.map((stage, idx) => {
                         const linkKey = stage === 'Offer Letter' ? 'offer' : stage === 'Internship' ? 'internship' : 'member';
                         const codeKey = stage === 'Offer Letter' ? 'codeOffer' : stage === 'Internship' ? 'codeIntern' : 'codeMember';
                         const hasDoc = !!data.links[linkKey];
                         
                         return (
                            <div key={idx} className="p-4 rounded-xl border border-white/5 bg-[#080808]">
                                <div className="flex justify-between items-center mb-3">
                                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stage}</p>
                                   {hasDoc && <span className="text-[9px] px-2 py-1 bg-green-500/10 text-green-400 rounded font-mono">{data[codeKey]}</span>}
                                </div>
                                {stage === 'Offer Letter' && !hasDoc && isAdmin && (
                                   <select value={crmOfferTemplate} onChange={(e) => setCrmOfferTemplate(e.target.value)} className="w-full bg-[#030303] border border-white/10 rounded-lg px-3 py-2 text-xs text-white mb-3 focus:outline-none focus:border-orange-500">
                                     <option value="TechTies">TechTies Template</option>
                                     <option value="TiesVerse">TiesVerse Template</option>
                                   </select>
                                )}
                                <div className="flex gap-2">
                                  {hasDoc && <a href={data.links[linkKey]} target="_blank" rel="noreferrer" className="flex-1 py-2.5 bg-white/5 text-center rounded-lg text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-all border border-white/10">View {stage}</a>}
                                  {isAdmin && (!hasDoc || stage === 'Offer Letter') && (
                                      <button onClick={() => generatePipelineStage(stage)} disabled={loadingAction} className={`flex-1 py-2.5 ${hasDoc ? 'bg-orange-500/5 hover:bg-orange-500/10 text-orange-500/80 border-orange-500/20' : 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border-orange-500/30'} rounded-lg text-xs font-bold transition-all border disabled:opacity-30`}>
                                        {hasDoc ? 'Regenerate' : `Generate ${stage}`}
                                      </button>
                                  )}
                                </div>
                            </div>
                         );
                     })}
                 </div>
             </div>
          </div>
      </div>
    </div>
  );
};

export default CRMDashboard;
