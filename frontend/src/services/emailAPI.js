import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';


export const subscribeEmail = async (email) => {
  const response = await axios.post(`${API_BASE}/api/v1/email/subscribe`, { email });
  return response.data;
};
