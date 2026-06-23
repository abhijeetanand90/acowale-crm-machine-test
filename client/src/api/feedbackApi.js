import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function createFeedback(payload) {
  const response = await axios.post(`${API_BASE_URL}/api/feedback`, payload);
  return response.data;
}

export async function getFeedbackSummary() {
  const response = await axios.get(`${API_BASE_URL}/api/feedback/summary`);
  return response.data;
}

export async function getFeedbackList(filters = {}) {
  const params = new URLSearchParams();

  if (filters.search) params.append("search", filters.search);
  if (filters.category) params.append("category", filters.category);
  if (filters.status) params.append("status", filters.status);

  params.append("page", filters.page || 1);
  params.append("limit", filters.limit || 10);

  const response = await axios.get(`${API_BASE_URL}/api/feedback?${params.toString()}`);
  return response.data;
}