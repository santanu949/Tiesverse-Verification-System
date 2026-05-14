import { API_URL } from '../constants';

/**
 * Authenticates admin credentials.
 */
export const loginAdmin = async (loginData) => {
  const response = await fetch(API_URL, { method: 'POST', body: JSON.stringify({ action: 'login', ...loginData }) });
  return response.json();
};

/**
 * Looks up a user/record by verification code (GET request).
 */
export const lookupByCode = async (code) => {
  const response = await fetch(`${API_URL}?code=${code}`);
  return response.json();
};

/**
 * Submits a single record upload.
 */
export const singleUpload = async (category, data) => {
  const payload = { action: 'single_upload', category, data };
  const response = await fetch(API_URL, { method: 'POST', body: JSON.stringify(payload) });
  return response.json();
};

/**
 * Executes a bulk CSV upload.
 */
export const bulkUpload = async (category, data) => {
  const payload = { action: 'bulk_upload', category, data };
  const response = await fetch(API_URL, { method: 'POST', body: JSON.stringify(payload) });
  return response.json();
};

/**
 * Searches users by name, role, or code (admin CRM search).
 */
export const searchUsers = async (query) => {
  const response = await fetch(API_URL, { method: 'POST', body: JSON.stringify({ action: 'search_users', query }) });
  return response.json();
};

/**
 * Updates a user record.
 */
export const updateUser = async (primaryId, data) => {
  const payload = { action: 'update_user', primaryId, data };
  const response = await fetch(API_URL, { method: 'POST', body: JSON.stringify(payload) });
  return response.json();
};

/**
 * Generates a pipeline stage document (Offer Letter / Internship / Member Certificate).
 */
export const generatePipeline = async (primaryId, targetStage, offerTemplate = null) => {
  const payload = { action: 'pipeline_generate', primaryId, target_stage: targetStage, offerTemplate: targetStage === 'Offer Letter' ? offerTemplate : null };
  const response = await fetch(API_URL, { method: 'POST', body: JSON.stringify(payload) });
  return response.json();
};
