// ==========================================
// 🔐 ADMIN & FOLDER IDS
// ==========================================
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "tiesverse_admin_2026";

const CERT_FOLDER_ID = "17CA2HR1KszLiDJhcGEB-ne-S7-nDwY4m"; 
const TEMPLATE_WEBINAR = "13-IyAD6KIgjQ0Ecy4_rXGo12fMQYmta-joisaQQ0BRA";

// ✅ MULTI-TEMPLATE OFFER LETTERS
const TEMPLATE_OFFER_LETTER_TECHTIES = "15u4LEr7dr_y2UjipAqdVop6UQk8wb7sXMYKjwEp7X_4"; 
const TEMPLATE_OFFER_LETTER_TIESVERSE = "1ldkJrA8vRTT45wUPwgcNHVTA0qV0j5es-ZiNdfCAqVc"; 

const TEMPLATE_INTERNSHIP_MALE = "1qu_vlha8KaWrBnL5J11yuEP5PgvWhKv_JA01lRJVZIA";
const TEMPLATE_INTERNSHIP_FEMALE = "1lGyX82Q6eKfPoiDepBbnVqdoDisfkIs6ojAlDcju_ps";
const TEMPLATE_MEMBER_MALE = "1tjYQs8146iqd3PRd3dwFV8_0oh2s1Jlve5o9thO8X1M";
const TEMPLATE_MEMBER_FEMALE = "1we_NvaxAKu9FqrVEkaJZym8qhX9Q6zyLoJF--9ciFJg";

// ✅ DEDICATED SHEET MAPPING
const SHEET_NAMES = {
  'Webinar': 'Webinar',
  'Internship': 'Internship',
  'Member Certificate': 'Member Certificate',
  'Offer Letter - TechTies': 'Offer Letter - TechTies',
  'Offer Letter - TiesVerse': 'Offer Letter - TiesVerse'
};

// Controls the timeline progression logic
const STAGE_WEIGHT = { 'Webinar': 0, 'Offer Letter': 1, 'Internship': 2, 'Member Certificate': 3 };

// ==========================================
// 🛠️ MULTI-SHEET RELATIONAL DB SETUP
// ==========================================
function setupDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const headers = [
    'Primary_ID', 'Stage', 'Gender', 'Name', 'Role', 'Date_Start', 'Date_End', 'Lead_Manager', 
    'Status', 'Timestamp', 
    'Code_Offer', 'Link_Offer', 
    'Code_Intern', 'Link_Intern', 
    'Code_Member', 'Link_Member', 
    'Code_Webinar', 'Link_Webinar',
    'Offer_Template_Used' // Tracks which offer template was selected
  ];

  Object.values(SHEET_NAMES).forEach(sheetName => {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) sheet = ss.insertSheet(sheetName);
    sheet.clear();
    sheet.appendRow(headers);
    sheet.getRange("A1:S1").setFontWeight("bold");
    sheet.setFrozenRows(1);
  });
  
  // Clean up default sheet if it exists
  let sheet1 = ss.getSheetByName("Sheet1");
  if (sheet1 && ss.getSheets().length > 1) ss.deleteSheet(sheet1);
}

// ==========================================
// 🔍 HELPER FUNCTIONS
// ==========================================
function getTargetSheetName(category, offerTemplate) {
   if (category === 'Offer Letter') return offerTemplate === 'TiesVerse' ? SHEET_NAMES['Offer Letter - TiesVerse'] : SHEET_NAMES['Offer Letter - TechTies'];
   return SHEET_NAMES[category];
}

function getNextPrimaryId(ss) {
  const sheets = Object.values(SHEET_NAMES).map(name => ss.getSheetByName(name)).filter(s => s);
  let maxId = 1000; // Start clean at 1000
  for (let s = 0; s < sheets.length; s++) {
    let data = sheets[s].getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      let id = parseInt(data[i][0], 10);
      if (!isNaN(id) && id > maxId) maxId = id;
    }
  }
  return maxId + 1;
}

function findUserRow(primaryId, ss) {
  const sheets = Object.values(SHEET_NAMES).map(name => ss.getSheetByName(name)).filter(s => s);
  for (let s = 0; s < sheets.length; s++) {
    let sheet = sheets[s];
    let data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === String(primaryId).trim()) return { sheet: sheet, rowIndex: i + 1, rowData: data[i] };
    }
  }
  return null;
}

function generateDynamicCode(category, existingCodesSet) {
  let prefix = "GEN"; let numLength = 7;
  if (category === 'Internship') { prefix = "INT"; numLength = 7; }
  else if (category === 'Member Certificate') { prefix = "MEM"; numLength = 7; } 
  else if (category === 'Webinar') { prefix = "WEB"; numLength = 7; }
  else if (category === 'Offer Letter') { prefix = "OFF"; numLength = 6; } 
  
  let isUnique = false; let newCode = "";
  while (!isUnique) {
    let randomNums = "";
    for(let i = 0; i < numLength; i++) randomNums += Math.floor(Math.random() * 10).toString();
    newCode = prefix + randomNums;
    if (!existingCodesSet.has(newCode)) { isUnique = true; existingCodesSet.add(newCode); }
  }
  return newCode;
}

function formatDateString(dateString) {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
  } catch(e) { return dateString; }
}

// ==========================================
// 📄 PDF ENGINE
// ==========================================
function createCertificatePDF(userData, code, generationTarget, offerTemplateType) {
  let templateId = "";
  let genderPronoun = "his/her"; 
  
  if (generationTarget === 'Webinar') templateId = TEMPLATE_WEBINAR;
  else if (generationTarget === 'Offer Letter') {
      templateId = (offerTemplateType === 'TiesVerse') ? TEMPLATE_OFFER_LETTER_TIESVERSE : TEMPLATE_OFFER_LETTER_TECHTIES;
  }
  else if (generationTarget === 'Internship') {
    if (userData.gender === 'Male') { templateId = TEMPLATE_INTERNSHIP_MALE; genderPronoun = "his"; }
    else if (userData.gender === 'Female') { templateId = TEMPLATE_INTERNSHIP_FEMALE; genderPronoun = "her"; }
  } else if (generationTarget === 'Member Certificate') {
    if (userData.gender === 'Male') { templateId = TEMPLATE_MEMBER_MALE; genderPronoun = "his"; }
    else if (userData.gender === 'Female') { templateId = TEMPLATE_MEMBER_FEMALE; genderPronoun = "her"; }
  }
  
  if (!templateId) throw new Error("Invalid template mapping during generation.");

  const folder = DriveApp.getFolderById(CERT_FOLDER_ID);
  const templateFile = DriveApp.getFileById(templateId);
  const tempFile = templateFile.makeCopy(`Temp_${code}`, folder);
  const tempSlide = SlidesApp.openById(tempFile.getId());
  
  const today = formatDateString(new Date()); 
  const formattedStartIssue = formatDateString(userData.dateStartIssue);
  const formattedEnd = (userData.dateEnd && String(userData.dateEnd).toLowerCase() !== 'present') ? formatDateString(userData.dateEnd) : String(userData.dateEnd || 'Present');

  if (generationTarget === 'Offer Letter') {
    tempSlide.replaceAllText("{issue_date}", formattedStartIssue);
    tempSlide.replaceAllText("{employee_name}", String(userData.name));
    tempSlide.replaceAllText("{ Employee name}", String(userData.name)); 
    tempSlide.replaceAllText("{job_title}", String(userData.role));
    tempSlide.replaceAllText("{role}", String(userData.role)); // Maps role for the TiesVerse template
    tempSlide.replaceAllText("{manager_name}", String(userData.leadAuthor || ''));
    tempSlide.replaceAllText("{joining_date}", formattedEnd); 
    tempSlide.replaceAllText("{certificate_id}", String(code)); 
  } else {
    tempSlide.replaceAllText("{intern_name}", String(userData.name));
    tempSlide.replaceAllText("{gender_pronoun}", genderPronoun);
    tempSlide.replaceAllText("{start_date}", formattedStartIssue);
    tempSlide.replaceAllText("{end_date}", formattedEnd);
    tempSlide.replaceAllText("{role}", String(userData.role));
    tempSlide.replaceAllText("{lead_name}", String(userData.leadAuthor || ''));
    tempSlide.replaceAllText("{issue_date}", today); 
    tempSlide.replaceAllText("{certificate_id}", String(code));
  }
  
  tempSlide.saveAndClose(); 
  const pdfBlob = tempFile.getAs(MimeType.PDF);
  const newPdfFile = folder.createFile(pdfBlob).setName(`${generationTarget}_${userData.name}_${code}.pdf`);
  tempFile.setTrashed(true);
  return newPdfFile.getUrl();
}

function mapRowToObject(row) {
  return {
    primaryId: String(row[0]), stage: String(row[1]), gender: String(row[2]), primaryName: String(row[3]), 
    secondaryRole: String(row[4]), date1: String(row[5]), date2: String(row[6]),
    lead: String(row[7]), status: String(row[8]), timestamp: String(row[9]), 
    codeOffer: String(row[10] || ''), codeIntern: String(row[12] || ''), 
    codeMember: String(row[14] || ''), codeWebinar: String(row[16] || ''),
    links: { offer: String(row[11] || ''), internship: String(row[13] || ''), member: String(row[15] || ''), webinar: String(row[17] || '') }
  };
}

// ==========================================
// 🔍 GLOBAL CROSS-SHEET SEARCH
// ==========================================
function doGet(e) {
  if (!e || !e.parameter || !e.parameter.code) return ContentService.createTextOutput("API Online.");
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const searchCode = String(e.parameter.code).trim().toUpperCase();
    const sheets = Object.values(SHEET_NAMES).map(name => ss.getSheetByName(name)).filter(s => s);
    
    for (let s = 0; s < sheets.length; s++) {
      let data = sheets[s].getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (!data[i][0]) continue; 
        const matches = [String(data[i][10]), String(data[i][12]), String(data[i][14]), String(data[i][16])].some(c => c.trim().toUpperCase() === searchCode);
        if (matches) return ContentService.createTextOutput(JSON.stringify(mapRowToObject(data[i]))).setMimeType(ContentService.MimeType.JSON);
      }
    }
    return ContentService.createTextOutput(JSON.stringify({error: "Code not found in any database stage."})).setMimeType(ContentService.MimeType.JSON);
  } catch (error) { return ContentService.createTextOutput(JSON.stringify({error: "Server error occurred."})).setMimeType(ContentService.MimeType.JSON); }
}

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  try {
    const req = JSON.parse(e.postData.contents);
    if (req.action === 'login') {
      if (req.username === ADMIN_USERNAME && req.password === ADMIN_PASSWORD) return ContentService.createTextOutput(JSON.stringify({success: true, token: "admin_verified"})).setMimeType(ContentService.MimeType.JSON);
      else return ContentService.createTextOutput(JSON.stringify({error: "Invalid Admin Credentials."})).setMimeType(ContentService.MimeType.JSON);
    }

    // Build Global Code Set to prevent collisions
    let existingCodes = new Set();
    const allSheets = Object.values(SHEET_NAMES).map(name => ss.getSheetByName(name)).filter(s => s);
    let allDataAggregated = [];
    
    for (let s = 0; s < allSheets.length; s++) {
      let d = allSheets[s].getDataRange().getValues();
      for (let i = 1; i < d.length; i++) {
        if(d[i][0]) allDataAggregated.push(d[i]);
        existingCodes.add(String(d[i][10])); existingCodes.add(String(d[i][12])); 
        existingCodes.add(String(d[i][14])); existingCodes.add(String(d[i][16])); 
      }
    }
    
    // 🚀 CRM UPDATE RECORD (INLINE EDITING)
    if (req.action === 'update_user') {
       let record = findUserRow(req.primaryId, ss);
       if (!record) return ContentService.createTextOutput(JSON.stringify({error: "Record not found for update."})).setMimeType(ContentService.MimeType.JSON);
       
       record.sheet.getRange(record.rowIndex, 3, 1, 6).setValues([[ req.data.gender, req.data.name, req.data.role, req.data.dateStart, req.data.dateEnd, req.data.lead ]]);
       return ContentService.createTextOutput(JSON.stringify({success: true, message: "Record updated successfully."})).setMimeType(ContentService.MimeType.JSON);
    }

    // 🚀 CRM PIPELINE GENERATION
    if (req.action === 'pipeline_generate') {
       let record = findUserRow(req.primaryId, ss);
       if (!record) return ContentService.createTextOutput(JSON.stringify({error: "User ID not found."})).setMimeType(ContentService.MimeType.JSON);
       
       const generationTarget = req.target_stage; 
       let userData = { category: String(record.rowData[1]), gender: String(record.rowData[2]), name: String(record.rowData[3]), role: String(record.rowData[4]), dateStartIssue: String(record.rowData[5]), dateEnd: String(record.rowData[6]), leadAuthor: String(record.rowData[7]) };
       
       const newStageCode = generateDynamicCode(generationTarget, existingCodes);
       const pdfUrl = createCertificatePDF(userData, newStageCode, generationTarget, req.offerTemplate);
       
       let updatedRow = [...record.rowData];
       let currentStage = updatedRow[1];

       if (generationTarget === 'Offer Letter') { updatedRow[10] = newStageCode; updatedRow[11] = pdfUrl; updatedRow[18] = req.offerTemplate; }
       else if (generationTarget === 'Internship') { updatedRow[12] = newStageCode; updatedRow[13] = pdfUrl; }
       else if (generationTarget === 'Member Certificate') { updatedRow[14] = newStageCode; updatedRow[15] = pdfUrl; }
       else if (generationTarget === 'Webinar') { updatedRow[16] = newStageCode; updatedRow[17] = pdfUrl; }

       // Timeline Logic: If upgrading, move the row to the proper dedicated sheet
       if (STAGE_WEIGHT[generationTarget] > STAGE_WEIGHT[currentStage]) {
           updatedRow[1] = generationTarget;
           let targetSheetName = getTargetSheetName(generationTarget, req.offerTemplate);
           let targetSheet = ss.getSheetByName(targetSheetName);
           targetSheet.appendRow(updatedRow);
           record.sheet.deleteRow(record.rowIndex);
       } else {
           // Regenerating an older stage (timeline tracking without downgrading primary stage)
           record.sheet.getRange(record.rowIndex, 1, 1, updatedRow.length).setValues([updatedRow]);
       }

       return ContentService.createTextOutput(JSON.stringify({success: true, message: `${generationTarget} generated!`, url: pdfUrl, newCode: newStageCode, target: generationTarget})).setMimeType(ContentService.MimeType.JSON);
    }

    if (req.action === 'search_users') {
      const searchTerm = String(req.query).toLowerCase().trim();
      if (!searchTerm) return ContentService.createTextOutput(JSON.stringify({success: true, results: []})).setMimeType(ContentService.MimeType.JSON);
      let results = [];
      for (let i = 0; i < allDataAggregated.length; i++) {
        const name = String(allDataAggregated[i][3]).toLowerCase();
        const role = String(allDataAggregated[i][4]).toLowerCase();
        const matchesCode = [10, 12, 14, 16].some(idx => String(allDataAggregated[i][idx]).toLowerCase().includes(searchTerm));
        if (name.includes(searchTerm) || role.includes(searchTerm) || matchesCode) results.push(mapRowToObject(allDataAggregated[i]));
      }
      return ContentService.createTextOutput(JSON.stringify({success: true, results: results})).setMimeType(ContentService.MimeType.JSON);
    }

    // 🚀 NEW RECORD UPLOADS (Single / Bulk)
    let nextId = getNextPrimaryId(ss);
    const timestamp = new Date();
    const status = "Active";

    function isDuplicateRecord(cat, name, role, dStart, dEnd) {
       for (let i = 0; i < allDataAggregated.length; i++) {
         if (String(allDataAggregated[i][3]).trim().toLowerCase() === String(name).trim().toLowerCase() && String(allDataAggregated[i][5]).trim().toLowerCase() === String(dStart).trim().toLowerCase()) return true;
       }
       return false;
    }

    if (req.action === 'bulk_upload' && Array.isArray(req.data)) {
      let successCount = 0; let duplicateCount = 0; let invalidCount = 0;
      const category = req.category;
      
      for (let i = 0; i < req.data.length; i++) {
         let row = req.data[i];
         if (!row.name || !row.dateStart || !row.gender) { invalidCount++; continue; } 
         if (isDuplicateRecord(category, row.name, row.role, row.dateStart, row.dateEnd)) { duplicateCount++; continue; }

         let newCode = generateDynamicCode(category, existingCodes);
         let pdfUrl = "";
         try { pdfUrl = createCertificatePDF({ category: category, gender: row.gender, name: row.name, role: row.role, dateStartIssue: row.dateStart, dateEnd: row.dateEnd||'', leadAuthor: row.lead||'' }, newCode, category, row.offerTemplate); } catch(e) { pdfUrl = ""; }

         let r = [nextId, category, row.gender, row.name, row.role, row.dateStart, row.dateEnd || '', row.lead || '', status, timestamp, '', '', '', '', '', '', '', '', row.offerTemplate || ''];
         if(category==='Offer Letter') { r[10] = newCode; r[11] = pdfUrl; }
         else if(category==='Internship') { r[12] = newCode; r[13] = pdfUrl; }
         else if(category==='Member Certificate') { r[14] = newCode; r[15] = pdfUrl; }
         else if(category==='Webinar') { r[16] = newCode; r[17] = pdfUrl; }
         
         let tSheetName = getTargetSheetName(category, row.offerTemplate);
         ss.getSheetByName(tSheetName).appendRow(r);
         nextId++; successCount++;
      }
      return ContentService.createTextOutput(JSON.stringify({success: true, message: `Batch Complete: ${successCount} generated. Skipped ${duplicateCount} duplicates.`})).setMimeType(ContentService.MimeType.JSON);
    } 
    
    if (req.action === 'single_upload') {
      if (isDuplicateRecord(req.category, req.data.name, req.data.role, req.data.dateStart, req.data.dateEnd)) return ContentService.createTextOutput(JSON.stringify({error: "Duplicate Entry Detected."})).setMimeType(ContentService.MimeType.JSON);
      
      let newCode = generateDynamicCode(req.category, existingCodes);
      let pdfUrl = "";
      try { pdfUrl = createCertificatePDF({ category: req.category, gender: req.data.gender||'', name: req.data.name, role: req.data.role, dateStartIssue: req.data.dateStart, dateEnd: req.data.dateEnd||'', leadAuthor: req.data.lead||'' }, newCode, req.category, req.data.offerTemplate); } catch(e) { pdfUrl = ""; }

      let r = [nextId, req.category, req.data.gender || '', req.data.name, req.data.role, req.data.dateStart, req.data.dateEnd || '', req.data.lead || '', status, timestamp, '', '', '', '', '', '', '', '', req.data.offerTemplate || ''];
      if(req.category==='Offer Letter') { r[10] = newCode; r[11] = pdfUrl; }
      else if(req.category==='Internship') { r[12] = newCode; r[13] = pdfUrl; }
      else if(req.category==='Member Certificate') { r[14] = newCode; r[15] = pdfUrl; }
      else if(req.category==='Webinar') { r[16] = newCode; r[17] = pdfUrl; }

      let tSheetName = getTargetSheetName(req.category, req.data.offerTemplate);
      ss.getSheetByName(tSheetName).appendRow(r);

      return ContentService.createTextOutput(JSON.stringify({success: true, code: newCode, pdfUrl: pdfUrl})).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({error: "Invalid Action Request."})).setMimeType(ContentService.MimeType.JSON);
  } catch (error) { return ContentService.createTextOutput(JSON.stringify({error: "Failed to process data. System error."})).setMimeType(ContentService.MimeType.JSON); }
}
